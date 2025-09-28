'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import ky from 'ky';

interface CoachResponse {
  message: string;
  items: string[];
}

interface ActivityResult {
  message: string;
  success?: boolean;
  feedback?: string;
}

export default function MuseumActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [completedSentences, setCompletedSentences] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ActivityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize activity
  useEffect(() => {
    const startActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await ky.post('/api/users/coach', {
          json: { userPrompt: 'start practice' }
        }).json<CoachResponse>();
        
        setMessage(response.message);
        setWords(response.items);
      } catch (error) {
        console.error('Failed to start activity:', error);
        setError('No se pudo iniciar la actividad. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    startActivity();
  }, []);

  const handleWordClick = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const removeLastWord = () => {
    setSelectedWords(selectedWords.slice(0, -1));
  };

  const clearSentence = () => {
    setSelectedWords([]);
  };

  const completeSentence = () => {
    if (selectedWords.length === 0) return;
    
    const sentence = selectedWords.join(' ') + '.';
    setCompletedSentences([...completedSentences, sentence]);
    setSelectedWords([]);
  };

  const submitActivity = async () => {
    if (completedSentences.length < 2) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const userResponse = completedSentences.join(' ');
      
      const result = await ky.post('/api/users/coach', {
        json: { userPrompt: `end of round: ${userResponse}` }
      }).json<ActivityResult>();
      
      setResult(result);
    } catch (error) {
      console.error('Failed to submit activity:', error);
      setError('No se pudo enviar la actividad. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueStory = () => {
    // Redirect back to story with the museum activity completion
    router.push('/story?completed=museum-activity');
  };

  if (loading) {
    return (
      <div className="relative w-full min-h-screen overflow-y-auto flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900" />
        <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-gray-800">Cargando actividad...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-yellow-400 animate-pulse" />
          <div className="absolute top-32 right-16 w-12 h-12 rounded-full bg-blue-300 animate-bounce" />
          <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-green-300 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-white text-center">🏛️ Actividad del Museo</h1>
        </div>
      </div>

      <div className="relative flex flex-col px-4 py-6 max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {!result ? (
          <>
            {/* Instructions */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">📝 {message}</h2>
              <p className="text-gray-700 mb-4">
                Toca las palabras para crear oraciones. Necesitas completar <strong>2 oraciones</strong> para reconstruir la fuente.
              </p>
              <div className="text-sm text-gray-600">
                <p>• Selecciona palabras en el orden que desees</p>
                <p>• Completa una oración y luego otra</p>
                <p>• Reconstruye la fuente usando las piezas rotas</p>
              </div>
            </div>

            {/* Current sentence builder */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🔨 Construyendo oración {completedSentences.length + 1}/2:
              </h3>
              
              <div className="min-h-[60px] bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300 mb-4">
                {selectedWords.length === 0 ? (
                  <p className="text-gray-500 italic">Toca las palabras para construir tu oración...</p>
                ) : (
                  <p className="text-gray-800 text-lg">{selectedWords.join(' ')}</p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={removeLastWord}
                  disabled={selectedWords.length === 0}
                  size="sm"
                  variant="secondary"
                >
                  ↶ Quitar última
                </Button>
                <Button
                  onClick={clearSentence}
                  disabled={selectedWords.length === 0}
                  size="sm"
                  variant="secondary"
                >
                  🗑️ Limpiar
                </Button>
                <Button
                  onClick={completeSentence}
                  disabled={selectedWords.length === 0}
                  size="sm"
                  variant="primary"
                >
                  ✅ Completar oración
                </Button>
              </div>
            </div>

            {/* Submit button - appears when 2 sentences are completed */}
            {completedSentences.length >= 2 && (
              <div className="text-center mb-6">
                <button
                  onClick={submitActivity}
                  disabled={isSubmitting}
                  className="px-8 py-4 text-lg font-bold text-white rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
                  style={{
                    background: isSubmitting 
                      ? 'linear-gradient(to right, #10b981, #059669)' 
                      : 'linear-gradient(to right, #16a34a, #10b981)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #15803d, #047857)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #16a34a, #10b981)';
                    }
                  }}
                >
                  {isSubmitting ? '🔄 Enviando...' : '🏛️ Reconstruir Fuente'}
                </button>
              </div>
            )}

            {/* Completed sentences */}
            {completedSentences.length > 0 && (
              <div className="bg-green-50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-200 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Oraciones completadas:</h3>
                {completedSentences.map((sentence, index) => (
                  <p key={index} className="text-green-700 mb-2 text-lg">
                    {index + 1}. {sentence}
                  </p>
                ))}
              </div>
            )}

            {/* Word buttons */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🧩 Piezas de la fuente:</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {words.map((word, index) => (
                  <button
                    key={`${word}-${index}`}
                    onClick={() => handleWordClick(word)}
                    className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl border border-blue-200 transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 text-center">
            <div className="mb-6">
              {result.success !== false ? (
                <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">{result.message}</h2>
            
            {result.feedback && (
              <p className="text-gray-700 mb-6 text-lg">{result.feedback}</p>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Tus oraciones:</h3>
              {completedSentences.map((sentence, index) => (
                <p key={index} className="text-gray-700 mb-1">
                  {index + 1}. {sentence}
                </p>
              ))}
            </div>

            <button
              onClick={continueStory}
              className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl min-w-[200px]"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            >
              🌟 Continuar Historia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
