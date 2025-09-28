'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StoryAttestation } from '@/components/StoryAttestation';
import { StoryVideo } from '@/components/StoryVideo';
import ky from 'ky';

type Output =
  | { kind: 'message'; text: string }
  | { kind: 'image'; src: string; alt?: string }
  | { kind: 'video'; src: string; autoplay?: boolean; interactive?: boolean }
  | { kind: 'fade'; to?: string; direction?: 'in' | 'out' }
  | { kind: 'notification'; text: string }
  | { kind: 'feature'; name: 'maps' | 'notes' | 'menu'; enabled: boolean }
  | { kind: 'attestation'; id?: string }
  | { kind: 'unknown'; raw: string };

type Choice = { label: string; to: string; key: string };
type StoryState = { 
  currentKey: string; 
  stack: string[];
  userProgress?: {
    attestations?: string[];
    choices?: Record<string, number>;
    completedNodes?: string[];
  };
};
type StepResult = { state: StoryState; outputs: Output[]; choices: Choice[] };

export default function StoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [res, setRes] = useState<StepResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [messagesComplete, setMessagesComplete] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    if (session?.user?.walletAddress) {
      setLoading(true);
      
      const completed = searchParams.get('completed');
      
      if (completed === 'museum-activity') {
        ky.get('/api/story?currentKey=museum-activity-return')
          .json()
          .then(res => setRes(res as StepResult))
          .catch(error => {
            console.error('Failed to load story after museum activity:', error);
          })
          .finally(() => setLoading(false));
      } else {
        ky.get('/api/story')
          .json()
          .then(res => setRes(res as StepResult))
          .catch(error => {
            console.error('Failed to load story:', error);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [session, searchParams]);


  useEffect(() => {
    if (!res) return;
    
    setTransitioning(true);
    setShowContent(false);
    
    const startNewContent = () => {
      const messageOutputs = res.outputs.filter(o => o.kind === 'message');
      const totalMessages = messageOutputs.length;
      
      setVisibleMessages(0);
      setMessagesComplete(false);
      setTransitioning(false);
      setShowContent(true);
      
      if (totalMessages <= 1) {
        setVisibleMessages(totalMessages);
        setMessagesComplete(true);
        return;
      }

      const showNextMessage = (index: number) => {
        if (index < totalMessages) {
          setVisibleMessages(index + 1);
          
          if (index + 1 < totalMessages) {
            setTimeout(() => showNextMessage(index + 1), 2500);
          } else {
            setMessagesComplete(true);
          }
        }
      };

      setTimeout(() => showNextMessage(0), 500);
    };

    setTimeout(() => startNewContent(), 800);
  }, [res]);

  const sendChoice = (label: string) => {
    if (!res) return;
    const choice = res.choices.find(c => c.label === label);
    if (choice?.to === 'museum-activity') {
      router.push('/story/activity/museum');
      return;
    }
    
    setLoading(true);
    
    setTransitioning(true);
    setShowContent(false);
    
    ky.post('/api/story', {
      json: { state: res.state, choice: label }
    })
      .json()
      .then(res => setRes(res as StepResult))
      .catch(error => {
        console.error('Failed to send choice:', error);
      })
      .finally(() => setLoading(false));
  };

  if (loading && !res) {
    return (
      <div className="relative w-full min-h-screen overflow-y-auto flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900" />
        <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-gray-800">Cargando historia...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!res) return null;

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-yellow-400 animate-pulse" />
          <div className="absolute top-32 right-16 w-12 h-12 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-green-300 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 right-12 w-8 h-8 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        <div className="absolute top-20 left-1/4 text-yellow-300 animate-pulse text-2xl">⭐</div>
        <div className="absolute top-40 right-1/3 text-yellow-200 animate-bounce text-lg" style={{ animationDelay: '0.8s' }}>✨</div>
        <div className="absolute bottom-32 left-1/3 text-yellow-400 animate-pulse text-xl" style={{ animationDelay: '1.2s' }}>🌟</div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-white text-center">Historia OWL 🦉</h1>
        </div>
      </div>

      <div className="relative flex flex-col px-4 py-6 max-w-2xl mx-auto">
        <div className="h-2" />
        
        {transitioning ? (
          <div className="flex items-center justify-center py-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-3 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-semibold text-white">Cargando...</span>
              </div>
            </div>
          </div>
        ) : showContent && (
          <div className="space-y-4 mb-6">
            {(() => {
              const filteredOutputs = res.outputs.slice();
              const hasMessages = res.outputs.some(o => o.kind === 'message');
              
              if (hasMessages) {
                const firstMessageIndex = res.outputs.findIndex(o => o.kind === 'message');
                const imagesBefore = res.outputs.slice(0, firstMessageIndex).filter(o => o.kind === 'image');
                
                imagesBefore.forEach(imgOutput => {
                  const imgIndex = filteredOutputs.findIndex(o => o === imgOutput);
                  if (imgIndex !== -1) {
                    filteredOutputs.splice(imgIndex, 1);
                  }
                });
              }
              
              return filteredOutputs;
            })().map((o, i) => {
              switch (o.kind) {
                case 'message': {
                  const allMessageOutputs = res.outputs.filter(output => output.kind === 'message');
                  const messageIndex = allMessageOutputs.findIndex(msg => msg === o);
                  const isVisible = messageIndex < visibleMessages;
                  
                  if (!isVisible) return null;
                  
                  return (
                    <div 
                      key={`message-${messageIndex}`} 
                      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20 transition-all duration-700 ease-out"
                      style={{
                        opacity: 1,
                        transform: 'translateY(0px)',
                        transitionDelay: `${messageIndex * 100}ms`
                      }}
                    >
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{o.text}</p>
                    </div>
                  );
                }
                case 'notification':
                  return messagesComplete ? (
                    <div key={i} className="bg-gradient-to-r from-yellow-400/90 to-amber-400/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20">
                      <p className="text-amber-900 font-medium whitespace-pre-wrap">🔔 {o.text}</p>
                    </div>
                  ) : null;
                case 'image':
                  return messagesComplete ? (
                    <div key={i} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-2 border border-white/20 overflow-hidden transition-all duration-500 ease-out">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`/story/assets/${o.src}.png`} 
                        alt={o.alt ?? ''} 
                        className="w-full h-auto rounded-xl" 
                      />
                    </div>
                  ) : null;
                case 'video':
                  return messagesComplete ? (
                    o.interactive ? (
                      <StoryVideo
                        key={i}
                        src={o.src}
                        autoplay={o.autoplay}
                        onComplete={() => {
                          if (res.choices && res.choices.length > 0) {
                            sendChoice(res.choices[0].label);
                          }
                        }}
                      />
                    ) : (
                      <div key={i} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-2 border border-white/20 overflow-hidden">
                        <video 
                          src={`/story/video/${o.src}.mp4`} 
                          controls 
                          autoPlay={o.autoplay} 
                          className="w-full rounded-xl" 
                        />
                      </div>
                    )
                  ) : null;
                case 'fade':
                  return messagesComplete ? (
                    <div key={i} className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <p className="text-white/80 text-sm text-center">✨ Fade {o.direction} {o.to ?? ''}</p>
                    </div>
                  ) : null;
                case 'feature':
                  return messagesComplete ? (
                    <div key={i} className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-300/30">
                      <p className="text-blue-200 text-sm text-center">⚙️ Feature: {o.name} {o.enabled ? 'ON' : 'OFF'}</p>
                    </div>
                  ) : null;
                case 'attestation':
                  return messagesComplete ? (
                    <StoryAttestation
                      key={i}
                      nodeId={o.id || res.state.currentKey}
                      onComplete={() => {
                        setTransitioning(true);
                        setShowContent(false);
                        ky.get('/api/story')
                          .json()
                          .then(res => setRes(res as StepResult))
                          .catch(error => {
                            console.error('Failed to reload story after attestation:', error);
                          });
                      }}
                    />
                  ) : null;
                default:
                  return messagesComplete ? (
                    <div key={i} className="bg-gray-500/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <pre className="text-xs text-white/90 overflow-auto">{JSON.stringify(o, null, 2)}</pre>
                    </div>
                  ) : null;
              }
            })}
          </div>
        )}

        {!res.outputs.some(o => o.kind === 'video' && o.interactive) && showContent && !transitioning && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {!messagesComplete && (
              <div className="w-full text-center mb-4">
                <div className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
                  <span>Mostrando mensajes...</span>
                </div>
              </div>
            )}
            {res.choices.map(c => (
              <button
                key={c.key}
                onClick={() => sendChoice(c.label)}
                disabled={loading || !messagesComplete || transitioning}
                className="px-8 py-4 text-lg font-bold bg-white text-gray-900 hover:bg-gray-50 border-3 border-white hover:border-gray-100 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#1f2937',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="px-2 py-1">{c.label}</span>
              </button>
            ))}
            {res.choices.length === 0 && messagesComplete && (
              <button
                disabled={loading}
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[180px]"
                onClick={() => {
                  setTransitioning(true);
                  setShowContent(false);
                  ky.get('/api/story')
                    .json()
                    .then(res => setRes(res as StepResult))
                    .catch(error => {
                      console.error('Failed to restart story:', error);
                    });
                }}
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              >
                🔄 Reiniciar Historia
              </button>
            )}
          </div>
        )}

        {res.state.userProgress && (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="text-white/80 text-xs text-center space-y-1">
              <p>Progreso: {Math.round((res.state.userProgress.completedNodes?.length || 0) / 50 * 100)}%</p>
              <p>Attestations: {res.state.userProgress.attestations?.length || 0}</p>
              {/* Hide this for production  ----> 
              {process.env.NODE_ENV === 'development' && (
                <p>Debug - Nodo: <code className="bg-white/20 px-1 rounded">{res.state.currentKey}</code></p>
              )} */}
            </div>
          </div>
        )}
        
        <div className="h-4" />
      </div>
    </div>
  );
}
