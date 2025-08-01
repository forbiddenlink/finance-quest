const fs = require('fs');
const path = require('path');

// Import the theme configuration
const themeContent = fs.readFileSync('lib/theme/index.ts', 'utf8');

// Function to add theme import and update file
function updateFileWithTheme(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if theme import already exists
  const hasThemeImport = content.includes("import { theme } from '@/lib/theme'");
  
  // Add theme import if not present
  if (!hasThemeImport && !content.includes('theme.')) {
    // Check if we need to add theme usage first
    const needsTheme = content.includes('bg-white') || 
                      content.includes('text-gray-900') || 
                      content.includes('text-gray-800') || 
                      content.includes('text-gray-700') || 
                      content.includes('border-gray-200') || 
                      content.includes('border-gray-300');
    
    if (needsTheme) {
      // Find the last import statement
      const importRegex = /^import.*?;$/gm;
      const imports = content.match(importRegex);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, lastImportIndex) + 
                 '\nimport { theme } from \'@/lib/theme\';' + 
                 content.slice(lastImportIndex);
        modified = true;
      }
    }
  }
  
  // Define replacements for theme updates
  const replacements = [
    // Background replacements
    {
      search: /bg-white rounded-lg shadow-lg/g,
      replace: '${theme.backgrounds.glass} rounded-lg shadow-lg'
    },
    {
      search: /bg-white/g,
      replace: '${theme.backgrounds.glass}'
    },
    {
      search: /bg-white\/5 backdrop-blur-xl border border-white\/10/g,
      replace: '${theme.backgrounds.glass}'
    },
    {
      search: /bg-white bg-opacity-60/g,
      replace: '${theme.backgrounds.glass}'
    },
    {
      search: /bg-white\/70/g,
      replace: '${theme.backgrounds.glass}'
    },
    {
      search: /bg-white bg-opacity-50/g,
      replace: '${theme.backgrounds.glass}'
    },
    
    // Text color replacements
    {
      search: /text-gray-900/g,
      replace: '${theme.textColors.primary}'
    },
    {
      search: /text-gray-800/g,
      replace: '${theme.textColors.primary}'
    },
    {
      search: /text-gray-700/g,
      replace: '${theme.textColors.secondary}'
    },
    
    // Border replacements
    {
      search: /border-gray-200/g,
      replace: '${theme.borderColors.primary}'
    },
    {
      search: /border-gray-300/g,
      replace: '${theme.borderColors.primary}'
    },
    {
      search: /border border-gray-200/g,
      replace: 'border ${theme.borderColors.primary}'
    },
    {
      search: /border border-gray-300/g,
      replace: 'border ${theme.borderColors.primary}'
    },
    {
      search: /border-b border-gray-200/g,
      replace: 'border-b ${theme.borderColors.primary}'
    },
    {
      search: /border-t border-gray-200/g,
      replace: 'border-t ${theme.borderColors.primary}'
    }
  ];
  
  // Apply replacements
  replacements.forEach(({ search, replace }) => {
    if (content.match(search)) {
      content = content.replace(search, replace);
      modified = true;
    }
  });
  
  // Write file if modified
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Get all component files that need updating
const componentDirs = [
  'components/shared/ui',
  'components/demo',
  'app'
];

function getAllTsxFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
  
  return files;
}

// Update all files
let totalUpdated = 0;

componentDirs.forEach(dir => {
  console.log(`\n🔍 Scanning ${dir}...`);
  const files = getAllTsxFiles(dir);
  
  files.forEach(file => {
    if (updateFileWithTheme(file)) {
      totalUpdated++;
    }
  });
});

console.log(`\n🎉 Updated ${totalUpdated} files with new theme system!`);
