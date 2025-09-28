import { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const { status } = body;

    if (!session?.user?.walletAddress) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!status) {
      return Response.json({ error: 'Missing status' }, { status: 400 });
    }

    // Call the external API
    const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/users/create-attestation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: session.user.walletAddress,
        status
      })
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });

  } catch (error) {
    console.error('Create attestation API error:', error);
    return Response.json({ 
      error: 'Failed to create attestation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
