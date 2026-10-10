import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // TODO: Integrate with BetterAuth
    // const user = await auth.api.updateUser({
    //   body: { name },
    // });

    return NextResponse.json(
      { message: 'Profile update endpoint - integrate with BetterAuth' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'প্রোফাইল আপডেট ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}