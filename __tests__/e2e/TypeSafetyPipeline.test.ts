import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Project, ts } from 'ts-morph';

describe('Type Safety Pipeline End-to-End Tests', () => {
  const tempDir = path.join(process.cwd(), 'temp-type-safety-tests');
  const testFilePath = path.join(tempDir, 'TestComponent.tsx');
  const testConfigPath = path.join(tempDir, 'tsconfig.json');

  beforeAll(async () => {
    // Create temporary directory for test files
    await fs.mkdir(tempDir, { recursive: true });

    // Create test tsconfig.json
    await fs.writeFile(testConfigPath, JSON.stringify({
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        baseUrl: ".",
        paths: {
          "@/*": ["./*"]
        }
      },
      include: ["**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"]
    }));
  });

  afterAll(async () => {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    // Clean up test file before each test
    try {
      await fs.unlink(testFilePath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  it('should detect implicit any types', async () => {
    const testCode = `
      import React from 'react';
      
      export const TestComponent = (props) => {
        const handleClick = (event) => {
          console.log(event.target.value);
        };
        
        return (
          <button onClick={handleClick}>
            {props.label}
          </button>
        );
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const project = new Project({
      tsConfigFilePath: testConfigPath,
      skipAddingFilesFromTsConfig: true
    });
    project.addSourceFileAtPath(testFilePath);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).toContain('Implicit any type');
    expect(output).toContain('props: any');
    expect(output).toContain('event: any');
  });

  it('should detect unsafe type assertions', async () => {
    const testCode = `
      import React from 'react';
      
      interface Props {
        value: number;
      }
      
      export const TestComponent: React.FC<Props> = (props) => {
        const value = props.value as any as string;
        return <div>{value.toUpperCase()}</div>;
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).toContain('Unsafe type assertion');
    expect(output).toContain('as any as string');
  });

  it('should detect non-null assertions', async () => {
    const testCode = `
      import React from 'react';
      
      interface Props {
        value?: string;
      }
      
      export const TestComponent: React.FC<Props> = (props) => {
        return <div>{props.value!.toUpperCase()}</div>;
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).toContain('Non-null assertion');
    expect(output).toContain('props.value!');
  });

  it('should detect unsafe type coercion', async () => {
    const testCode = `
      import React from 'react';
      
      interface Props {
        value: any;
      }
      
      export const TestComponent: React.FC<Props> = (props) => {
        const numValue = +props.value;
        return <div>{numValue * 2}</div>;
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).toContain('Unsafe type coercion');
    expect(output).toContain('+props.value');
  });

  it('should detect missing parameter types', async () => {
    const testCode = `
      import React from 'react';
      
      export const TestComponent = () => {
        const handleChange = (value) => {
          console.log(value);
        };
        
        return <input onChange={e => handleChange(e.target.value)} />;
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).toContain('Missing parameter type');
    expect(output).toContain('value: any');
  });

  it('should detect missing return types', async () => {
    const testCode = `
      import React from 'react';
      
      export const TestComponent = () => {
        const calculateValue = (x: number) => {
          return x * 2;
        };
        
        return <div>{calculateValue(5)}</div>;
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).toContain('Missing return type');
    expect(output).toContain('calculateValue');
  });

  it('should detect unsafe indexing', async () => {
    const testCode = `
      import React from 'react';
      
      interface Props {
        data: any[];
      }
      
      export const TestComponent: React.FC<Props> = (props) => {
        return <div>{props.data[0].value}</div>;
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).toContain('Unsafe indexing');
    expect(output).toContain('props.data[0]');
  });

  it('should validate proper type usage', async () => {
    const testCode = `
      import React from 'react';
      
      interface Props {
        label: string;
        value: number;
        onChange: (value: number) => void;
      }
      
      export const TestComponent: React.FC<Props> = ({ label, value, onChange }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
          onChange(Number(event.target.value));
        };
        
        return (
          <div>
            <label>{label}</label>
            <input type="number" value={value} onChange={handleChange} />
          </div>
        );
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).not.toContain('Implicit any type');
    expect(output).not.toContain('Unsafe type assertion');
    expect(output).not.toContain('Non-null assertion');
    expect(output).not.toContain('Unsafe type coercion');
    expect(output).not.toContain('Missing parameter type');
    expect(output).not.toContain('Missing return type');
    expect(output).not.toContain('Unsafe indexing');
  });

  it('should handle complex type scenarios', async () => {
    const testCode = `
      import React from 'react';
      
      type DataItem = {
        id: number;
        name: string;
        values: number[];
      };
      
      interface Props {
        data: DataItem[];
        selectedId?: number;
        onSelect: (item: DataItem) => void;
      }
      
      export const TestComponent: React.FC<Props> = ({ data, selectedId, onSelect }) => {
        const handleSelect = (id: number): void => {
          const item = data.find((item): item is DataItem => item.id === id);
          if (item) {
            onSelect(item);
          }
        };
        
        return (
          <ul>
            {data.map((item: DataItem) => (
              <li
                key={item.id}
                onClick={(): void => handleSelect(item.id)}
                className={item.id === selectedId ? 'selected' : ''}
              >
                {item.name} ({item.values.length} values)
              </li>
            ))}
          </ul>
        );
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).not.toContain('error');
    expect(output).not.toContain('warning');
  });

  it('should handle React hooks with proper types', async () => {
    const testCode = `
      import React, { useState, useEffect, useCallback } from 'react';
      
      interface Props {
        initialValue: number;
        onChange: (value: number) => void;
      }
      
      export const TestComponent: React.FC<Props> = ({ initialValue, onChange }) => {
        const [value, setValue] = useState<number>(initialValue);
        
        useEffect((): void => {
          if (value !== initialValue) {
            onChange(value);
          }
        }, [value, initialValue, onChange]);
        
        const handleIncrement = useCallback((): void => {
          setValue((prev: number): number => prev + 1);
        }, []);
        
        const handleDecrement = useCallback((): void => {
          setValue((prev: number): number => prev - 1);
        }, []);
        
        return (
          <div>
            <button onClick={handleDecrement}>-</button>
            <span>{value}</span>
            <button onClick={handleIncrement}>+</button>
          </div>
        );
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).not.toContain('error');
    expect(output).not.toContain('warning');
  });

  it('should enforce strict null checks', async () => {
    const testCode = `
      import React from 'react';
      
      interface Props {
        value?: string;
      }
      
      export const TestComponent: React.FC<Props> = ({ value }) => {
        return (
          <div>
            {value && <span>{value.toUpperCase()}</span>}
            {!value && <span>No value provided</span>}
          </div>
        );
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).not.toContain('error');
    expect(output).not.toContain('warning');
  });

  it('should validate custom hook type safety', async () => {
    const testCode = `
      import React, { useState, useCallback } from 'react';
      
      interface UseCounterOptions {
        min?: number;
        max?: number;
      }
      
      interface UseCounterResult {
        count: number;
        increment: () => void;
        decrement: () => void;
        reset: () => void;
      }
      
      const useCounter = (
        initialValue: number,
        options: UseCounterOptions = {}
      ): UseCounterResult => {
        const [count, setCount] = useState<number>(initialValue);
        
        const increment = useCallback((): void => {
          setCount((prev: number): number => 
            options.max !== undefined ? Math.min(prev + 1, options.max) : prev + 1
          );
        }, [options.max]);
        
        const decrement = useCallback((): void => {
          setCount((prev: number): number => 
            options.min !== undefined ? Math.max(prev - 1, options.min) : prev - 1
          );
        }, [options.min]);
        
        const reset = useCallback((): void => {
          setCount(initialValue);
        }, [initialValue]);
        
        return { count, increment, decrement, reset };
      };
      
      interface Props {
        initialValue: number;
        min?: number;
        max?: number;
      }
      
      export const TestComponent: React.FC<Props> = ({ initialValue, min, max }) => {
        const { count, increment, decrement, reset } = useCounter(initialValue, { min, max });
        
        return (
          <div>
            <button onClick={decrement}>-</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
            <button onClick={reset}>Reset</button>
          </div>
        );
      };
    `;

    await fs.writeFile(testFilePath, testCode);

    const output = execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci', {
      env: { ...process.env, TEST_FILE: testFilePath }
    }).toString();

    expect(output).not.toContain('error');
    expect(output).not.toContain('warning');
  });
});
