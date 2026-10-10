import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // TODO: Integrate with BetterAuth
    // const user = await auth.api.signUpEmail({
    //   body: { name, email, password },
    // });

    return NextResponse.json(
      { message: 'Sign up endpoint - integrate with BetterAuth' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'সাইন আপ ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}