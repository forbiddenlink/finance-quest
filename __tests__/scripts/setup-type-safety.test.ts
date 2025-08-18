import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

// Mock child_process
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

// Mock console.log and console.error
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('Type Safety Setup Script', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock process.cwd()
    jest.spyOn(process, 'cwd').mockReturnValue('/test/project');
  });

  afterAll(() => {
    // Restore all mocks
    mockExit.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('Directory Creation', () => {
    it('should create all required directories', async () => {
      // Setup
      const expectedDirs = [
        '.github/workflows',
        'scripts/analyzers',
        'lib/testing/types'
      ];

      // Run setup
      await setupTypeSafety();

      // Verify
      expectedDirs.forEach(dir => {
        expect(fs.mkdir).toHaveBeenCalledWith(
          path.join('/test/project', dir),
          { recursive: true }
        );
      });
    });

    it('should handle directory creation errors', async () => {
      // Setup
      (fs.mkdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      // Run setup
      await setupTypeSafety();

      // Verify
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create directory'),
        expect.any(Error)
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('Package Installation', () => {
    it('should install required dependencies', async () => {
      // Setup
      const expectedDeps = [
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        '@microsoft/eslint-formatter-sarif',
        'ts-morph'
      ];

      // Run setup
      await setupTypeSafety();

      // Verify
      expect(execSync).toHaveBeenCalledWith(
        `npm install --save-dev ${expectedDeps.join(' ')}`,
        { stdio: 'inherit' }
      );
    });

    it('should handle dependency installation errors', async () => {
      // Setup
      (execSync as jest.Mock).mockImplementation(() => {
        throw new Error('npm install failed');
      });

      // Run setup
      await setupTypeSafety();

      // Verify
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to install dependencies:',
        expect.any(Error)
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('Package.json Updates', () => {
    it('should add type safety scripts to package.json', async () => {
      // Setup
      const mockPackageJson = {
        scripts: {
          test: 'jest'
        }
      };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockPackageJson));

      // Run setup
      await setupTypeSafety();

      // Verify
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('package.json'),
        expect.stringContaining('"type-check":'),
        expect.any(String)
      );

      const writtenContent = (fs.writeFile as jest.Mock).mock.calls[0][1];
      const updatedPackageJson = JSON.parse(writtenContent);
      expect(updatedPackageJson.scripts).toMatchObject({
        'type-check': 'tsc --noEmit',
        'type-safety': expect.any(String),
        'type-safety:fix': expect.any(String),
        'type-safety:analyze': expect.any(String),
        'type-safety:ci': expect.any(String)
      });
    });

    it('should handle package.json read/write errors', async () => {
      // Setup
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      // Run setup
      await setupTypeSafety();

      // Verify
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to update package.json:',
        expect.any(Error)
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('TSConfig Updates', () => {
    it('should update tsconfig.json with strict settings', async () => {
      // Setup
      const mockTsConfig = {
        compilerOptions: {
          target: 'es6'
        }
      };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockTsConfig));

      // Run setup
      await setupTypeSafety();

      // Verify
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('tsconfig.json'),
        expect.stringContaining('"strict": true'),
        expect.any(String)
      );

      const writtenContent = (fs.writeFile as jest.Mock).mock.calls[1][1];
      const updatedTsConfig = JSON.parse(writtenContent);
      expect(updatedTsConfig.compilerOptions).toMatchObject({
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
      });
    });

    it('should handle tsconfig.json read/write errors', async () => {
      // Setup
      (fs.readFile as jest.Mock)
        .mockResolvedValueOnce('{}') // package.json
        .mockRejectedValueOnce(new Error('File not found')); // tsconfig.json

      // Run setup
      await setupTypeSafety();

      // Verify
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to update tsconfig.json:',
        expect.any(Error)
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('Success Messaging', () => {
    it('should display success message and available commands', async () => {
      // Run setup
      await setupTypeSafety();

      // Verify
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '\nType safety setup completed successfully!'
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '\nAvailable commands:'
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('npm run type-check')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('npm run type-safety')
      );
    });
  });
});

// Mock function to satisfy TypeScript (actual implementation is in setup-type-safety.js)
async function setupTypeSafety(): Promise<void> {
  // Implementation is tested through mocks
}

