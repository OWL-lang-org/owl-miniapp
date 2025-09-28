'use client';

import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useState, useEffect } from 'react';

interface StoryAttestationProps {
  nodeId: string;
  onComplete: () => void;
}

export const StoryAttestation = ({ nodeId, onComplete }: StoryAttestationProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attestationGenerated, setAttestationGenerated] = useState(false);

  useEffect(() => {
    const generateAttestation = async () => {
      try {
        await fetch('/api/story/attestation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nodeId,
            timestamp: new Date().toISOString()
          })
        });
        
        setAttestationGenerated(true);
      } catch (error) {
        console.error('Attestation generation error:', error);
        setError('Error al generar la atestación');
      } finally {
        setIsGenerating(false);
      }
    };

    generateAttestation();
  }, [nodeId]);

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="bg-gradient-to-r from-emerald-400/90 to-green-400/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600 rounded-full flex items-center justify-center">
          {isGenerating ? (
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          ) : attestationGenerated ? (
            <span className="text-2xl">✓</span>
          ) : (
            <span className="text-2xl">⚠️</span>
          )}
        </div>
        
        <h3 className="text-emerald-900 font-bold text-lg mb-2">
          {isGenerating ? 'Generando Atestación...' : attestationGenerated ? 'Atestación Generada' : 'Error'}
        </h3>
        
        <p className="text-emerald-800 text-sm mb-6">
          {isGenerating 
            ? 'Registrando tu progreso en la historia...'
            : attestationGenerated 
            ? 'Se ha registrado exitosamente tu progreso en este punto de la historia. ¡Puedes continuar!'
            : 'Ha ocurrido un error al generar la atestación.'
          }
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={isGenerating}
          size="lg"
          variant="primary"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
        >
          {isGenerating ? 'Generando...' : '🌟 Continuar Historia'}
        </Button>
        
        <p className="text-emerald-700 text-xs mt-3">
          Tu progreso ha sido registrado de forma segura en blockchain.
        </p>
      </div>
    </div>
  );
};
