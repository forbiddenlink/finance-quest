/**
 * Performance monitoring for Finance Quest
 * Tracks Core Web Vitals and user experience metrics
 */

import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals() {
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
  }

  private handleMetric(metric: { name: string; value: number; rating: 'good' | 'needs-improvement' | 'poor' }) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now()
    };

    this.metrics.push(performanceMetric);
    
    // Log poor performance
    if (metric.rating === 'poor') {
      console.warn(`Poor ${metric.name}:`, metric.value);
    }

    // TODO: Send to analytics service
    // this.sendToAnalytics(performanceMetric);
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageScore(): number {
    if (this.metrics.length === 0) return 0;
    
    const ratingScores = { good: 100, 'needs-improvement': 60, poor: 20 };
    const totalScore = this.metrics.reduce((sum, metric) => 
      sum + ratingScores[metric.rating], 0
    );
    
    return Math.round(totalScore / this.metrics.length);
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default PerformanceMonitor;
