'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceRecorder } from '@/lib/voice-recorder';

interface VoiceFABProps {
  onTranscript?: (text: string) => void;
  onRecordingComplete?: (audioBlob: Blob) => void;
}

export default function VoiceFAB({ onTranscript, onRecordingComplete }: VoiceFABProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Listen for recording status changes
    if (voiceRecorder) {
      voiceRecorder.onRecordingChange(setIsRecording);
    }
  }, []);

  const handleMainButtonClick = async () => {
    if (!voiceRecorder) return;
    
    if (isRecording) {
      const memoId = await voiceRecorder.stopRecording();
      setIsListening(false);
      if (memoId) {
        // Get the saved voice memo
        const memos = await voiceRecorder.getVoiceMemos();
        const memo = memos.find(m => m.id === memoId);
        if (memo && memo.blob) {
          onRecordingComplete?.(memo.blob);
          // Try local transcription
          const transcription = await voiceRecorder.transcribeLocally(memo.blob);
          if (transcription) {
            setTranscript(transcription);
            onTranscript?.(transcription);
          }
        }
      }
    } else {
      await voiceRecorder.startRecording();
      setIsListening(true);
    }
  };

  const toggleTTS = () => {
    setTtsEnabled(!ttsEnabled);
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('tts-enabled', (!ttsEnabled).toString());
    }
  };

  // Read text using TTS
  // const speakText = (text: string) => {
  //   if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.rate = 1.0;
  //   utterance.pitch = 1.0;
  //   utterance.volume = 1.0;
    
  //   window.speechSynthesis.speak(utterance);
  // };

  return (
    <>
      {/* ARIA Live Region for Screen Readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {transcript && `Voice input: ${transcript}`}
      </div>

      {/* FAB Container */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 right-0 bg-gray-800 rounded-lg shadow-lg p-2 mb-2"
            >
              <button
                onClick={toggleTTS}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded transition-colors"
                aria-label={ttsEnabled ? 'Disable text to speech' : 'Enable text to speech'}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>TTS {ttsEnabled ? 'On' : 'Off'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={handleMainButtonClick}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowControls(!showControls);
          }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative w-14 h-14 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-offset-2
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}
          `}
          aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
        >
          {isRecording ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          )}
        </motion.button>

        {/* Listening indicator */}
        {isListening && !isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="w-14 h-14 rounded-full border-2 border-blue-400 animate-ping" />
          </motion.div>
        )}
      </div>

      {/* Transcript preview (optional) */}
      {transcript && isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-6 max-w-xs bg-gray-800 text-white p-3 rounded-lg shadow-lg"
        >
          <p className="text-sm">{transcript}</p>
        </motion.div>
      )}
    </>
  );
}