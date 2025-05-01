interface ProgressIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export default function ProgressIndicator({ currentPage, totalPages }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: "Registration" },
    { number: 2, label: "Form 1" },
    { number: 3, label: "Form 2" },
    { number: 4, label: "Form 3" },
    { number: 5, label: "Form 4" },
    { number: 6, label: "Form 5" },
    { number: 7, label: "Confirmation" }
  ];

  return (
    <div className="progress-indicator flex mb-8 overflow-x-auto pb-2">
      {steps.map((step) => (
        <div key={step.number} className="step flex flex-col items-center mr-4 min-w-[60px]">
          <div 
            className={`h-8 w-8 rounded-full flex items-center justify-center border-2 text-sm mb-1 ${
              step.number < currentPage
                ? "bg-[#4F7B6E] text-white border-[#4F7B6E]"
                : step.number === currentPage
                  ? "border-[#4F7B6E] text-[#4F7B6E]"
                  : "border-gray-300 text-gray-500"
            }`}
          >
            {step.number}
          </div>
          <span className="text-xs text-gray-600">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
