import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FormData, formDataSchema, registrationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

type ValidationResult = { isValid: boolean; errors: string[] };

export default function useFormPages(initialPage: number = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [formState, setFormState] = useState<FormData>({
    name: "",
    userGroup: "",
    question1: "",
    question1b: "",
    question2: "",
    question2b: "",
    question3: "",
    question3b: "",
    question4: "",
    question4b: "",
    question5: "",
    question5b: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < 501) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Validate current page
  const validateCurrentPage = async (): Promise<boolean> => {
    let isValid = true;
    let validationErrors: string[] = [];

    // Page 1: Registration (required fields)
    if (currentPage === 1) {
      try {
        const result = registrationSchema.safeParse(formState);
        
        if (!result.success) {
          isValid = false;
          const formattedErrors = result.error.format();
          
          // Extract and format error messages
          if (formattedErrors.name?._errors) {
            validationErrors.push(formattedErrors.name._errors[0]);
          }
          
          if (formattedErrors.userGroup?._errors) {
            validationErrors.push(formattedErrors.userGroup._errors[0]);
          }
          
          // Show toast with validation errors
          if (validationErrors.length > 0) {
            toast({
              title: "Please fix the following errors:",
              description: (
                <ul className="mt-2 ml-2 list-disc">
                  {validationErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              ),
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Validation error:", error);
        isValid = false;
      }
    }
    
    // For pages 2-6, we'll check if conditional questions are answered when needed
    if (currentPage === 2 && formState.question1 === "B" && !formState.question1b) {
      // Not strictly required, but we can show a reminder toast
      toast({
        title: "Reminder",
        description: "Don't forget to answer the follow-up question.",
        variant: "default",
      });
    }
    
    // Similar checks for other pages if needed
    // ...

    return isValid;
  };

  // Submit form
  const submitForm = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Final validation
      const validation = formDataSchema.safeParse(formState);
      if (!validation.success) {
        console.error("Form validation failed:", validation.error);
        toast({
          title: "Form validation failed",
          description: "Please make sure all required fields are filled correctly.",
          variant: "destructive",
        });
        return false;
      }
      
      // Submit to server
      const response = await apiRequest("POST", "/api/submit-form", formState);
      
      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }
      
      // Success
      toast({
        title: "Form submitted successfully",
        description: "Thank you for completing the survey!",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    formState,
    updateFormData,
    validateCurrentPage,
    goToNextPage,
    goToPreviousPage,
    submitForm,
    isSubmitting,
    errors
  };
}
