# Theme Color Update Guide

This guide lists all remaining hardcoded colors in the codebase that need to be updated to use the new theme system.

## Summary of Progress

✅ **Already Updated:**
- `QASystem.tsx` - Complete
- `TypingEffect.tsx` - Complete  
- `SuccessCelebration.tsx` - Complete
- `SpacedRepetitionDashboard.tsx` - Partially updated
- `ProgressNavigation.tsx` - Partially updated
- `MarketTicker.tsx` - Partially updated
- `ProgressDashboard.tsx` - Partially updated

## Files Still Needing Updates

### High Priority UI Components

1. **`components/shared/ui/MarketDashboard.tsx`**
   - `text-blue-600`, `text-red-600`, `bg-blue-600`, `hover:bg-blue-700`
   - `text-green-600`, `text-yellow-900`, `bg-yellow-50`

2. **`components/shared/ui/LearningAnalyticsDashboard.tsx`**
   - `border-blue-600`, `text-blue-600`, `text-blue-900`, `text-blue-500`

3. **`components/shared/ui/ProgressDisplay.tsx`**
   - `bg-green-100`, `text-green-800`

4. **`components/shared/ui/ProgressRing.tsx`**
   - `text-gray-700`

5. **`components/shared/ui/VoiceQA.tsx`**
   - `text-red-600`

### Pages That Need Updates

6. **Chapter Pages** (multiple files need theme imports):
   - `app/chapter1/page.tsx` to `app/chapter14/page.tsx`
   - Need to replace hardcoded colors with theme equivalents

7. **Calculator Pages:**
   - `app/calculators/*/page.tsx` files
   - Multiple hardcoded color references

## Common Replacements Needed

### Text Colors
```tsx
// Replace these:
text-blue-500    → theme.status.info.text
text-blue-600    → theme.status.info.text  
text-green-600   → theme.status.success.text
text-red-600     → theme.status.error.text
text-yellow-600  → theme.status.warning.text
text-gray-600    → theme.textColors.secondary
text-gray-700    → theme.textColors.primary
text-gray-500    → theme.textColors.muted
```

### Background Colors
```tsx
// Replace these:
bg-blue-50       → theme.status.info.bg
bg-green-100     → theme.status.success.bg
bg-red-100       → theme.status.error.bg
bg-yellow-50     → theme.status.warning.bg
bg-gray-50       → theme.backgrounds.cardHover
bg-gray-100      → theme.backgrounds.card
```

### Border Colors
```tsx
// Replace these:
border-blue-200  → theme.status.info.border
border-green-500 → theme.status.success.border
border-red-500   → theme.status.error.border
border-gray-200  → theme.borderColors.primary
```

### Button Colors
```tsx
// Replace these:
bg-blue-600 hover:bg-blue-700  → theme.buttons.primary
bg-gray-100 hover:bg-gray-200  → theme.buttons.secondary
```

## Update Steps for Each File

1. **Add theme import:**
   ```tsx
   import { theme } from '@/lib/theme';
   ```

2. **Replace hardcoded colors systematically:**
   - Text colors first
   - Background colors second  
   - Border colors third
   - Interactive states last

3. **Update typography:**
   ```tsx
   text-sm  → theme.typography.small
   text-xs  → theme.typography.tiny
   text-lg  → theme.typography.heading4
   ```

4. **Test the component** to ensure colors work correctly with the dark theme.

## Automation Script Ideas

You could create a find-and-replace script to automate some of these changes:

```bash
# Example PowerShell script to find files with hardcoded colors
Get-ChildItem -Path "components" -Recurse -Include "*.tsx" | 
Select-String "text-blue-|bg-blue-|border-blue-|text-gray-|bg-gray-" |
Group-Object Filename | 
Select-Object Name, Count
```

## Next Steps

1. Prioritize the high-priority UI components listed above
2. Update pages that have the most hardcoded color usage
3. Test each component after updating to ensure proper theming
4. Create a final verification script to check for any remaining hardcoded colors

Remember to always test components after updating to ensure the theme integration works correctly!
