import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText } from "lucide-react";
import { generateSqlQuery } from "@/lib/generateSqlQuery";
import { downloadCsv } from "@/lib/csvExport";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FormSubmission } from "@shared/schema";

export default function ConfirmationPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [sqlQuery, setSqlQuery] = useState("");
  const [formData, setFormData] = useState<FormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if no submission data is available
  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/form-submissions', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch submission data');
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
          throw new Error('No submission data found');
        }
        
        // Get the most recent submission
        const latestSubmission = data[data.length - 1];
        setFormData(latestSubmission);
        
        // Generate SQL query based on form data
        const query = generateSqlQuery(latestSubmission);
        setSqlQuery(query);
      } catch (error) {
        console.error('Error fetching submission data:', error);
        toast({
          title: "Error",
          description: "Failed to load submission data",
          variant: "destructive",
        });
        setLocation("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissionData();
  }, [setLocation, toast]);

  const handleDownloadCsv = async () => {
    try {
      setIsLoading(true);
      
      // Get CSV data from the server
      const response = await fetch('/api/export-csv', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'design_tool_data.csv';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "CSV report downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Error",
        description: "Failed to download CSV report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNew = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">圖片評估問卷</h1>
            <Button 
              variant="ghost" 
              className="text-[#4F7B6E] hover:text-[#3A5A51]"
              onClick={handleDownloadCsv}
              disabled={isLoading}
            >
              <Download className="mr-2 h-4 w-4" />
              導出CSV文件
            </Button>
          </div>
          <p className="text-gray-600 mt-2">請評估各圖片並提供您的反饋</p>
        </header>

        <Card className="bg-white rounded-lg shadow-md mb-6">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">問卷提交成功！</h2>
              <p className="text-gray-600 mb-8">感謝您完成此評估問卷。您的回答已被記錄。</p>
              
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-4">資料轉換</h3>
                <p className="text-gray-600 mb-4">我們已將您的回答轉換為以下SQL查詢供團隊使用：</p>
                <div className="bg-gray-800 text-gray-200 p-4 rounded-md text-sm text-left overflow-x-auto">
                  <pre><code id="sql-query">{sqlQuery || "-- 根據您的回答生成SQL查詢"}</code></pre>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  className="bg-[#4F7B6E] hover:bg-[#3A5A51] text-white"
                  onClick={handleDownloadCsv}
                  disabled={isLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  下載CSV報告
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#4F7B6E] text-[#4F7B6E] hover:bg-gray-50"
                  onClick={handleStartNew}
                  disabled={isLoading}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  開始新問卷
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>© 2025 圖片評估問卷. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
