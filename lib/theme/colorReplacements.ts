/**
 * Color replacement mapping for theme consistency
 * Maps old color classes to new theme-based classes
 */

export const colorReplacements = {
  // Blue -> Amber (primary accent)
  'text-blue-300': 'text-amber-300',
  'text-blue-400': 'text-amber-400',
  'text-blue-600': 'text-amber-600',
  'text-blue-700': 'text-amber-700',
  'text-blue-800': 'text-amber-800',
  'text-blue-900': 'text-amber-900',
  
  // Blue backgrounds -> Amber/Slate
  'bg-blue-50': 'bg-amber-50',
  'bg-blue-100': 'bg-amber-100',
  'bg-blue-500': 'bg-amber-500',
  'bg-blue-600': 'bg-amber-600',
  'bg-blue-700': 'bg-amber-700',
  'bg-blue-500/10': 'bg-amber-500/10',
  'bg-blue-500/20': 'bg-amber-500/20',
  'bg-blue-600/10': 'bg-amber-600/10',
  'bg-blue-600/20': 'bg-amber-600/20',
  
  // Blue borders -> Amber
  'border-blue-200': 'border-amber-200',
  'border-blue-300': 'border-amber-300',
  'border-blue-500': 'border-amber-500',
  'border-blue-500/20': 'border-amber-500/20',
  'border-blue-500/30': 'border-amber-500/30',
  'border-blue-600': 'border-amber-600',
  'border-blue-600/20': 'border-amber-600/20',
  'border-blue-600/30': 'border-amber-600/30',
  'border-blue-700': 'border-amber-700',
  'border-blue-700/30': 'border-amber-700/30',
  
  // Blue hovers -> Amber
  'hover:bg-blue-50': 'hover:bg-amber-50',
  'hover:bg-blue-600': 'hover:bg-amber-600',
  'hover:bg-blue-700': 'hover:bg-amber-700',
  'hover:text-blue-600': 'hover:text-amber-600',
  'hover:text-blue-700': 'hover:text-amber-700',
  'hover:border-blue-300': 'hover:border-amber-300',
  'hover:border-blue-400': 'hover:border-amber-400',
  'hover:border-blue-500': 'hover:border-amber-500',
  
  // Blue gradients -> Amber/Slate gradients
  'from-blue-500': 'from-amber-500',
  'to-blue-500': 'to-blue-500', // Keep blue as secondary
  'from-blue-600': 'from-amber-600',
  'to-blue-600': 'to-blue-600', // Keep blue as secondary
  'from-blue-700': 'from-amber-700',
  'to-blue-700': 'to-blue-700', // Keep blue as secondary
  'from-blue-900': 'from-slate-800',
  'to-blue-900': 'to-slate-800',
  
  // Specific blue combinations that should be amber
  'bg-gradient-to-r from-blue-100 to-purple-100': 'bg-gradient-to-r from-amber-100 to-amber-200',
  'bg-gradient-to-r from-blue-50 to-green-50': 'bg-gradient-to-r from-amber-50 to-amber-100',
} as const;

export const preservedColors = [
  // Keep these blue elements as they work well with the overall theme
  'via-blue-900', // Background gradient center
  'to-blue-500', // Secondary gradient color
  'to-blue-600', // Secondary gradient color
] as const;

/**
 * Apply color replacements to a string of CSS classes
 */
export function replaceColors(classString: string): string {
  let result = classString;
  
  Object.entries(colorReplacements).forEach(([oldColor, newColor]) => {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${oldColor.replace(/[/()]/g, '\\$&')}\\b`, 'g');
    result = result.replace(regex, newColor);
  });
  
  return result;
}

/**
 * Check if a file should be processed for color replacement
 */
export function shouldProcessFile(filePath: string): boolean {
  return filePath.endsWith('.tsx') || filePath.endsWith('.ts');
}

const colorReplacementUtils = { colorReplacements, preservedColors, replaceColors, shouldProcessFile };

export default colorReplacementUtils;
