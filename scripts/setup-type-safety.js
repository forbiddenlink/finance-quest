#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function setupTypeSafety() {
  console.log('Setting up type safety checks...\n');

  // Install required dependencies
  console.log('Installing dependencies...');
  const dependencies = [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@microsoft/eslint-formatter-sarif',
    'ts-morph'
  ];

  try {
    execSync(`npm install --save-dev ${dependencies.join(' ')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to install dependencies:', error);
    process.exit(1);
  }

  // Create necessary directories
  console.log('\nCreating directories...');
  const directories = [
    '.github/workflows',
    'scripts/analyzers',
    'lib/testing/types'
  ];

  for (const dir of directories) {
    try {
      await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error);
      process.exit(1);
    }
  }

  // Update package.json scripts
  console.log('\nUpdating package.json...');
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    packageJson.scripts = {
      ...packageJson.scripts,
      'type-check': 'tsc --noEmit',
      'type-safety': 'eslint . --config .eslintrc.type-safety.json --ext .ts,.tsx',
      'type-safety:fix': 'eslint . --config .eslintrc.type-safety.json --ext .ts,.tsx --fix',
      'type-safety:analyze': 'tsx scripts/analyzers/runTypeSafetyAnalysis.ts',
      'type-safety:ci': 'tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci'
    };

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error('Failed to update package.json:', error);
    process.exit(1);
  }

  // Update tsconfig.json
  console.log('\nUpdating tsconfig.json...');
  try {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf8'));

    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictPropertyInitialization: true,
      noImplicitThis: true,
      useUnknownInCatchVariables: true,
      alwaysStrict: true,
      noUncheckedIndexedAccess: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noImplicitOverride: true,
      allowUnreachableCode: false
    };

    await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  } catch (error) {
    console.error('Failed to update tsconfig.json:', error);
    process.exit(1);
  }

  console.log('\nType safety setup completed successfully!');
  console.log('\nAvailable commands:');
  console.log('  npm run type-check         - Run TypeScript type checking');
  console.log('  npm run type-safety        - Run ESLint type safety checks');
  console.log('  npm run type-safety:fix    - Fix ESLint type safety issues');
  console.log('  npm run type-safety:analyze - Run type safety analysis');
  console.log('  npm run type-safety:ci     - Run type safety analysis in CI mode');
}

setupTypeSafety().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});

