'use client';

import { useEffect, useState, useCallback } from 'react';

interface AccessibilityState {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    colorBlindFriendly: boolean;
}

interface AccessibilityPreferences {
    fontSize: 'normal' | 'large' | 'larger';
    contrast: 'normal' | 'high' | 'higher';
    motion: 'normal' | 'reduced' | 'none';
    focusIndicator: 'normal' | 'enhanced';
    colorMode: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
}

class AccessibilityManager {
    private static instance: AccessibilityManager;
    private state: AccessibilityState;
    private preferences: AccessibilityPreferences;
    private focusTracker: FocusTracker;

    private constructor() {
        this.state = {
            highContrast: false,
            reducedMotion: false,
            largeText: false,
            screenReader: false,
            keyboardNavigation: false,
            colorBlindFriendly: false
        };

        this.preferences = {
            fontSize: 'normal',
            contrast: 'normal',
            motion: 'normal',
            focusIndicator: 'normal',
            colorMode: 'normal'
        };

        this.focusTracker = new FocusTracker();
        this.initializeAccessibility();
    }

    static getInstance(): AccessibilityManager {
        if (!AccessibilityManager.instance) {
            AccessibilityManager.instance = new AccessibilityManager();
        }
        return AccessibilityManager.instance;
    }

    private initializeAccessibility() {
        if (typeof window === 'undefined') return;

        // Load saved preferences
        this.loadPreferences();

        // Detect system preferences
        this.detectSystemPreferences();

        // Set up keyboard navigation detection
        this.setupKeyboardDetection();

        // Set up screen reader detection
        this.setupScreenReaderDetection();

        // Apply initial accessibility settings
        this.applyAccessibilitySettings();

        // Set up focus management
        this.focusTracker.initialize();
    }

    private loadPreferences() {
        try {
            const saved = localStorage.getItem('finance-quest-accessibility');
            if (saved) {
                const preferences = JSON.parse(saved);
                this.preferences = { ...this.preferences, ...preferences };
            }
        } catch (error) {
            console.warn('Failed to load accessibility preferences:', error);
        }
    }

    private savePreferences() {
        try {
            localStorage.setItem('finance-quest-accessibility', JSON.stringify(this.preferences));
        } catch (error) {
            console.warn('Failed to save accessibility preferences:', error);
        }
    }

    private detectSystemPreferences() {
        // Detect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.state.reducedMotion = true;
            this.preferences.motion = 'reduced';
        }

        // Detect high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.state.highContrast = true;
            this.preferences.contrast = 'high';
        }

        // Detect color scheme preference
        const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (colorSchemeMedia.matches) {
            document.documentElement.classList.add('dark-mode');
        }

        // Listen for changes
        colorSchemeMedia.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
        });
    }

    private setupKeyboardDetection() {
        let isUsingKeyboard = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                isUsingKeyboard = true;
                this.state.keyboardNavigation = true;
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            if (isUsingKeyboard) {
                isUsingKeyboard = false;
                this.state.keyboardNavigation = false;
                document.body.classList.remove('using-keyboard');
            }
        });
    }

    private setupScreenReaderDetection() {
        // Basic screen reader detection
        const isScreenReader = window.navigator.userAgent.includes('NVDA') ||
                              window.navigator.userAgent.includes('JAWS') ||
                              window.speechSynthesis ||
                              !!(window as typeof window & { speechSynthesis?: unknown }).speechSynthesis;

        if (isScreenReader) {
            this.state.screenReader = true;
            document.body.classList.add('screen-reader-active');
        }
    }

    private applyAccessibilitySettings() {
        const root = document.documentElement;

        // Apply font size
        root.classList.remove('font-normal', 'font-large', 'font-larger');
        root.classList.add(`font-${this.preferences.fontSize}`);

        // Apply contrast
        root.classList.remove('contrast-normal', 'contrast-high', 'contrast-higher');
        root.classList.add(`contrast-${this.preferences.contrast}`);

        // Apply motion preferences
        root.classList.remove('motion-normal', 'motion-reduced', 'motion-none');
        root.classList.add(`motion-${this.preferences.motion}`);

        // Apply focus indicator
        root.classList.remove('focus-normal', 'focus-enhanced');
        root.classList.add(`focus-${this.preferences.focusIndicator}`);

        // Apply color mode for color blindness
        root.classList.remove('color-normal', 'color-protanopia', 'color-deuteranopia', 'color-tritanopia', 'color-monochrome');
        root.classList.add(`color-${this.preferences.colorMode}`);
    }

    // Public API
    setFontSize(size: 'normal' | 'large' | 'larger') {
        this.preferences.fontSize = size;
        this.applyAccessibilitySettings();
        this.savePreferences();
    }

    setContrast(contrast: 'normal' | 'high' | 'higher') {
        this.preferences.contrast = contrast;
        this.applyAccessibilitySettings();
        this.savePreferences();
    }

    setMotion(motion: 'normal' | 'reduced' | 'none') {
        this.preferences.motion = motion;
        this.applyAccessibilitySettings();
        this.savePreferences();
    }

    setFocusIndicator(focus: 'normal' | 'enhanced') {
        this.preferences.focusIndicator = focus;
        this.applyAccessibilitySettings();
        this.savePreferences();
    }

    setColorMode(mode: AccessibilityPreferences['colorMode']) {
        this.preferences.colorMode = mode;
        this.applyAccessibilitySettings();
        this.savePreferences();
    }

    getState(): AccessibilityState {
        return { ...this.state };
    }

    getPreferences(): AccessibilityPreferences {
        return { ...this.preferences };
    }

    // Announce to screen readers
    announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Focus management
    focusElement(selector: string) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
            element.focus();
            this.announce(`Focused on ${element.getAttribute('aria-label') || element.textContent || 'element'}`);
        }
    }

    // Skip link functionality
    createSkipLink(target: string, text: string) {
        const skipLink = document.createElement('a');
        skipLink.href = target;
        skipLink.textContent = text;
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        return skipLink;
    }
}

