import { NextRequest } from 'next/server';
import { StoryEngine, StoryGraph, StoryState } from '../../../../lib/story/engine';
import story from '../../../../data/story.json' assert { type: 'json' };

const engine = new StoryEngine(story as StoryGraph);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const state: StoryState | undefined = body?.state;
  const choice: string | undefined = body?.choice;
  const toKey: string | undefined = body?.toKey;

  const result = state
    ? engine.step(state, { choiceLabel: choice, toKey })
    : engine.init();

  return Response.json(result, { status: 200 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentKey = searchParams.get('currentKey');
  
  let result;
  if (currentKey) {
    const state: StoryState = { currentKey, stack: [] };
    result = engine.step(state);
  } else {
    result = engine.init();
  }
  
  return Response.json(result, { status: 200 });
}
