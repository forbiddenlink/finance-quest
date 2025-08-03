'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Brain,
  Sparkles,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

// Define types for the speech recognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface VoiceQAProps {
  isQuizMode?: boolean;
}

export default function VoiceQA({ isQuizMode = false }: VoiceQAProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  // Speech Recognition API has inconsistent TypeScript support across browsers
  const [recognition, setRecognition] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  const handleVoiceQuestion = useCallback(async (question: string) => {
    if (isQuizMode) {
      setResponse("Voice questions are disabled during quizzes to maintain assessment integrity. Please complete the quiz first!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Voice Question: ${question}`,
          context: 'voice-qa',
          requestId: Date.now().toString()
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setResponse("I'm having trouble processing your question right now. Please try typing your question instead, or check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isQuizMode]);

  useEffect(() => {
    // Check if speech recognition is supported  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const windowWithSpeech = window as any;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognitionInstance = new SpeechRecognition() as any;

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.results[event.results.length - 1];
        const transcriptText = current[0].transcript;
        setTranscript(transcriptText);
        handleVoiceQuestion(transcriptText);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Set up speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, [handleVoiceQuestion]);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      setResponse('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speakResponse = () => {
    if (speechSynthesis && response && !isSpeaking) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    setTranscript('');
    setResponse('');
    stopSpeaking();
  };

  if (!isSupported) {
    return (
      <motion.div
        className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-xl p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <MicOff className={`w-6 h-6 ${theme.status.warning.text}`} />
          <h3 className={`text-lg font-semibold ${theme.status.warning.text}`}>Voice Q&A Not Available</h3>
        </div>
        <p className={`${theme.status.warning.text} mb-4`}>
          Your browser doesn&apos;t support speech recognition. Try using Chrome, Edge, or Safari for the best voice experience.
        </p>
        <p className={`text-sm ${theme.textColors.muted}`}>
          You can still ask questions using our text-based Q&A system below!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`${theme.status.info.bg} p-2 rounded-lg`}>
            <Mic className={`w-6 h-6 ${theme.textColors.accent}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Voice Financial Q&A</h3>
            <p className={`text-sm ${theme.textColors.secondary}`}>Ask any financial question with your voice</p>
          </div>
        </div>

        {(transcript || response) && (
          <button
            onClick={clearConversation}
            className={`flex items-center space-x-2 px-3 py-2 ${theme.backgrounds.cardHover} ${theme.textColors.secondary} rounded-lg hover:${theme.backgrounds.card} transition-colors`}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Clear</span>
          </button>
        )}
      </div>

      {isQuizMode && (
        <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 mb-6`}>
          <p className={`${theme.status.warning.text} text-sm font-medium`}>
            🔒 Voice Q&A is disabled during quizzes to maintain assessment integrity.
            Complete the quiz to unlock voice assistance!
          </p>
        </div>
      )}

      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.button
          onClick={isListening ? stopListening : startListening}
          disabled={isQuizMode || isLoading}
          className={`relative p-6 rounded-full transition-all ${isListening
            ? `${theme.buttons.secondary} ${theme.textColors.primary} shadow-lg`
            : isQuizMode
              ? `${theme.backgrounds.cardHover} ${theme.textColors.muted} cursor-not-allowed`
              : `${theme.buttons.primary} shadow-lg`
            }`}
          whileHover={!isQuizMode && !isLoading ? { scale: 1.05 } : {}}
          whileTap={!isQuizMode && !isLoading ? { scale: 0.95 } : {}}
        >
          {isListening ? (
            <>
              <MicOff className="w-8 h-8" />
              <motion.div
                className={`absolute inset-0 rounded-full border-4 ${theme.status.error.border}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </>
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </motion.button>

        {response && (
          <motion.button
            onClick={isSpeaking ? stopSpeaking : speakResponse}
            className={`p-4 rounded-full transition-all ${isSpeaking
              ? `${theme.buttons.primary} shadow-lg`
              : `${theme.buttons.primary} shadow-lg`
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </motion.button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="text-center mb-6">
        <AnimatePresence mode="wait">
          {isListening && (
            <motion.div
              key="listening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${theme.status.error.text} font-medium`}
            >
              🎙️ Listening... Speak your financial question now!
            </motion.div>
          )}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${theme.textColors.accent} font-medium flex items-center justify-center space-x-2`}
            >
              <Brain className="w-5 h-5 animate-spin" />
              <span>AI is thinking...</span>
            </motion.div>
          )}
          {isSpeaking && (
            <motion.div
              key="speaking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${theme.textColors.accent} font-medium flex items-center justify-center space-x-2`}
            >
              <Volume2 className="w-5 h-5" />
              <span>AI is speaking...</span>
            </motion.div>
          )}
          {!isListening && !isLoading && !isSpeaking && !isQuizMode && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={theme.textColors.secondary}
            >
              Click the microphone to ask a question with your voice
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conversation Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <div className={`${theme.backgrounds.card} rounded-lg p-4 border ${theme.borderColors.primary}`}>
              <div className="flex items-start space-x-3">
                <div className={`${theme.status.info.bg} p-2 rounded-full`}>
                  <MessageCircle className={`w-4 h-4 ${theme.textColors.accent}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${theme.textColors.secondary} mb-1`}>You asked:</p>
                  <p className={theme.textColors.primary}>&quot;{transcript}&quot;</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className={`${theme.backgrounds.cardHover} rounded-lg p-4 border ${theme.borderColors.accent}`}>
              <div className="flex items-start space-x-3">
                <div className={`${theme.status.info.bg} p-2 rounded-full`}>
                  <Brain className={`w-4 h-4 ${theme.textColors.accent}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-medium ${theme.textColors.secondary}`}>AI Financial Coach:</p>
                    <div className="flex items-center space-x-2">
                      {isSpeaking && (
                        <motion.div
                          className="flex space-x-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className={`w-1 h-4 ${theme.textColors.accent} rounded-full`}
                              animate={{ scaleY: [1, 2, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.1
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                      <button
                        onClick={isSpeaking ? stopSpeaking : speakResponse}
                        className={`p-1 rounded transition-colors ${isSpeaking
                          ? `${theme.textColors.error} hover:${theme.textColors.error}`
                          : `${theme.textColors.accent} hover:${theme.textColors.accentSecondary}`
                          }`}
                      >
                        {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className={`${theme.textColors.primary} leading-relaxed`}>{response}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      {!transcript && !response && !isQuizMode && (
        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 mt-6`}>
          <h4 className={`font-semibold ${theme.status.info.text} mb-2 flex items-center`}>
            <Sparkles className="w-4 h-4 mr-2" />
            Voice Q&A Tips
          </h4>
          <ul className={`text-sm ${theme.status.info.text} space-y-1`}>
            <li>• Speak clearly and ask specific financial questions</li>
            <li>• Try: &quot;How does compound interest work?&quot;</li>
            <li>• Try: &quot;What&apos;s a good credit score?&quot;</li>
            <li>• Try: &quot;Should I pay off debt or invest?&quot;</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
}
