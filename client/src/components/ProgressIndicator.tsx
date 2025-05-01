interface ProgressIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export default function ProgressIndicator({ currentPage, totalPages }: ProgressIndicatorProps) {
  // For a 502-page form, we need a different approach to the progress indicator
  // Instead of showing all steps, we'll show:
  // 1. Registration (always)
  // 2. Current page number and total (e.g., "Page 25 of 500")
  // 3. Confirmation (always)
  
  // Calculate percentage of completion (excluding registration and confirmation)
  const percentage = Math.floor(((currentPage - 1) / 500) * 100);
  
  return (
    <div className="progress-container mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-medium ${currentPage === 1 ? "text-[#4F7B6E] font-bold" : "text-gray-600"}`}>
          Registration
        </span>
        
        {currentPage > 1 && currentPage <= 501 && (
          <span className="text-sm font-medium text-[#4F7B6E]">
            Page {currentPage - 1} of 500
          </span>
        )}
        
        <span className={`text-sm font-medium ${currentPage > 501 ? "text-[#4F7B6E] font-bold" : "text-gray-600"}`}>
          Confirmation
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#4F7B6E] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {/* Percentage display */}
      <div className="text-right mt-1">
        <span className="text-xs text-gray-600">{percentage}% complete</span>
      </div>
    </div>
  );
}