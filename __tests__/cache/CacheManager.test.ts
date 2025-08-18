import { CacheManager, CalculatorCacheManager } from '@/lib/cache/CacheManager';
import { CalculatorState } from '@/lib/context/CalculatorContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('CacheManager', () => {
  let cache: CacheManager<string>;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new CacheManager({
      namespace: 'test',
      version: '1.0.0',
      ttl: 1000,
      maxEntries: 3,
      persistenceKey: 'test_cache'
    });
  });

  describe('Basic Operations', () => {
    it('sets and gets values correctly', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('handles non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('checks existence correctly', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('deletes values correctly', () => {
      cache.set('key1', 'value1');
      cache.delete('key1');
      expect(cache.get('key1')).toBeNull();
    });

    it('clears all values', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('Entry Limits', () => {
    it('enforces maximum entries limit', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should evict oldest entry

      expect(cache.get('key1')).toBeNull(); // Should be evicted
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });
  });

  describe('TTL and Expiration', () => {
    it('expires entries after TTL', () => {
      jest.useFakeTimers();

      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');

      // Advance time beyond TTL
      jest.advanceTimersByTime(1500);

      expect(cache.get('key1')).toBeNull();

      jest.useRealTimers();
    });

    it('runs cleanup periodically', () => {
      jest.useFakeTimers();

      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      // Advance time beyond TTL
      jest.advanceTimersByTime(1500);

      // Trigger cleanup
      jest.advanceTimersByTime(60000);

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();

      jest.useRealTimers();
    });
  });

  describe('Statistics', () => {
    it('tracks hits and misses', () => {
      cache.set('key1', 'value1');

      cache.get('key1'); // Hit
      cache.get('nonexistent'); // Miss

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('tracks evictions', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should cause eviction

      const stats = cache.getStats();
      expect(stats.evictions).toBeGreaterThan(0);
    });
  });

  describe('Metadata', () => {
    it('stores and retrieves metadata', () => {
      const metadata = { category: 'test', priority: 1 };
      cache.set('key1', 'value1', metadata);

      expect(cache.getMetadata('key1')).toEqual(metadata);
    });

    it('updates metadata', () => {
      cache.set('key1', 'value1', { category: 'test' });
      cache.updateMetadata('key1', { priority: 1 });

      expect(cache.getMetadata('key1')).toEqual({
        category: 'test',
        priority: 1
      });
    });
  });

  describe('Persistence', () => {
    it('persists cache to localStorage', () => {
      cache.set('key1', 'value1');
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('loads persisted cache from localStorage', () => {
      const persistedData = {
        entries: [['test:key1', { value: 'value1', timestamp: Date.now(), version: '1.0.0' }]],
        stats: { hits: 0, misses: 0, evictions: 0, size: 1 },
        version: '1.0.0'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(persistedData));

      const newCache = new CacheManager({
        namespace: 'test',
        version: '1.0.0',
        ttl: 1000,
        persistenceKey: 'test_cache'
      });

      expect(newCache.get('key1')).toBe('value1');
    });

    it('handles invalid persisted data', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const newCache = new CacheManager({
        namespace: 'test',
        version: '1.0.0',
        ttl: 1000,
        persistenceKey: 'test_cache'
      });

      expect(() => newCache.get('key1')).not.toThrow();
    });
  });
});

describe('CalculatorCacheManager', () => {
  let cache: CalculatorCacheManager;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new CalculatorCacheManager();
  });

  const validState: CalculatorState = {
    values: { amount: 1000 },
    errors: [],
    result: { total: 1100 },
    isValid: true,
    isDirty: false
  };

  describe('Calculator State Operations', () => {
    it('caches valid calculator state', () => {
      cache.setCacheState('calculator1', validState);
      expect(cache.getCacheState('calculator1')).toEqual(validState);
    });

    it('rejects invalid calculator state', () => {
      const invalidState = { foo: 'bar' };
      cache.setCacheState('calculator1', invalidState as any);
      expect(cache.getCacheState('calculator1')).toBeNull();
    });

    it('includes metadata with timestamp', () => {
      cache.setCacheState('calculator1', validState);
      const metadata = cache.getMetadata('calculator1');
      expect(metadata).toHaveProperty('lastUpdated');
    });

    it('handles custom metadata', () => {
      const metadata = { userModified: true };
      cache.setCacheState('calculator1', validState, metadata);
      
      const storedMetadata = cache.getMetadata('calculator1');
      expect(storedMetadata).toMatchObject(metadata);
      expect(storedMetadata).toHaveProperty('lastUpdated');
    });
  });

  describe('Calculator Cache Persistence', () => {
    it('persists calculator state', () => {
      cache.setCacheState('calculator1', validState);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'calculator_cache',
        expect.any(String)
      );
    });

    it('loads persisted calculator state', () => {
      const persistedData = {
        entries: [
          [
            'calculator:calculator1',
            {
              value: validState,
              timestamp: Date.now(),
              version: '1.0.0',
              metadata: { lastUpdated: new Date().toISOString() }
            }
          ]
        ],
        stats: { hits: 0, misses: 0, evictions: 0, size: 1 },
        version: '1.0.0'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(persistedData));

      const newCache = new CalculatorCacheManager();
      expect(newCache.getCacheState('calculator1')).toEqual(validState);
    });
  });
});

