import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // TODO: Integrate with BetterAuth
    // await auth.api.signOut();

    return NextResponse.json(
      { message: 'সফলভাবে সাইন আউট হয়েছে' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'সাইন আউট ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}