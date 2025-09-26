export type BlockType = 'CONTENT' | 'DESC';

export interface Block {
  type: BlockType;
  data: string;
}

export interface Topic {
  key: string;
  parentKey: string | null;
  subKeys: string[];
  collapse: boolean;
  style: any | null;
  blocks: Block[];
}

export interface StoryGraph {
  rootTopicKey: string;
  topics: Topic[];
  extData?: {
    TOPIC_REFERENCE?: {
      reference?: Record<string, { keyList: string[]; dataMap: Record<string, any> }>;
    };
  };
}

export type Output =
  | { kind: 'message'; text: string }
  | { kind: 'image'; src: string; alt?: string }
  | { kind: 'video'; src: string; autoplay?: boolean }
  | { kind: 'fade'; to?: string; direction?: 'in' | 'out' }
  | { kind: 'notification'; text: string }
  | { kind: 'feature'; name: 'maps' | 'notes' | 'menu'; enabled: boolean }
  | { kind: 'attestation'; id?: string }
  | { kind: 'unknown'; raw: string };

export interface Choice {
  label: string;
  to: string;
  key: string;
}

export interface StoryState {
  currentKey: string;
  stack: string[];
}

export interface StepResult {
  state: StoryState;
  outputs: Output[];
  choices: Choice[];
}

const ZW = /[\u200B-\u200D\uFEFF]/g;
const normalize = (s: string) =>
  s.replace(ZW, '').replace(/\r/g, '').trim();

const isChoiceText = (s: string) =>
  /If\s+player\s+(?:taps|chooses|selects)/i.test(normalize(s));

const matchBetweenAsterisks = (s: string) => {
  const m = normalize(s).match(/\*([^*]+)\*/);
  return m?.[1]?.trim();
};

const extractImage = (s: string): string | undefined => {
  const n = normalize(s);
  const m = n.match(/\bshow\s+image\s+\/?\s*([^\s].*)$/i);
  if (m) return m[1].trim();
  return undefined;
};

const extractVideo = (s: string): string | undefined => {
  const n = normalize(s);
  const m = n.match(/\b(?:show|play)\s+\/?\s*([A-Za-z0-9._/\-]+(?:StoryVid(?:eo)?\s*\d*)?)\b/i);
  if (m) return m[1].replace(/\s+/g, '');
  return undefined;
};

const extractMessage = (s: string): string | undefined => {
  const n = normalize(s);
  const m = n.match(/\bshow\s+message\s*:?\s*([\s\S]+)/i);
  if (m) return m[1].trim();
  return undefined;
};

const extractFade = (s: string): { to?: string; direction?: 'in' | 'out' } | undefined => {
  const n = normalize(s);
  // "Fade in to /MapDungeon", "Fade out (if possible) into /MapTerritory"
  const m = n.match(/\bfade\s+(in|out)[^\S\r\n]*(?:to|into)?[^\S\r\n]*\/?([A-Za-z0-9._/\-]+)?/i);
  if (m) return { direction: m[1].toLowerCase() as 'in' | 'out', to: m[2]?.trim() };
  return undefined;
};

const extractNotification = (s: string): string | undefined => {
  const n = normalize(s);
  const m = n.match(/\bsend\s+a\s+notification[\s\S]*?:\s*([\s\S]+)/i);
  if (m) return m[1].trim();
  return undefined;
};

const extractFeature = (s: string): Output | undefined => {
  const n = normalize(s);
  if (/show\s+only\s+\*?maps feature\*?/i.test(n)) return { kind: 'feature', name: 'maps', enabled: true };
  if (/enable\s+notes/i.test(n) || /notes on the bottom/i.test(n)) return { kind: 'feature', name: 'notes', enabled: true };
  if (/player\s+chooses\s+taps\s+\*menu\*/i.test(n) || /chooses\s+\*menu\*/i.test(n))
    return { kind: 'feature', name: 'menu', enabled: true };
  return undefined;
};

function parseOutputsFromTopic(topic: Topic): Output[] {
  const outs: Output[] = [];
  for (const b of topic.blocks ?? []) {
    const text = normalize(b.data ?? '');
    if (!text) continue;

    const msg = extractMessage(text);
    if (msg) {
      outs.push({ kind: 'message', text: msg });
      continue;
    }
    const notif = extractNotification(text);
    if (notif) {
      outs.push({ kind: 'notification', text: notif });
      continue;
    }
    const img = extractImage(text);
    if (img) {
      outs.push({ kind: 'image', src: img, alt: img.split('/').pop() });
      continue;
    }
    const vid = extractVideo(text);
    if (vid) {
      outs.push({ kind: 'video', src: vid, autoplay: true });
      continue;
    }
    const fade = extractFade(text);
    if (fade) {
      outs.push({ kind: 'fade', ...fade });
      continue;
    }
    const feat = extractFeature(text);
    if (feat) {
      outs.push(feat);
      continue;
    }
    if (/attestation/i.test(text)) {
      outs.push({ kind: 'attestation' });
      continue;
    }
    // si no encaja nada, deja el texto como mensaje genérico o unknown
    if (!isChoiceText(text)) {
      outs.push({ kind: 'message', text }); // preferible mostrarlo
    } else {
      // es texto de choice, no lo emitimos como salida
    }
  }
  return outs;
}

function extractChoiceLabelFromTopic(topic: Topic): string | null {
  for (const b of topic.blocks ?? []) {
    const txt = normalize(b.data ?? '');
    if (!isChoiceText(txt)) continue;
    const between = matchBetweenAsterisks(txt);
    if (between) return between;
    // fallback: intenta leer algo razonable del bloque
    const m = txt.match(/If\s+player\s+(?:taps|chooses|selects)\s*([^,:\n]+)/i);
    if (m) return m[1].replace(/[\(\)]/g, '').trim();
  }
  return null;
}

