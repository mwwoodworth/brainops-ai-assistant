// Analytics Utility

interface AnalyticsEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export class Analytics {
  private isEnabled = false;

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && !!window.gtag;
  }

  // Track page view
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled) return;

    window.gtag!('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: path,
      page_title: title,
    });
  }

  // Track custom event
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    window.gtag!('event', event.name, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }

  // Track device info
  trackDeviceInfo() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    const deviceInfo = {
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      device_pixel_ratio: window.devicePixelRatio,
      is_touch: 'ontouchstart' in window,
      is_pwa: window.matchMedia('(display-mode: standalone)').matches,
    };

    this.trackEvent({
      name: 'device_info',
      category: 'system',
      metadata: deviceInfo,
    });
  }

  // Track foldable device state
  trackFoldableState(state: {
    isFoldable: boolean;
    screenSegments: number;
    foldPosition: string | null;
    isSpanned: boolean;
  }) {
    if (!this.isEnabled) return;

    this.trackEvent({
      name: 'foldable_state',
      category: 'device',
      label: state.foldPosition || 'none',
      value: state.screenSegments,
      metadata: state,
    });
  }

  // Track voice interaction
  trackVoiceInteraction(action: 'start' | 'stop' | 'transcribe' | 'tts', duration?: number) {
    if (!this.isEnabled) return;

    this.trackEvent({
      name: 'voice_interaction',
      category: 'engagement',
      label: action,
      value: duration,
    });
  }

  // Track offline usage
  trackOfflineUsage(action: string, queueSize?: number) {
    if (!this.isEnabled) return;

    this.trackEvent({
      name: 'offline_usage',
      category: 'pwa',
      label: action,
      value: queueSize,
    });
  }

  // Track performance metrics
  trackPerformance() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Use Performance API if available
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigationTiming) {
        this.trackEvent({
          name: 'performance_metrics',
          category: 'performance',
          metadata: {
            dns_time: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
            connect_time: navigationTiming.connectEnd - navigationTiming.connectStart,
            ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
            response_time: navigationTiming.responseEnd - navigationTiming.responseStart,
            dom_interactive: navigationTiming.domInteractive - navigationTiming.responseEnd,
            dom_complete: navigationTiming.domComplete - navigationTiming.responseEnd,
            load_complete: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
            total_time: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
          },
        });
      }
    }
  }

  // Track errors
  trackError(error: Error, context?: string) {
    if (!this.isEnabled) return;

    this.trackEvent({
      name: 'exception',
      category: 'error',
      label: context,
      metadata: {
        description: error.message,
        stack: error.stack,
        fatal: false,
      },
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();