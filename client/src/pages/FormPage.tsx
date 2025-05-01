import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProgressIndicator from "@/components/ProgressIndicator";
import FormNavigation from "@/components/FormNavigation";
import useFormPages from "@/hooks/useFormPages";
import RegistrationPage from "@/components/form-pages/RegistrationPage";
import TeamCollaboration from "@/components/form-pages/TeamCollaboration";
import ClientCommunication from "@/components/form-pages/ClientCommunication";
import DesignHandoff from "@/components/form-pages/DesignHandoff";
import DesignSystem from "@/components/form-pages/DesignSystem";
import DataDesign from "@/components/form-pages/DataDesign";

export default function FormPage() {
  const params = useParams<{ page: string }>();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const pageNumber = parseInt(params.page);
  
  const {
    formState,
    updateFormData,
    validateCurrentPage,
    setCurrentPage,
    goToNextPage,
    goToPreviousPage,
    submitForm,
    isSubmitting
  } = useFormPages(pageNumber);

  // Check if page is valid
  useEffect(() => {
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 6) {
      setLocation("/");
      toast({
        title: "Invalid page",
        description: "The requested page doesn't exist.",
        variant: "destructive"
      });
    } else {
      setCurrentPage(pageNumber);
    }
  }, [pageNumber, setLocation, toast, setCurrentPage]);

  // Render appropriate form component based on current page
  const renderFormComponent = () => {
    switch (pageNumber) {
      case 1:
        return <RegistrationPage formState={formState} updateFormData={updateFormData} />;
      case 2:
        return <TeamCollaboration formState={formState} updateFormData={updateFormData} />;
      case 3:
        return <ClientCommunication formState={formState} updateFormData={updateFormData} />;
      case 4:
        return <DesignHandoff formState={formState} updateFormData={updateFormData} />;
      case 5:
        return <DesignSystem formState={formState} updateFormData={updateFormData} />;
      case 6:
        return <DataDesign formState={formState} updateFormData={updateFormData} />;
      default:
        return <div>Invalid Page</div>;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentPage();
    if (isValid) {
      if (pageNumber === 6) {
        const success = await submitForm();
        if (success) {
          setLocation("/confirmation");
        }
      } else {
        goToNextPage();
        setLocation(`/form/${pageNumber + 1}`);
      }
    }
  };

  const handlePrevious = () => {
    goToPreviousPage();
    setLocation(`/form/${pageNumber - 1}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">圖片評估問卷</h1>
          <p className="text-gray-600 mt-2">請評估各圖片並提供您的反饋</p>
        </header>

        <Card className="bg-white rounded-lg shadow-md mb-6">
          <CardContent className="p-6">
            <ProgressIndicator currentPage={pageNumber} totalPages={7} />
            
            <div className="form-container mt-8">
              {renderFormComponent()}
            </div>

            <FormNavigation 
              currentPage={pageNumber} 
              totalPages={6}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>© 2025 圖片評估問卷. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
