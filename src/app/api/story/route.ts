import { NextRequest } from 'next/server';
import { SimplifiedStoryEngine } from '../../../../lib/story/simplified-engine';
import { auth } from '@/auth';
import ky from 'ky';
import { IUser } from '../../../../types/user';

interface UserData {
  storyProgress?: {
    attestations: string[];
    choices: Record<string, number>;
    completedNodes: string[];
  };
  status?: string;
}

const engine = new SimplifiedStoryEngine();

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const currentKey = searchParams.get('currentKey');
    
    let userProgress: { attestations: string[], choices: Record<string, number>, completedNodes: string[] } = { 
      attestations: [], 
      choices: {}, 
      completedNodes: [] 
    };
    let userStatus: string | null = null;
    
    if (session?.user?.walletAddress) {
      try {
        const userData = await ky.get(`${process.env.API_URL || 'http://localhost:3001'}/api/users/${session.user.walletAddress}`).json() as UserData;
        userProgress = userData.storyProgress || userProgress;
        userStatus = userData.status || null;
      } catch (error) {
        console.warn('Failed to load user progress:', error);
        throw error;
      }
    }
    
    let result;
    if (currentKey) {
      result = engine.loadState(currentKey, userProgress);
    } else if (userStatus) {
      result = engine.loadState(userStatus, userProgress);
    } else {
      result = engine.init();
      result.state.userProgress = userProgress;
    }
    
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Story GET error:', error);
    return Response.json(
      { error: 'Failed to get story state' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const state = body?.state;
    const choice: string | undefined = body?.choice;

    if (!state || !choice) {
      return Response.json(
        { error: 'Missing state or choice in request' },
        { status: 400 }
      );
    }

    const result = engine.step(state, choice);
    
    if (session?.user?.walletAddress) {
      try {
        let userExists = false;
        try {
          await ky.get(`${process.env.API_URL || 'http://localhost:3001'}/api/users/${session.user.walletAddress}`);
          userExists = true;
        } catch (error) {
          userExists = false;
          console.warn('User does not exist:', error);
        }

        if (!userExists) {
          await ky.post(`${process.env.API_URL || 'http://localhost:3001'}/api/users`, {
            json: {
              address: session.user.walletAddress
            }
          });
        }

        await ky.patch(`${process.env.API_URL || 'http://localhost:3001'}/api/users`, {
          json: {
            address: session.user.walletAddress,
            status: result.state.currentKey
          }
        });
      } catch (error) {
        console.warn('Failed to save user progress:', error);
        throw error;
      }
    }
    
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Story POST error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: `Failed to process story step: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const state = body?.state;
    
    if (!state) {
      return Response.json(
        { error: 'Missing state in request' },
        { status: 400 }
      );
    }

    const currentNode = engine.getCurrentNode(state);
    const progress = engine.getProgressPercentage(state);
    const attestations = engine.getAttestationCount(state);
    
    return Response.json({
      currentNode: currentNode?.title || 'Unknown',
      nodeId: state.currentKey,
      progress,
      attestations,
      completedNodes: engine.getCompletedNodes(state).length,
      userProgress: state.userProgress
    }, { status: 200 });
  } catch (error) {
    console.error('Story progress error:', error);
    return Response.json(
      { error: 'Failed to get story progress' },
      { status: 500 }
    );
  }
}
