// Push Notifications Utility

export class PushNotificationManager {
  private permission: NotificationPermission = 'default';
  private subscription: PushSubscription | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  // Check if push notifications are supported
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window;
  }

  // Get current permission status
  getPermission(): NotificationPermission {
    return this.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('[Push] Notifications not supported');
      return 'denied';
    }

    try {
      this.permission = await Notification.requestPermission();
      
      // Track permission grant
      if (this.permission === 'granted' && typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'notification_permission', {
          event_category: 'engagement',
          event_label: 'granted'
        });
      }
      
      return this.permission;
    } catch (error) {
      console.error('[Push] Failed to request permission:', error);
      return 'denied';
    }
  }

  // Subscribe to push notifications
  async subscribe(vapidPublicKey?: string): Promise<PushSubscription | null> {
    if (!this.isSupported() || this.permission !== 'granted') {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscribeOptions: PushSubscriptionOptionsInit = {
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey ? this.urlBase64ToUint8Array(vapidPublicKey) : undefined
      };

      this.subscription = await registration.pushManager.subscribe(subscribeOptions);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
      
      return this.subscription;
    } catch (error) {
      console.error('[Push] Failed to subscribe:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return false;
    }

    try {
      const success = await this.subscription.unsubscribe();
      if (success) {
        await this.removeSubscriptionFromServer(this.subscription);
        this.subscription = null;
      }
      return success;
    } catch (error) {
      console.error('[Push] Failed to unsubscribe:', error);
      return false;
    }
  }

  // Get current subscription
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      this.subscription = await registration.pushManager.getSubscription();
      return this.subscription;
    } catch (error) {
      console.error('[Push] Failed to get subscription:', error);
      return null;
    }
  }

  // Show local notification
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported() || this.permission !== 'granted') {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const notificationOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        requireInteraction: false,
        ...options
      };
      
      await registration.showNotification(title, notificationOptions);
    } catch (error) {
      console.error('[Push] Failed to show notification:', error);
    }
  }

  // Convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    // TODO: Implement API call to save subscription
    console.log('[Push] Would send subscription to server:', subscription);
    
    // Example implementation:
    // await fetch('/api/push/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscription.toJSON())
    // });
  }

  // Remove subscription from server
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    // TODO: Implement API call to remove subscription
    console.log('[Push] Would remove subscription from server:', subscription);
    
    // Example implementation:
    // await fetch('/api/push/unsubscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ endpoint: subscription.endpoint })
    // });
  }
}

// Export singleton instance
export const pushNotifications = new PushNotificationManager();