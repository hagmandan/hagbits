import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { computeScores } from '@/lib/scoring';
import { Answers } from '@/lib/questions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: Answers = body.answers;
    const uid: string = body.uid ?? 'anonymous';

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
    }

    const scores = computeScores(answers);

    const ref = await db.collection('quiz_responses').add({
      answers,
      ...scores,
      uid,
      created_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const doc = await db.collection('quiz_responses').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
