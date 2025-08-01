const fs = require('fs');
const path = require('path');

// Function to fix template literals in className attributes
function fixTemplateStrings(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix template strings that are not properly interpolated
  const fixes = [
    // Fix className with theme template strings
    {
      search: /className="([^"]*)\$\{theme\.([^}]+)\}([^"]*)"/g,
      replace: (match, before, themeProperty, after) => {
        return `className={\`${before}\${theme.${themeProperty}}${after}\`}`;
      }
    }
  ];
  
  fixes.forEach(({ search, replace }) => {
    const matches = content.match(search);
    if (matches) {
      content = content.replace(search, replace);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed template strings in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Get all component files that need fixing
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

// Fix all files
let totalFixed = 0;

componentDirs.forEach(dir => {
  console.log(`\n🔍 Scanning ${dir}...`);
  const files = getAllTsxFiles(dir);
  
  files.forEach(file => {
    if (fixTemplateStrings(file)) {
      totalFixed++;
    }
  });
});

console.log(`\n🎉 Fixed template strings in ${totalFixed} files!`);
