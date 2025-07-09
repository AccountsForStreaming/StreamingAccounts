/**
 * Text formatting utilities
 */

/**
 * Truncate text to a specified length and add ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  
  // Try to truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

/**
 * Format description for display in quick view with proper line breaks
 * @param description - The description text
 * @returns Array of text lines for rendering
 */
export const formatDescription = (description: string): string[] => {
  return description.split('\n').map(line => line.trim());
};

/**
 * Check if text needs truncation
 * @param text - The text to check
 * @param maxLength - Maximum length threshold
 * @returns Boolean indicating if text should be truncated
 */
export const shouldTruncate = (text: string, maxLength: number = 100): boolean => {
  return text.length > maxLength;
};

/**
 * Get a preview of formatted text (first few lines only)
 * @param text - The full text
 * @param maxLines - Maximum number of lines to show
 * @param maxLength - Maximum character length
 * @returns Preview text
 */
export const getTextPreview = (text: string, maxLines: number = 2, maxLength: number = 100): string => {
  const lines = text.split('\n').slice(0, maxLines);
  const preview = lines.join(' ').trim();
  return truncateText(preview, maxLength);
};
