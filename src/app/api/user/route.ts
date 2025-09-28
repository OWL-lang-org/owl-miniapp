import { NextRequest } from "next/server";
import ky from 'ky';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { address } = body;

    if (!address) {
      return Response.json({ error: 'Address is required' }, { status: 400 });
    }

    const response = await ky.post(`${process.env.API_URL}/api/users`, {
      json: {
        address
      },
    });

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Progress save error:', error);
    return Response.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { address, status } = body;

    if (!address) {
      return Response.json({ error: 'Address is required' }, { status: 400 });
    }

    const response = await ky.patch(`${process.env.API_URL}/api/users`, {
      json: {
        address,
        status
      },
    });
    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Status update error:', error);
    return Response.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address: string | null = searchParams.get('address');
  try {
    
    if (!address) {
      return Response.json({ error: 'Address is required' }, { status: 400 });
    }

    const response = await ky.get(`${process.env.API_URL}/api/users/${address}`);
    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('Progress fetch error:', error);
    if (error instanceof Error && error.message.includes('404')) {
      return Response.json({ 
        address: address,
        status: null,
        tokenId: null,
        hash: null,
        createdAt: null,
        updatedAt: null,
        attestations: [],
        storyProgress: { attestations: [], choices: {}, completedNodes: [] },
        currentNode: null
      }, { status: 200 });
    }
    return Response.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
