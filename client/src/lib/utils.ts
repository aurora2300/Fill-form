import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the image URL for a form page based on the user's group
 * 
 * @param groupNumber - The user's group (1-60)
 * @param pageNumber - The current page number (2-501, since page 1 is registration)
 * @returns The path to the appropriate image
 */
export function getImageForPage(groupNumber: string | number, pageNumber: number): string {
  // Convert group to number if it's a string
  const group = typeof groupNumber === 'string' ? parseInt(groupNumber) : groupNumber;
  
  // Basic validation
  if (isNaN(group) || group < 1 || group > 60 || pageNumber < 2 || pageNumber > 501) {
    // Return default image if invalid
    return "/placeholder.jpg";
  }
  
  // Calculate image number based on group (groups are 1-60, each with 500 images per group)
  // For Group 1:
  //   Page 2: 0.jpg
  //   Page 3: 1.jpg
  //   Page 4: 2.jpg
  //   ...
  // For Group 2:
  //   Page 2: 500.jpg
  //   Page 3: 501.jpg
  //   Page 4: 502.jpg
  //   ...
  const baseImageNum = (group - 1) * 500;
  const pageOffset = pageNumber - 2; // Sequential numbering starting from base
  const imageNum = baseImageNum + pageOffset;
  
  // Path to the image in the public directory
  // Format: /images/{imageNumber}.jpg
  return `/images/${imageNum}.jpg`;
}
