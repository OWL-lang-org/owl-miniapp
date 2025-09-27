'use client';

import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const WelcomeMessage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSwear = () => {
    setIsLoading(true);
    router.push('/oath');
  };

  const handleNoThanks = () => {
    setIsLoading(true);
    router.push('/story');
  };

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
      
      <div className="relative flex flex-col items-center justify-center text-center px-3 py-12 min-h-screen">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20 my-8">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🦉</span>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ¡Bienvenido a OWL!
            </h1>
            
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed text-sm">
                En OWL te queremos dar una forma adicional de <strong className="text-indigo-600">motivarte</strong> para que termines lo que te propongas. 
                <strong className="text-purple-600"> Creemos en ti.</strong>
              </p>
              
              <p className="leading-relaxed text-sm">
                Al darle al botón <strong className="text-blue-600">"¡Juro!"</strong>, puedes escoger hacer un juramento de que vas a terminar este curso de inglés; 
                decidirás qué monto quieres que retengamos provisionalmente, y cuando termines el curso <strong className="text-green-600">te lo devolvemos</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleSwear}
              disabled={isLoading}
              size="lg"
              variant="primary"
              className="w-full py-4 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              ¡Juro! 🤝✨
            </Button>
            
            <Button
              onClick={handleNoThanks}
              disabled={isLoading}
              size="lg"
              variant="secondary"
              className="w-full py-4 text-base font-semibold bg-white/90 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-200"
            >
              No, gracias 🎮
            </Button>
          </div>
        </div>
        
        <div className="mt-6 mb-8">
          <p className="text-sm text-white/90 max-w-xs font-medium bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            💪 Tu compromiso es tu poder
          </p>
        </div>
      </div>
    </div>
  );
};
