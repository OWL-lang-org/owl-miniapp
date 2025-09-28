'use client';

import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useState, useRef, useEffect } from 'react';

interface StoryVideoProps {
  src: string;
  autoplay?: boolean;
  onComplete: () => void;
  showManualButton?: boolean;
}

export const StoryVideo = ({ src, autoplay = true, onComplete, showManualButton = true }: StoryVideoProps) => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setVideoEnded(true);
      setVideoWatched(true);
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    };

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        const percentWatched = (video.currentTime / video.duration) * 100;
        if (percentWatched >= 90) {
          setVideoWatched(true);
        }
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onComplete]);

  const handleManualContinue = () => {
    setIsLoading(true);
    onComplete();
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🦉</span>
          <h3 className="text-lg font-bold text-gray-800">Historia OWL - Introducción</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {videoEnded ? '¡Video completado! Continuando...' : 'Mira el video de introducción para comenzar tu aventura'}
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-black">
        <video 
          ref={videoRef}
          src={`/story/video/${src}.mp4`} 
          controls 
          autoPlay={autoplay}
          className="w-full h-auto"
          playsInline
          preload="auto"
        />
        
        {videoEnded && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center text-white bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <span className="text-3xl text-white">✓</span>
              </div>
              <p className="text-xl font-bold mb-2">¡Video completado!</p>
              <p className="text-sm opacity-90">Continuando automáticamente en 2 segundos...</p>
              <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showManualButton && !videoEnded && (
        <div className="mt-4 text-center">
          <Button
            onClick={handleManualContinue}
            disabled={!videoWatched || isLoading}
            size="lg"
            variant={videoWatched ? "primary" : "secondary"}
            className={videoWatched 
              ? "w-full py-4 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              : "w-full py-4 text-base font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Continuando...
              </>
            ) : videoWatched ? (
              <>🚀 ¡Continuar a la Historia!</>
            ) : (
              <>⏱️ Mira el video para continuar</>
            )}
          </Button>
          
          {!videoWatched && (
            <p className="text-xs text-gray-500 mt-3 bg-yellow-50 rounded-lg p-2 border border-yellow-200">
              💡 Necesitas ver al menos el 90% del video para continuar
            </p>
          )}
        </div>
      )}
    </div>
  );
};
