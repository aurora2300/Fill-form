import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export default function FormNavigation({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  isSubmitting
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {currentPage > 1 ? (
        <Button
          type="button"
          variant="outline"
          className="px-6 py-2 bg-[#4F7B6E] bg-opacity-20 text-[#4F7B6E] font-medium rounded-md hover:bg-opacity-30 border-none"
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          previous page
        </Button>
      ) : (
        <div></div>
      )}
      <div className="flex-grow"></div>
      <Button
        type="button"
        className="px-6 py-2 bg-[#4F7B6E] text-white font-medium rounded-md hover:bg-[#3A5A51]"
        onClick={onNext}
        disabled={isSubmitting}
      >
        {currentPage === totalPages ? "Submit" : "next page"}
      </Button>
    </div>
  );
}
