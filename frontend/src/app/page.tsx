'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { useFoldable } from '@/hooks/useFoldable';

// Dynamic import to avoid SSR issues with offline features
const OfflineChat = dynamic(() => import('@/components/OfflineChat'), {
  ssr: false,
});

const VoiceFAB = dynamic(() => import('@/components/VoiceFAB'), {
  ssr: false,
});

const InstallBanner = dynamic(() => import('@/components/InstallBanner'), {
  ssr: false,
});

export default function Home() {
  const chatRef = useRef<{ addMessage: (text: string) => void }>(null);
  const foldableState = useFoldable();

  useEffect(() => {
    // Track device info on mount
    analytics.trackDeviceInfo();
    analytics.trackPerformance();
  }, []);

  useEffect(() => {
    // Track foldable state changes
    if (foldableState.isFoldable) {
      analytics.trackFoldableState(foldableState);
    }
  }, [foldableState]);

  const handleVoiceTranscript = (text: string) => {
    // Add the transcribed text to the chat
    chatRef.current?.addMessage(text);
    // Track voice usage
    analytics.trackVoiceInteraction('transcribe');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <OfflineChat ref={chatRef} />
      <VoiceFAB onTranscript={handleVoiceTranscript} />
      <InstallBanner />
    </div>
  );
}