'use client';

import { Page } from '@/components/PageLayout';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OathPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'individual' | 'group' | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const amounts = [10, 25, 50, 100, 250, 500];

  const handleConfirmOath = async () => {
    if (!selectedType || !selectedAmount || !session?.user?.walletAddress) {
      return;
    }

    setIsLoading(true);
    
    try {
      //TODO include here the oath creation
      //contract interaction

      // await fetch('/api/user', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     address: session.user.walletAddress,
      //     oathType: selectedType,
      //     collateralAmount: selectedAmount,
      //   }),
      // });

      router.push('/story');
    } catch (error) {
      console.error('Error creating oath:', error);
    } finally {
      setIsLoading(false);
    }
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
      
      <div className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-white text-center">Tu Juramento 🤝</h1>
        </div>
      </div>
      
      <div className="relative flex flex-col px-4 py-6">
        <div className="h-2" />
        
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tipo de Compromiso
            </span>
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setSelectedType('individual')}
              className={`p-5 rounded-2xl border-3 transition-all transform hover:scale-[1.02] relative ${
                selectedType === 'individual'
                  ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 shadow-2xl ring-4 ring-blue-400/50'
                  : 'border-white/40 bg-white/60 hover:border-blue-300 hover:bg-white/80 text-gray-700'
              }`}
            >
              {selectedType === 'individual' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              <div className="text-left">
                <h3 className={`font-bold text-lg ${selectedType === 'individual' ? 'text-blue-800' : 'text-gray-800'}`}>
                  🎯 Individual
                </h3>
                <p className={`text-sm mt-2 ${selectedType === 'individual' ? 'text-blue-700' : 'text-gray-600'}`}>
                  Compromiso personal. Tu progreso depende solo de ti.
                </p>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedType('group')}
              className={`p-5 rounded-2xl border-3 transition-all transform hover:scale-[1.02] relative ${
                selectedType === 'group'
                  ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 shadow-2xl ring-4 ring-purple-400/50'
                  : 'border-white/40 bg-white/60 hover:border-purple-300 hover:bg-white/80 text-gray-700'
              }`}
            >
              {selectedType === 'group' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              <div className="text-left">
                <h3 className={`font-bold text-lg ${selectedType === 'group' ? 'text-purple-800' : 'text-gray-800'}`}>
                  👥 Grupal
                </h3>
                <p className={`text-sm mt-2 ${selectedType === 'group' ? 'text-purple-700' : 'text-gray-600'}`}>
                  Únete a otros estudiantes. Motívanse mutuamente.
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Monto del Colateral
            </span>
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Este monto se retiene hasta que completes el curso. ¡Luego te lo devolvemos!
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`p-4 rounded-xl border-3 font-bold transition-all transform hover:scale-105 relative ${
                  selectedAmount === amount
                    ? 'border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 shadow-2xl ring-4 ring-green-400/50'
                    : 'border-white/40 bg-white/60 hover:border-green-300 hover:bg-white/80 text-gray-700 hover:text-green-700'
                }`}
              >
                {selectedAmount === amount && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
                <span className={selectedAmount === amount ? 'text-green-800' : ''}>
                  ${amount} USD
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <Button
            onClick={handleConfirmOath}
            disabled={!selectedType || !selectedAmount || isLoading}
            size="lg"
            variant="primary"
            className="w-full py-4 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {isLoading ? 'Creando juramento...' : 'Confirmar Juramento 🌟✨'}
          </Button>
          
          <Button
            onClick={() => router.back()}
            disabled={isLoading}
            size="lg"
            variant="secondary"
            className="w-full py-4 text-base font-semibold bg-black/20 hover:bg-black/30 border-2 border-white/30 hover:border-white/50 text-white transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
          >
            Volver 🔙
          </Button>
        </div>

        <div className="bg-gradient-to-r from-amber-400/90 to-orange-400/90 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-sm shadow-2xl mb-4">
          <p className="text-amber-900 font-medium text-center leading-relaxed">
            💡 <strong>Recuerda:</strong> Tu colateral es una inversión en tu futuro. 
            Cuando completes el curso, recibirás tu dinero de vuelta junto con la satisfacción del logro cumplido. 
            <span className="font-bold text-amber-800">Y además ganarás lo de los que no completen el curso.</span>
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <p className="text-sm text-white/90 max-w-xs font-medium bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-center">
            💪 Tu compromiso es tu fuerza
          </p>
        </div>
        
        <div className="h-4" />
      </div>
    </div>
  );
}
