'use client';

import { Page } from '@/components/PageLayout';

export default function OathPage() {
  return (
    <>
      <Page.Header>
        <h1 className="text-xl font-semibold">Estadísticas 📊</h1>
      </Page.Header>
      
      <Page.Main className="flex flex-col gap-6 p-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
        </div>
      </Page.Main>
    </>
  );
}
