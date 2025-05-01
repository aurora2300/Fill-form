import { FormSubmission } from "@shared/schema";

export function downloadCsv(data: FormSubmission[]) {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  // Create CSV header
  const headers = [
    "name",
    "userGroup",
    "fileName",
    "question1",
    "question1b",
    "question2",
    "question2b",
    "question3",
    "question3b",
    "question4",
    "question4b",
    "question5",
    "question5b"
  ];
  
  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map(item => {
      return headers.map(header => {
        const value = item[header as keyof FormSubmission] || "";
        // Escape quotes and wrap in quotes if needed
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",");
    })
  ].join("\n");
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "design_tool_data.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
