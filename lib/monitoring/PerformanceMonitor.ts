'use client';

import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
    pageLoadTime: number;
    componentRenderTime: number;
    calculationTime: number;
    memoryUsage: number;
    networkLatency: number;
    errorRate: number;
    userEngagementScore: number;
}

interface ComponentPerformance {
    componentName: string;
    renderTime: number;
    reRenderCount: number;
    mountTime: number;
    lastUpdated: Date;
}

interface CalculatorPerformance {
    calculatorId: string;
    executionTime: number;
    complexity: 'low' | 'medium' | 'high';
    inputValidationTime: number;
    renderTime: number;
    userWaitTime: number;
}

export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: PerformanceMetrics;
    private componentMetrics: Map<string, ComponentPerformance> = new Map();
    private calculatorMetrics: Map<string, CalculatorPerformance> = new Map();
    private observers: PerformanceObserver[] = [];

    private constructor() {
        this.metrics = {
            pageLoadTime: 0,
            componentRenderTime: 0,
            calculationTime: 0,
            memoryUsage: 0,
            networkLatency: 0,
            errorRate: 0,
            userEngagementScore: 0
        };

        this.initializeMonitoring();
    }

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    private initializeMonitoring() {
        if (typeof window === 'undefined') return;

        // Monitor page load performance
        this.monitorPageLoad();

        // Monitor resource loading
        this.monitorResources();

        // Monitor long tasks
        this.monitorLongTasks();

        // Monitor memory usage
        this.monitorMemoryUsage();

        // Monitor user interactions
        this.monitorUserInteractions();
    }

    private monitorPageLoad() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                    if (navigation) {
                        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
                        this.reportMetrics('page-load', {
                            loadTime: this.metrics.pageLoadTime,
                            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                            firstPaint: this.getFirstPaint(),
                            firstContentfulPaint: this.getFirstContentfulPaint()
                        });
                    }
                }, 0);
            });
        }
    }

    private monitorResources() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'resource') {
                        const resource = entry as PerformanceResourceTiming;
                        this.analyzeResourcePerformance(resource);
                    }
                });
            });

            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.push(resourceObserver);
        }
    }

    private monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        this.reportLongTask(entry as PerformanceEntry);
                    });
                });

                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.push(longTaskObserver);
            } catch {
                // longtask might not be supported
                console.warn('Long task monitoring not supported');
            }
        }
    }

    private monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = (performance as Performance & { 
                    memory?: { 
                        usedJSHeapSize: number; 
                        jsHeapSizeLimit: number;
                        totalJSHeapSize: number;
                    } 
                }).memory;
                
                if (memory) {
                    this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                    
                    if (this.metrics.memoryUsage > 0.9) {
                        this.reportHighMemoryUsage(memory);
                    }
                }
            }, 10000); // Check every 10 seconds
        }
    }

    private monitorUserInteractions() {
        let interactionCount = 0;
        const totalInteractionTime = 0;

        const interactionEvents = ['click', 'input', 'scroll', 'keypress'];
        
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
                this.updateEngagementScore(interactionCount, totalInteractionTime);
            }, { passive: true });
        });
    }

    // Component Performance Tracking
    startComponentRender(componentName: string): () => void {
        const startTime = performance.now();
        
        return () => {
            const renderTime = performance.now() - startTime;
            const existing = this.componentMetrics.get(componentName);
            
            this.componentMetrics.set(componentName, {
                componentName,
                renderTime,
                reRenderCount: (existing?.reRenderCount || 0) + 1,
                mountTime: existing?.mountTime || startTime,
                lastUpdated: new Date()
            });

            // Report slow renders
            if (renderTime > 100) {
                this.reportSlowComponent(componentName, renderTime);
            }
        };
    }

    // Calculator Performance Tracking
    trackCalculatorPerformance(
        calculatorId: string,
        executionTime: number,
        complexity: 'low' | 'medium' | 'high',
        inputValidationTime: number = 0,
        renderTime: number = 0
    ) {
        const userWaitTime = executionTime + inputValidationTime + renderTime;
        
        this.calculatorMetrics.set(calculatorId, {
            calculatorId,
            executionTime,
            complexity,
            inputValidationTime,
            renderTime,
            userWaitTime
        });

        // Report slow calculations
        const threshold = complexity === 'high' ? 1000 : complexity === 'medium' ? 500 : 200;
        if (userWaitTime > threshold) {
            this.reportSlowCalculation(calculatorId, userWaitTime, threshold);
        }
    }

    // Utility Methods
    private getFirstPaint(): number {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }

    private getFirstContentfulPaint(): number {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
    }

    private analyzeResourcePerformance(resource: PerformanceResourceTiming) {
        const loadTime = resource.responseEnd - resource.requestStart;
        const resourceSize = resource.transferSize || 0;
        
        // Flag slow resources
        if (loadTime > 2000) { // 2 seconds
            this.reportSlowResource(resource.name, loadTime, resourceSize);
        }

        // Track network latency
        this.metrics.networkLatency = resource.responseStart - resource.requestStart;
    }

    private updateEngagementScore(interactionCount: number, totalTime: number) {
        // Simple engagement scoring based on interactions and time
        const timeScore = Math.min(totalTime / 300000, 1); // 5 minutes max
        const interactionScore = Math.min(interactionCount / 50, 1); // 50 interactions max
        this.metrics.userEngagementScore = (timeScore + interactionScore) / 2;
    }

    // Reporting Methods
    private reportMetrics(type: string, data: Record<string, unknown>) {
        console.log(`Performance Metrics [${type}]:`, data);
        
        // In production, send to analytics service
        if (process.env.NODE_ENV === 'production') {
            this.sendToAnalytics(type, data);
        }
    }

    private reportLongTask(entry: PerformanceEntry) {
        console.warn(`Long Task Detected: ${entry.name} took ${entry.duration}ms`);
        this.reportMetrics('long-task', {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
        });
    }

    private reportSlowComponent(componentName: string, renderTime: number) {
        console.warn(`Slow Component Render: ${componentName} took ${renderTime}ms`);
        this.reportMetrics('slow-component', {
            componentName,
            renderTime,
            threshold: 100
        });
    }

    private reportSlowCalculation(calculatorId: string, userWaitTime: number, threshold: number) {
        console.warn(`Slow Calculator: ${calculatorId} took ${userWaitTime}ms (threshold: ${threshold}ms)`);
        this.reportMetrics('slow-calculation', {
            calculatorId,
            userWaitTime,
            threshold
        });
    }

    private reportSlowResource(name: string, loadTime: number, size: number) {
        console.warn(`Slow Resource: ${name} took ${loadTime}ms (${size} bytes)`);
        this.reportMetrics('slow-resource', {
            name,
            loadTime,
            size
        });
    }

    private reportHighMemoryUsage(memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number }) {
        console.warn(`High Memory Usage: ${memory.usedJSHeapSize / 1024 / 1024}MB`);
        this.reportMetrics('high-memory', {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            percentage: this.metrics.memoryUsage
        });
    }

    private sendToAnalytics(type: string, data: Record<string, unknown>) {
        // Integration point for analytics services like Google Analytics, Mixpanel, etc.
        // This would be implemented based on your chosen analytics platform
        
        try {
            // Example: Send to custom analytics endpoint
            fetch('/api/analytics/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    data,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            }).catch(error => {
                console.warn('Failed to send analytics:', error);
            });
        } catch (error) {
            console.warn('Analytics sending failed:', error);
        }
    }

    // Public API
    getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    getComponentMetrics(): ComponentPerformance[] {
        return Array.from(this.componentMetrics.values());
    }

    getCalculatorMetrics(): CalculatorPerformance[] {
        return Array.from(this.calculatorMetrics.values());
    }

    generatePerformanceReport(): string {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.getMetrics(),
            components: this.getComponentMetrics(),
            calculators: this.getCalculatorMetrics(),
            recommendations: this.generateRecommendations()
        };

        return JSON.stringify(report, null, 2);
    }

    private generateRecommendations(): string[] {
        const recommendations: string[] = [];

        if (this.metrics.pageLoadTime > 3000) {
            recommendations.push('Consider code splitting to reduce initial bundle size');
        }

        if (this.metrics.memoryUsage > 0.8) {
            recommendations.push('High memory usage detected - review for memory leaks');
        }

        const slowComponents = this.getComponentMetrics().filter(c => c.renderTime > 100);
        if (slowComponents.length > 0) {
            recommendations.push(`Optimize slow components: ${slowComponents.map(c => c.componentName).join(', ')}`);
        }

        if (this.metrics.userEngagementScore < 0.3) {
            recommendations.push('Low user engagement - consider UX improvements');
        }

        return recommendations;
    }

    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// React Hook for Performance Monitoring
export function usePerformanceMonitor(componentName: string) {
    const monitor = PerformanceMonitor.getInstance();
    const [renderCount, setRenderCount] = useState(0);

    useEffect(() => {
        const endRender = monitor.startComponentRender(componentName);
        setRenderCount(prev => prev + 1);
        
        return () => {
            endRender();
        };
    }, [monitor, componentName]);

    const trackCalculation = useCallback((
        calculatorId: string,
        executionTime: number,
        complexity: 'low' | 'medium' | 'high' = 'medium'
    ) => {
        monitor.trackCalculatorPerformance(calculatorId, executionTime, complexity);
    }, [monitor]);

    return {
        renderCount,
        trackCalculation,
        getMetrics: () => monitor.getMetrics(),
        generateReport: () => monitor.generatePerformanceReport()
    };
}

// Performance Wrapper Component
export function PerformanceWrapper({ 
    children, 
    componentName 
}: { 
    children: React.ReactNode; 
    componentName: string; 
}) {
    usePerformanceMonitor(componentName);
    return children;
}

export default PerformanceMonitor;
