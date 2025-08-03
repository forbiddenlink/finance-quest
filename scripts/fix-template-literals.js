const fs = require('fs');
const path = require('path');

// Function to fix template literal syntax in a file
function fixTemplateStrings(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Fix className="${theme...}" to className={`${theme...}`}
        const fixedContent = content.replace(
            /className="\$\{([^}]+)\}([^"]*)"/g,
            'className={`${$1}$2`}'
        );
        
        if (content !== fixedContent) {
            fs.writeFileSync(filePath, fixedContent, 'utf8');
            console.log(`Fixed template literals in: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Get all affected files from the grep results
const affectedFiles = [
    'components/shared/calculators/TaxOptimizerCalculator.tsx',
    'components/shared/calculators/RetirementPlannerCalculator.tsx',
    'components/shared/calculators/PortfolioAnalyzerCalculator.tsx',
    'components/shared/calculators/MortgageCalculator.tsx',
    'components/shared/calculators/BusinessCalculator.tsx',
    'components/shared/calculators/BudgetBuilderCalculator.tsx',
    'components/chapters/fundamentals/calculators/SavingsCalculator.tsx',
    'components/chapters/fundamentals/calculators/CompoundInterestCalculator.tsx',
    'components/chapters/fundamentals/calculators/PaycheckCalculator.tsx'
];

let totalFixed = 0;

affectedFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
        if (fixTemplateStrings(fullPath)) {
            totalFixed++;
        }
    } else {
        console.log(`File not found: ${fullPath}`);
    }
});

console.log(`\n✅ Fixed template literals in ${totalFixed} files`);
console.log('All template literal syntax issues have been resolved!');
