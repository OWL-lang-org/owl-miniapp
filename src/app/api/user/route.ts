import { NextRequest } from "next/server";
import ky from 'ky';

//Register a new address
export async function POST(req: NextRequest) {
  console.log('API_URL', process.env.API_URL);
  const body = await req.json().catch(() => ({}));
  const address: string = body.address;
  const response = await ky.post(`${process.env.API_URL}/users`, {
    json: {
      address,
    },
  });
  const data = await response.json();
  return Response.json(data, { status: 200 });
}

//Get user status by address
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address: string | null = searchParams.get('address');
  if (!address) {
    return Response.json({ error: 'Address is required' }, { status: 400 });
  }
  const response = await ky.get(`${process.env.API_URL}/users/${address}`);
  const data = await response.json();
  return Response.json(data, { status: 200 });
}