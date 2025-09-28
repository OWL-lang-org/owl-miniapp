'use client';

import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';

interface StoryAttestationProps {
  nodeId: string;
  onComplete: () => void;
}

export const StoryAttestation = ({ nodeId, onComplete }: StoryAttestationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    setError(null);

    try {
      const result = await MiniKit.commandsAsync.verify({
        action: `complete-story-node-${nodeId}`,
        signal: nodeId,
      });

      if (result.finalPayload.status === 'success') {
        const verifyResponse = await fetch('/api/verify-proof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: result.finalPayload,
            action: `complete-story-node-${nodeId}`,
            signal: nodeId,
          }),
        });

        if (verifyResponse.ok) {
          await fetch('/api/story/attestation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nodeId,
              verificationResult: result.finalPayload
            })
          });
          
          onComplete();
        } else {
          setError('Verificación fallida en el servidor');
        }
      } else {
        setError('Verificación cancelada o fallida');
      }
    } catch (error) {
      console.error('Attestation error:', error);
      setError('Error durante la verificación');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-400/90 to-green-400/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚑</span>
        </div>
        
        <h3 className="text-emerald-900 font-bold text-lg mb-2">
          Attestation Requerida
        </h3>
        
        <p className="text-emerald-800 text-sm mb-6">
          Completa tu verificación WorldCoin para continuar con la historia y desbloquear el siguiente capítulo.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleVerify}
          disabled={isVerifying}
          size="lg"
          variant="primary"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
        >
          {isVerifying ? 'Verificando...' : '🌟 Completar Verificación'}
        </Button>
        
        <p className="text-emerald-700 text-xs mt-3">
          Esta verificación confirma tu progreso y desbloquea contenido exclusivo.
        </p>
      </div>
    </div>
  );
};
