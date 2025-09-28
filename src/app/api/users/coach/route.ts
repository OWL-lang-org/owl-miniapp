import { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const { userPrompt } = body;

    if (!session?.user?.walletAddress) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!userPrompt) {
      return Response.json({ error: 'Missing userPrompt' }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/users/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: session.user.walletAddress,
        userPrompt
      })
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });

  } catch (error) {
    console.error('Coach API error:', error);
    return Response.json({ 
      error: 'Failed to process coach request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
