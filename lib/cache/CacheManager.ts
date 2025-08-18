import { CalculatorState } from '@/lib/context/CalculatorContext';

// Cache entry interface
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  version: string;
  metadata?: Record<string, unknown>;
}

// Cache configuration
interface CacheConfig {
  namespace: string;
  version: string;
  ttl: number; // Time to live in milliseconds
  maxEntries?: number;
  persistenceKey?: string;
}

// Cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
}

/**
 * Cache manager for calculator results and state
 */
export class CacheManager<T = unknown> {
  private cache: Map<string, CacheEntry<T>>;
  private stats: CacheStats;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.config = config;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0
    };

    // Load persisted cache if available
    this.loadPersistedCache();

    // Set up periodic cache cleanup
    setInterval(() => this.cleanup(), 60000); // Run cleanup every minute
  }

  /**
   * Set a value in the cache
   */
  set(key: string, value: T, metadata?: Record<string, unknown>): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      version: this.config.version,
      metadata
    };

    // Enforce max entries limit
    if (this.config.maxEntries && this.cache.size >= this.config.maxEntries) {
      this.evictOldest();
    }

    this.cache.set(this.getNamespacedKey(key), entry);
    this.stats.size = this.cache.size;
    this.persistCache();
  }

  /**
   * Get a value from the cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(this.getNamespacedKey(key));

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry is valid
    if (this.isEntryValid(entry)) {
      this.stats.hits++;
      return entry.value;
    }

    // Entry is invalid, remove it
    this.cache.delete(this.getNamespacedKey(key));
    this.stats.evictions++;
    this.stats.size = this.cache.size;
    return null;
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(this.getNamespacedKey(key));
    return entry !== undefined && this.isEntryValid(entry);
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): void {
    this.cache.delete(this.getNamespacedKey(key));
    this.stats.size = this.cache.size;
    this.persistCache();
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.evictions += 1;
    this.persistCache();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get all valid entries
   */
  entries(): Array<[string, T]> {
    const validEntries: Array<[string, T]> = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isEntryValid(entry)) {
        validEntries.push([this.removeNamespace(key), entry.value]);
      }
    }

    return validEntries;
  }

  /**
   * Update cache configuration
   */
  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
    this.cleanup(); // Run cleanup with new config
  }

  /**
   * Get metadata for a cache entry
   */
  getMetadata(key: string): Record<string, unknown> | undefined {
    const entry = this.cache.get(this.getNamespacedKey(key));
    return entry?.metadata;
  }

  /**
   * Update metadata for a cache entry
   */
  updateMetadata(key: string, metadata: Record<string, unknown>): void {
    const namespacedKey = this.getNamespacedKey(key);
    const entry = this.cache.get(namespacedKey);
    
    if (entry) {
      entry.metadata = { ...entry.metadata, ...metadata };
      this.cache.set(namespacedKey, entry);
      this.persistCache();
    }
  }

  // Private methods

  /**
   * Check if a cache entry is valid
   */
  private isEntryValid(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    const age = now - entry.timestamp;

    return (
      entry.version === this.config.version && // Version check
      age < this.config.ttl // TTL check
    );
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let evictions = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isEntryValid(entry)) {
        this.cache.delete(key);
        evictions++;
      }
    }

    if (evictions > 0) {
      this.stats.evictions += evictions;
      this.stats.size = this.cache.size;
      this.persistCache();
    }
  }

  /**
   * Evict oldest entry from cache
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestKey = key;
        oldestTimestamp = entry.timestamp;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Get namespaced key
   */
  private getNamespacedKey(key: string): string {
    return \`\${this.config.namespace}:\${key}\`;
  }

  /**
   * Remove namespace from key
   */
  private removeNamespace(namespacedKey: string): string {
    return namespacedKey.replace(\`\${this.config.namespace}:\`, '');
  }

  /**
   * Persist cache to storage
   */
  private persistCache(): void {
    if (!this.config.persistenceKey) return;

    try {
      const serialized = JSON.stringify({
        entries: Array.from(this.cache.entries()),
        stats: this.stats,
        version: this.config.version
      });

      localStorage.setItem(this.config.persistenceKey, serialized);
    } catch (error) {
      console.error('Error persisting cache:', error);
    }
  }

  /**
   * Load persisted cache from storage
   */
  private loadPersistedCache(): void {
    if (!this.config.persistenceKey) return;

    try {
      const serialized = localStorage.getItem(this.config.persistenceKey);
      if (!serialized) return;

      const { entries, stats, version } = JSON.parse(serialized);

      // Only restore if version matches
      if (version === this.config.version) {
        this.cache = new Map(entries);
        this.stats = stats;
        this.cleanup(); // Clean up any expired entries
      }
    } catch (error) {
      console.error('Error loading persisted cache:', error);
    }
  }
}

// Calculator-specific cache manager
export class CalculatorCacheManager extends CacheManager<CalculatorState> {
  constructor() {
    super({
      namespace: 'calculator',
      version: '1.0.0',
      ttl: 24 * 60 * 60 * 1000, // 24 hours
      maxEntries: 100,
      persistenceKey: 'calculator_cache'
    });
  }

  /**
   * Cache calculator state with input validation
   */
  setCacheState(
    calculatorId: string,
    state: CalculatorState,
    metadata?: Record<string, unknown>
  ): void {
    // Validate state before caching
    if (!this.isValidCalculatorState(state)) {
      console.warn(\`Invalid calculator state for \${calculatorId}\`);
      return;
    }

    this.set(calculatorId, state, {
      ...metadata,
      lastUpdated: new Date().toISOString()
    });
  }

  /**
   * Get calculator state with type safety
   */
  getCacheState(calculatorId: string): CalculatorState | null {
    const state = this.get(calculatorId);
    
    if (state && this.isValidCalculatorState(state)) {
      return state;
    }

    return null;
  }

  /**
   * Validate calculator state
   */
  private isValidCalculatorState(state: unknown): state is CalculatorState {
    if (!state || typeof state !== 'object') return false;

    const requiredKeys = ['values', 'errors', 'result', 'isValid', 'isDirty'];
    return requiredKeys.every(key => key in state);
  }
}

// Export singleton instance
export const calculatorCache = new CalculatorCacheManager();

