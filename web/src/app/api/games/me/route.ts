import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('mock-session');

    // Forward the request to the API server
    const response = await fetch('http://localhost:8000/api/games/me', {
      headers: {
        'Cookie': `mock-session=${sessionCookie?.value}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
