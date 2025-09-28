import {
  ISuccessResult,
  IVerifyResponse,
  verifyCloudProof,
} from '@worldcoin/minikit-js';
import { NextRequest, NextResponse } from 'next/server';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

/**
 * This route is used to verify the proof of the user
 * It is critical proofs are verified from the server side
 * Read More: https://docs.world.org/mini-apps/commands/verify#verifying-the-proof
 */
export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as IRequestPayload;
  const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;

  const verifyRes = (await verifyCloudProof(
    payload,
    app_id,
    action,
    signal,
  )) as IVerifyResponse;

  if (verifyRes.success) {
    return NextResponse.json({ verifyRes, status: 200 });
  } else {
    return NextResponse.json({ verifyRes, status: 400 });
  }
}
