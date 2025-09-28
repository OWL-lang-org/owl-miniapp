import { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const { nodeId, verificationResult } = body;

    if (!session?.user?.walletAddress) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!nodeId || !verificationResult) {
      return Response.json({ error: 'Missing nodeId or verification result' }, { status: 400 });
    }

    await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/users/attestation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: session.user.walletAddress,
        nodeId,
        verificationResult,
        timestamp: new Date().toISOString()
      })
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Attestation save error:', error);
    return Response.json({ error: 'Failed to save attestation' }, { status: 500 });
  }
}
