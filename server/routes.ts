import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertResponseSchema, formDataSchema } from "@shared/schema";
import { createObjectCsvStringifier } from "csv-writer";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // API Routes
  app.post('/api/submit-form', async (req, res) => {
    try {
      // Validate form data
      const result = formDataSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: result.error.format() 
        });
      }
      
      const formData = result.data;
      
      // Create user record
      const userData = {
        name: formData.name,
        userGroup: formData.userGroup
      };
      
      const user = await storage.createUser(userData);
      
      // Create response record
      const responseData = {
        userId: user.id,
        question1: formData.question1,
        question1b: formData.question1b,
        question2: formData.question2,
        question2b: formData.question2b,
        question3: formData.question3,
        question3b: formData.question3b,
        question4: formData.question4,
        question4b: formData.question4b,
        question5: formData.question5,
        question5b: formData.question5b
      };
      
      const response = await storage.createResponse(responseData);
      
      // Return success with the form submission
      const submission = await storage.getFormSubmission(user.id);
      res.status(201).json({
        message: "Form submitted successfully",
        data: submission
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all form submissions (for admin/reporting)
  app.get('/api/form-submissions', async (req, res) => {
    try {
      const submissions = await storage.getAllFormSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error('Error getting form submissions:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get a specific form submission
  app.get('/api/form-submissions/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const submission = await storage.getFormSubmission(userId);
      if (!submission) {
        return res.status(404).json({ message: "Form submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error('Error getting form submission:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export form submissions as CSV
  app.get('/api/export-csv', async (req, res) => {
    try {
      const submissions = await storage.getAllFormSubmissions();
      
      if (submissions.length === 0) {
        return res.status(404).json({ message: "No form submissions to export" });
      }
      
      // Create CSV header from the first submission
      const headers = Object.keys(submissions[0])
        .filter(key => key !== 'id' && key !== 'completedAt')
        .map(key => ({ id: key, title: key }));
      
      const csvStringifier = createObjectCsvStringifier({
        header: headers
      });
      
      // Prepare data for CSV
      const csvData = submissions.map(submission => {
        const data: Record<string, any> = {};
        headers.forEach(header => {
          data[header.id] = submission[header.id as keyof typeof submission] || '';
        });
        return data;
      });
      
      // Generate CSV string
      const csvString = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(csvData);
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=design_tool_data.csv');
      res.status(200).send(csvString);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