class FocusTracker {
    private focusHistory: HTMLElement[] = [];
    private trapStack: HTMLElement[] = [];

    initialize() {
        document.addEventListener('focus', this.handleFocus.bind(this), true);
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    private handleFocus(event: FocusEvent) {
        if (event.target instanceof HTMLElement) {
            this.focusHistory.push(event.target);
            if (this.focusHistory.length > 10) {
                this.focusHistory.shift();
            }
        }
    }

    private handleKeydown(event: KeyboardEvent) {
        // Escape key to return to previous focus
        if (event.key === 'Escape' && this.focusHistory.length > 1) {
            const current = this.focusHistory.pop();
            const previous = this.focusHistory[this.focusHistory.length - 1];
            if (previous && previous !== current) {
                previous.focus();
            }
        }
    }

    trapFocus(container: HTMLElement) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
        this.trapStack.push(container);

        // Focus first element
        firstElement.focus();

        return () => {
            container.removeEventListener('keydown', handleTabKey);
            const index = this.trapStack.indexOf(container);
            if (index > -1) {
                this.trapStack.splice(index, 1);
            }
        };
    }

    releaseFocusTrap() {
        if (this.trapStack.length > 0) {
            this.trapStack.pop();
            // Focus will be restored by the component cleanup
        }
    }
}

// React Hook for Accessibility
export function useAccessibility() {
    const manager = AccessibilityManager.getInstance();
    const [state, setState] = useState(manager.getState());
    const [preferences, setPreferences] = useState(manager.getPreferences());

    useEffect(() => {
        // Update local state when preferences change
        setState(manager.getState());
        setPreferences(manager.getPreferences());
    }, [manager]);

    const updateFontSize = useCallback((size: 'normal' | 'large' | 'larger') => {
        manager.setFontSize(size);
        setPreferences(manager.getPreferences());
    }, [manager]);

    const updateContrast = useCallback((contrast: 'normal' | 'high' | 'higher') => {
        manager.setContrast(contrast);
        setPreferences(manager.getPreferences());
    }, [manager]);

    const updateMotion = useCallback((motion: 'normal' | 'reduced' | 'none') => {
        manager.setMotion(motion);
        setPreferences(manager.getPreferences());
    }, [manager]);

    const updateColorMode = useCallback((mode: AccessibilityPreferences['colorMode']) => {
        manager.setColorMode(mode);
        setPreferences(manager.getPreferences());
    }, [manager]);

    const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        manager.announce(message, priority);
    }, [manager]);

    return {
        state,
        preferences,
        updateFontSize,
        updateContrast,
        updateMotion,
        updateColorMode,
        announce,
        focusElement: manager.focusElement.bind(manager)
    };
}

// Accessibility Settings Component - Exported separately in AccessibilitySettings.tsx
export type { AccessibilityState, AccessibilityPreferences };

export default AccessibilityManager;
