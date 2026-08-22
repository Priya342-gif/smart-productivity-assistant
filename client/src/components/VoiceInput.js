import React, { useState, useEffect, useRef } from 'react';

function VoiceInput({ onTranscript, isDisabled }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please enable microphone permissions.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-2 text-warm-gray-400 cursor-not-allowed"
        title="Speech recognition not supported"
      >
        🎤
      </button>
    );
  }

  return (
    <button
      onClick={toggleListening}
      disabled={isDisabled}
      className={`p-2 rounded-lg transition-all ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'text-warm-gray-600 hover:bg-warm-gray-100'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      🎤
    </button>
  );
}

export default VoiceInput;
