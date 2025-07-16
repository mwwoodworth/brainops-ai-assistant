'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { canShowInstallPrompt, showInstallPrompt, isPWAInstalled } from '@/lib/pwa';

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const wasDismissed = localStorage.getItem('install-banner-dismissed') === 'true';
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Check if already installed
    if (isPWAInstalled()) {
      return;
    }

    // Show banner after a delay on repeat visits
    const visitCount = parseInt(localStorage.getItem('visit-count') || '0', 10);
    localStorage.setItem('visit-count', (visitCount + 1).toString());

    if (visitCount >= 2) {
      // Wait for prompt to be available
      const checkPrompt = setInterval(() => {
        if (canShowInstallPrompt()) {
          setShowBanner(true);
          clearInterval(checkPrompt);
        }
      }, 1000);

      // Clean up after 10 seconds
      setTimeout(() => clearInterval(checkPrompt), 10000);

      return () => clearInterval(checkPrompt);
    }
  }, []);

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      setShowBanner(false);
      // Track installation
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'banner'
        });
      }
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (!showBanner || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg border-t border-gray-700 p-4 z-40"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Install BrainOps Assistant</h3>
              <p className="text-gray-400 text-sm">Add to your home screen for quick access</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Install app"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Dismiss install banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}