export class StoryEngine {
  private graph: StoryGraph;
  private byKey: Map<string, Topic>;
  private children: Map<string, string[]>;
  private refs: Map<string, string[]>;

  constructor(graph: StoryGraph) {
    this.graph = graph;
    this.byKey = new Map(graph.topics.map(t => [t.key, t]));
    this.children = new Map();
    for (const t of graph.topics) {
      this.children.set(t.key, t.subKeys ?? []);
    }
    const refObj = graph.extData?.TOPIC_REFERENCE?.reference ?? {};
    this.refs = new Map(
      Object.entries(refObj).map(([k, v]) => [k, v?.keyList ?? []])
    );
  }

  /** Estado inicial listo para ser mostrado (con auto‑avance). */
  init(): StepResult {
    const initState: StoryState = { currentKey: this.graph.rootTopicKey, stack: [] };
    return this.materialize(initState);
  }

  /** Avanza una elección por label (o salto directo por key). */
  step(state: StoryState, input?: { choiceLabel?: string; toKey?: string }): StepResult {
    const current = this.topic(state.currentKey);
    if (!current) return this.materialize({ currentKey: this.graph.rootTopicKey, stack: [] });

    // salto directo por key
    if (input?.toKey && this.byKey.has(input.toKey)) {
      const nextState: StoryState = { currentKey: input.toKey, stack: [...state.stack, state.currentKey] };
      return this.materialize(nextState);
    }

    // resolvemos label → hijo
    const options = this.choicesFrom(current);
    const target = input?.choiceLabel
      ? options.find(c => c.label.toLowerCase() === input.choiceLabel!.toLowerCase())
      : undefined;

    if (target) {
      const nextState: StoryState = { currentKey: target.to, stack: [...state.stack, state.currentKey] };
      return this.materialize(nextState);
    }

    // si no coincide nada, no cambiamos de estado; devolvemos lo actual
    return this.materialize(state);
  }

  // =========== privados ===========

  private topic(key: string | null | undefined): Topic | undefined {
    if (!key) return undefined;
    return this.byKey.get(key);
  }

  private isChoiceNode(topic: Topic): boolean {
    return (topic.blocks ?? []).some(b => isChoiceText(b.data ?? ''));
  }

  private nextViaReference(key: string): string | undefined {
    const list = this.refs.get(key);
    return list?.[0];
  }

  /** Construye las opciones desde los hijos inmediatos (basado en texto "If player taps *X*"). */
  private choicesFrom(topic: Topic): Choice[] {
    const choices: Choice[] = [];
    const subs = this.children.get(topic.key) ?? [];
    for (const childKey of subs) {
      const child = this.topic(childKey);
      if (!child) continue;
      const label = extractChoiceLabelFromTopic(child) ?? this.fallbackLabel(child);
      // destino: si el hijo se auto‑avanza por referencia única, usamos esa key de destino
      const dest = this.nextViaReference(child.key) ?? child.key;
      choices.push({ label, to: dest, key: child.key });
    }
    return choices;
  }

  private fallbackLabel(t: Topic): string {
    const raw = normalize(t.blocks?.[0]?.data ?? '');
    if (!raw) return `option-${t.key.slice(0, 6)}`;
    // intenta extraer un token útil
    const m = raw.match(/\/([A-Za-z0-9._\-]+)$/);
    return m?.[1] ?? raw.slice(0, 40);
  }

  /** Sigue referencias y ramas lineales acumulando outputs hasta el próximo nodo con choices. */
  private materialize(state: StoryState): StepResult {
    const outputs: Output[] = [];
    let cursor = this.topic(state.currentKey);

    // acumula outputs del nodo actual
    if (cursor) outputs.push(...parseOutputsFromTopic(cursor));

    const visited = new Set<string>([state.currentKey]);

    // 1) seguir referencias (TOPIC_REFERENCE)
    while (cursor) {
      const viaRef = this.nextViaReference(cursor.key);
      if (viaRef && !visited.has(viaRef)) {
        cursor = this.topic(viaRef);
        if (!cursor) break;
        visited.add(cursor.key);
        outputs.push(...parseOutputsFromTopic(cursor));
        // si llegamos a un nodo con choices, paramos
        if (this.isChoiceNode(cursor)) break;
        // si este nodo ya expone múltiples hijos con texto de choice, paramos
        const couldChoose = this.choicesFrom(cursor);
        if (couldChoose.length > 0 && this.isChoiceNodeOfAnyChild(cursor)) break;
        // si no, continúa
        continue;
      }
      break;
    }

    // 2) auto‑avance por secuencia lineal (un hijo y no es nodo de "choice")
    let advanced = true;
    while (cursor && advanced) {
      advanced = false;
      const subs = this.children.get(cursor.key) ?? [];
      if (subs.length === 1) {
        const next = this.topic(subs[0]);
        if (next && !this.isChoiceNode(next)) {
          outputs.push(...parseOutputsFromTopic(next));
          cursor = next;
          visited.add(cursor.key);
          advanced = true;
        }
      }
    }

    // Nodo final de parada para escoger
    const finalTopic = cursor ?? this.topic(state.currentKey)!;
    const choices = this.choicesFrom(finalTopic);

    // fijamos el currentKey en la última posición alcanzada
    const newState: StoryState = { currentKey: finalTopic.key, stack: state.stack };

    return { state: newState, outputs, choices };
  }

  private isChoiceNodeOfAnyChild(topic: Topic): boolean {
    const subs = this.children.get(topic.key) ?? [];
    return subs.some(k => {
      const t = this.topic(k);
      return !!t && this.isChoiceNode(t);
    });
  }
}
