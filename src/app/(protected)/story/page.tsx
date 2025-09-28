'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
  const [res, setRes] = useState<StepResult | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (session?.user?.walletAddress) {
      setLoading(true);
      ky.get('/api/story')
        .json()
        .then(res => setRes(res as StepResult))
        .catch(error => {
          console.error('Failed to load story:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  const sendChoice = (label: string) => {
    if (!res) return;
    setLoading(true);
    
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
        
        <div className="space-y-4 mb-6">
          {res.outputs.map((o, i) => {
            switch (o.kind) {
              case 'message':
                return (
                  <div key={i} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{o.text}</p>
                  </div>
                );
              case 'notification':
                return (
                  <div key={i} className="bg-gradient-to-r from-yellow-400/90 to-amber-400/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20">
                    <p className="text-amber-900 font-medium whitespace-pre-wrap">🔔 {o.text}</p>
                  </div>
                );
              case 'image':
                return (
                  <div key={i} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-2 border border-white/20 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`/story/assets/${o.src}.png`} 
                      alt={o.alt ?? ''} 
                      className="w-full h-auto rounded-xl" 
                    />
                  </div>
                );
              case 'video':
                return o.interactive ? (
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
                );
              case 'fade':
                return (
                  <div key={i} className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <p className="text-white/80 text-sm text-center">✨ Fade {o.direction} {o.to ?? ''}</p>
                  </div>
                );
              case 'feature':
                return (
                  <div key={i} className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-300/30">
                    <p className="text-blue-200 text-sm text-center">⚙️ Feature: {o.name} {o.enabled ? 'ON' : 'OFF'}</p>
                  </div>
                );
              case 'attestation':
                return (
                  <StoryAttestation
                    key={i}
                    nodeId={o.id || res.state.currentKey}
                    onComplete={() => {
                      ky.get('/api/story')
                        .json()
                        .then(res => setRes(res as StepResult))
                        .catch(error => {
                          console.error('Failed to reload story after attestation:', error);
                        });
                    }}
                  />
                );
              default:
                return (
                  <div key={i} className="bg-gray-500/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <pre className="text-xs text-white/90 overflow-auto">{JSON.stringify(o, null, 2)}</pre>
                  </div>
                );
            }
          })}
        </div>

        {!res.outputs.some(o => o.kind === 'video' && o.interactive) && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {res.choices.map(c => (
              <button
                key={c.key}
                onClick={() => sendChoice(c.label)}
                disabled={loading}
                className="px-8 py-4 text-lg font-bold bg-white text-gray-900 hover:bg-gray-50 border-3 border-white hover:border-gray-100 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#1f2937',
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              >
                {c.label}
              </button>
            ))}
            {res.choices.length === 0 && (
              <button
                disabled={loading}
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[180px]"
                onClick={() => {
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
