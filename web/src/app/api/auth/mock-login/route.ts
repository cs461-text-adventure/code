import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check test credentials
    if (email === 'test@example.com' && password === 'password123') {
      // Create response with session cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('mock-session', 'test-user', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Mock login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
