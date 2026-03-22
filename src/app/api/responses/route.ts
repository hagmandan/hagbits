import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { computeScores } from '@/lib/scoring';
import { Answers } from '@/lib/questions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: Answers = body.answers;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
    }

    const scores = computeScores(answers);

    const rows = await sql`
      INSERT INTO quiz_responses
        (answers, sleep_score, screen_score, diet_score, activity_score, total_score, personality_label)
      VALUES
        (${JSON.stringify(answers)}, ${scores.sleep_score}, ${scores.screen_score},
         ${scores.diet_score}, ${scores.activity_score}, ${scores.total_score},
         ${scores.personality_label})
      RETURNING id
    `;

    return NextResponse.json({ id: rows[0].id });
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
    const rows = await sql`
      SELECT * FROM quiz_responses WHERE id = ${id}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
