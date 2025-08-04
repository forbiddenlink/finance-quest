// Enhanced theme token additions for gradient consistency
export const gradientBackgrounds = {
  // Primary gradients
  primaryBlue: 'from-blue-600 to-blue-700',
  primarySlate: 'from-slate-900 to-blue-900',
  primarySuccess: 'from-green-500 to-green-600',
  primaryWarning: 'from-yellow-500 to-orange-500',
  primaryDanger: 'from-red-500 to-red-600',
  
  // Subtle gradients for cards/backgrounds
  subtleBlue: 'from-blue-50 to-blue-100',
  subtleGreen: 'from-green-50 to-emerald-50',
  subtleYellow: 'from-yellow-50 to-orange-50',
  subtleRed: 'from-red-50 to-pink-50',
  subtleSlate: 'from-slate-50 to-slate-100',
  
  // Loading/animation gradients
  shimmer: 'from-transparent via-white/5 to-transparent',
  shimmerDark: 'from-transparent via-slate-300/10 to-transparent',
  
  // Celebration gradients
  celebration: {
    gold: 'from-amber-400 to-yellow-500',
    silver: 'from-slate-300 to-slate-400',
    bronze: 'from-orange-400 to-amber-500',
    rainbow: 'from-purple-500 via-pink-500 to-orange-500',
    success: 'from-green-400 to-emerald-500',
    achievement: 'from-blue-500 to-purple-600'
  },
  
  // Market/financial gradients
  market: {
    positive: 'from-green-500/30 to-emerald-500/30',
    negative: 'from-red-500/30 to-pink-500/30',
    neutral: 'from-slate-500/30 to-gray-500/30',
    ticker: 'from-yellow-500/30 to-blue-500/30'
  }
};

// Consistent text color patterns
export const consistentTextColors = {
  onPrimary: 'text-white',
  onSecondary: 'text-slate-200',
  onBackground: 'text-slate-900',
  onSurface: 'text-slate-700',
  onCard: 'text-slate-800',
  
  // Status text colors
  success: 'text-green-700',
  warning: 'text-yellow-700',
  error: 'text-red-700',
  info: 'text-blue-700',
  
  // Interactive states
  link: 'text-blue-600 hover:text-blue-700',
  linkSecondary: 'text-slate-600 hover:text-slate-700'
};

// Consistent border patterns
export const consistentBorders = {
  default: 'border-white/10',
  card: 'border-slate-200',
  input: 'border-slate-300 focus:border-blue-500',
  success: 'border-green-200',
  warning: 'border-yellow-200',
  error: 'border-red-200',
  info: 'border-blue-200'
};

// Helper function to get consistent gradient classes
export function getGradientClass(type: keyof typeof gradientBackgrounds, direction: 'to-r' | 'to-br' | 'to-b' = 'to-r'): string {
  const gradient = gradientBackgrounds[type];
  return `bg-gradient-${direction} ${gradient}`;
}

// Helper function for celebration colors
export function getCelebrationGradient(level: 'gold' | 'silver' | 'bronze' | 'rainbow' | 'success' | 'achievement' = 'success'): string {
  return `bg-gradient-to-r ${gradientBackgrounds.celebration[level]}`;
}

// Helper function for market-related gradients
export function getMarketGradient(sentiment: 'positive' | 'negative' | 'neutral' | 'ticker'): string {
  return `bg-gradient-to-r ${gradientBackgrounds.market[sentiment]}`;
}

// Helper for component consistency
export function getConsistentCardClasses(): string {
  return `bg-slate-900/50 border ${consistentBorders.default} backdrop-blur-sm`;
}

export function getConsistentButtonClasses(variant: 'primary' | 'secondary' | 'success' | 'warning' = 'primary'): string {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2';
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} ${getGradientClass('primarySlate')} ${consistentTextColors.onPrimary}`;
    case 'secondary':
      return `${baseClasses} bg-slate-600 hover:bg-slate-700 ${consistentTextColors.onPrimary}`;
    case 'success':
      return `${baseClasses} ${getGradientClass('primarySuccess')} ${consistentTextColors.onPrimary}`;
    case 'warning':
      return `${baseClasses} ${getGradientClass('primaryWarning')} ${consistentTextColors.onPrimary}`;
    default:
      return `${baseClasses} ${getGradientClass('primarySlate')} ${consistentTextColors.onPrimary}`;
  }
}
