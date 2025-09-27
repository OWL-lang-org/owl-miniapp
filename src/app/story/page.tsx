'use client';

import { useEffect, useState } from 'react';

type Output =
  | { kind: 'message'; text: string }
  | { kind: 'image'; src: string; alt?: string }
  | { kind: 'video'; src: string; autoplay?: boolean }
  | { kind: 'fade'; to?: string; direction?: 'in' | 'out' }
  | { kind: 'notification'; text: string }
  | { kind: 'feature'; name: 'maps' | 'notes' | 'menu'; enabled: boolean }
  | { kind: 'attestation'; id?: string }
  | { kind: 'unknown'; raw: string };

type Choice = { label: string; to: string; key: string };
type StoryState = { currentKey: string; stack: string[] };
type StepResult = { state: StoryState; outputs: Output[]; choices: Choice[] };

export default function StoryPage() {
  const [res, setRes] = useState<StepResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/story')
      .then(r => r.json())
      .then(setRes)
      .finally(() => setLoading(false));
  }, []);

  const sendChoice = (label: string) => {
    if (!res) return;
    setLoading(true);
    fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: res.state, choice: label }),
    })
      .then(r => r.json())
      .then(setRes)
      .finally(() => setLoading(false));
  };

  if (loading && !res) return <div className="p-6">Cargando…</div>;
  if (!res) return null;

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Historia</h1>
      <section className="space-y-4">
        {res.outputs.map((o, i) => {
          switch (o.kind) {
            case 'message':
              return <p key={i} className="rounded-md  p-3 whitespace-pre-wrap">{o.text}</p>;
            case 'notification':
              return <p key={i} className="rounded-md bg-yellow-100 p-3 whitespace-pre-wrap">🔔 {o.text}</p>;
            case 'image':
              return (
                <figure key={i} className="rounded-lg overflow-hidden border">
                  <img src={`/story/assets/${o.src}.png`} alt={o.alt ?? ''} className="w-full h-auto" />
                </figure>
              );
            case 'video':
              return (
                <video key={i} src={`/story/video/${o.src}.mp4`} controls autoPlay={o.autoplay} className="w-full rounded-lg border" />
              );
            case 'fade':
              return <div key={i} className="text-sm text-neutral-500">Fade {o.direction} {o.to ?? ''}</div>;
            case 'feature':
              return <div key={i} className="text-sm text-blue-600">Feature: {o.name} {o.enabled ? 'ON' : 'OFF'}</div>;
            case 'attestation':
              return <div key={i} className="text-sm text-emerald-700">⚑ Attestation requerida</div>;
            default:
              return <pre key={i} className="text-xs bg-neutral-50 p-2 overflow-auto">{JSON.stringify(o, null, 2)}</pre>;
          }
        })}
      </section>

      <section className="flex flex-wrap gap-2">
        {res.choices.map(c => (
          <button
            key={c.key}
            onClick={() => sendChoice(c.label)}
            className="px-3 py-2 rounded-md border hover:bg-neutral-50"
          >
            {c.label}
          </button>
        ))}
        {res.choices.length === 0 && (
          <button
            className="px-3 py-2 rounded-md bg-black text-white"
            onClick={() => {
              // fallback: reiniciar
              fetch('/api/story')
                .then(r => r.json())
                .then(setRes);
            }}
          >
            Reiniciar
          </button>
        )}
      </section>

      <footer className="text-xs text-neutral-500">
        Nodo actual: <code>{res.state.currentKey}</code>
      </footer>
    </main>
  );
}
