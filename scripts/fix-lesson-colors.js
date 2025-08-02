#!/usr/bin/env node

// Script to help identify and fix hardcoded colors in lesson files
const fs = require('fs');
const path = require('path');

// Common hardcoded color patterns to theme mappings
const colorMappings = {
  'text-white': 'theme.textColors.primary',
  'text-blue-400': 'theme.status.info.text',
  'text-green-400': 'theme.status.success.text',
  'text-red-400': 'theme.status.error.text',
  'text-amber-400': 'theme.textColors.accent',
  'text-purple-400': 'theme.status.error.text',
  'text-yellow-400': 'theme.status.warning.text',
  'text-gray-300': 'theme.textColors.secondary',
  'text-gray-400': 'theme.textColors.muted',
  'bg-white': 'theme.backgrounds.card',
  'bg-gray-50': 'theme.backgrounds.cardHover',
  'bg-blue-50': 'theme.status.info.bg',
  'bg-green-50': 'theme.status.success.bg',
  'bg-red-50': 'theme.status.error.bg',
  'bg-yellow-50': 'theme.status.warning.bg',
  'border-blue-200': 'theme.status.info.border',
  'border-green-200': 'theme.status.success.border',
  'border-red-200': 'theme.status.error.border',
  'border-yellow-200': 'theme.status.warning.border'
};

function findLessonFiles() {
  const lessonsDir = path.join(__dirname, '../components/chapters/fundamentals/lessons');
  return fs.readdirSync(lessonsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(lessonsDir, file));
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Find hardcoded colors
  Object.keys(colorMappings).forEach(pattern => {
    const regex = new RegExp(`\\b${pattern}\\b`, 'g');
    let match;
    while ((match = regex.exec(content)) !== null) {
      issues.push({
        pattern,
        replacement: colorMappings[pattern],
        line: content.substring(0, match.index).split('\n').length,
        context: content.substring(Math.max(0, match.index - 50), match.index + 50)
      });
    }
  });
  
  return {
    file: path.basename(filePath),
    issues
  };
}

function generateReport() {
  const lessonFiles = findLessonFiles();
  const report = {
    summary: {
      totalFiles: lessonFiles.length,
      filesWithIssues: 0,
      totalIssues: 0
    },
    files: []
  };
  
  lessonFiles.forEach(filePath => {
    const analysis = analyzeFile(filePath);
    if (analysis.issues.length > 0) {
      report.summary.filesWithIssues++;
      report.summary.totalIssues += analysis.issues.length;
      report.files.push(analysis);
    }
  });
  
  return report;
}

// Run the analysis
const report = generateReport();

console.log('🎨 Theme Consistency Analysis Report');
console.log('=====================================');
console.log(`📁 Files analyzed: ${report.summary.totalFiles}`);
console.log(`⚠️  Files with issues: ${report.summary.filesWithIssues}`);
console.log(`🔧 Total issues found: ${report.summary.totalIssues}`);
console.log('');

report.files.forEach(file => {
  console.log(`📄 ${file.file} (${file.issues.length} issues)`);
  file.issues.slice(0, 5).forEach((issue, index) => {
    console.log(`   ${index + 1}. Line ${issue.line}: ${issue.pattern} → ${issue.replacement}`);
  });
  if (file.issues.length > 5) {
    console.log(`   ... and ${file.issues.length - 5} more`);
  }
  console.log('');
});

console.log('💡 Recommendation: Fix these patterns systematically using find/replace:');
Object.entries(colorMappings).forEach(([pattern, replacement]) => {
  console.log(`   ${pattern} → \${${replacement}}`);
});
