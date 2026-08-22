import React, { useState, useEffect } from 'react';

function VoiceOutput({ text, autoPlay = false }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports Speech Synthesis API
    if (!window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    if (autoPlay && text) {
      speak();
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, autoPlay]);

  const speak = () => {
    if (!isSupported) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0; // Speed
    utterance.pitch = 1.0; // Pitch
    utterance.volume = 1.0; // Volume

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isSpeaking ? stop : speak}
      className={`p-1 rounded hover:bg-warm-gray-100 transition-colors ${
        isSpeaking ? 'text-blue-600' : 'text-warm-gray-600'
      }`}
      title={isSpeaking ? 'Stop reading' : 'Read aloud'}
    >
      {isSpeaking ? '🔊' : '🔈'}
    </button>
  );
}

export default VoiceOutput;
