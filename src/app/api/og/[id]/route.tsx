import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getArchetypeResult, getArchetypeInfo, CategoryScores, ArchetypeKey } from '@/lib/scoring';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const doc = await db.collection('quiz_responses').doc(id).get();
  if (!doc.exists) {
    return new Response('Not found', { status: 404 });
  }

  const data = doc.data()!;
  const scores: CategoryScores = {
    sleep_score: data.sleep_score,
    screen_score: data.screen_score,
    diet_score: data.diet_score,
    activity_score: data.activity_score,
  };
  const archetypeRanked = JSON.parse(data.archetype_ranked) as [ArchetypeKey, ArchetypeKey, ArchetypeKey];
  const { comboLabel, comboEmoji, ranked } = getArchetypeResult(archetypeRanked);
  const top = getArchetypeInfo(ranked[0]);

  const categories = [
    { label: 'Sleep',    emoji: '🌙', score: scores.sleep_score,    color: '#818cf8' },
    { label: 'Screen',   emoji: '📱', score: scores.screen_score,   color: '#38bdf8' },
    { label: 'Diet',     emoji: '🍽️', score: scores.diet_score,     color: '#34d399' },
    { label: 'Activity', emoji: '🏃', score: scores.activity_score, color: '#fb923c' },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Combo headline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <span style={{ fontSize: '64px' }}>{comboEmoji}</span>
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 800,
            color: '#3b0764',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '8px',
          }}
        >
          {comboLabel}
        </div>
        <div style={{ fontSize: '22px', color: '#7c3aed', marginBottom: '40px' }}>
          {top.emoji} {top.label}
        </div>

        {/* Score bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '680px' }}>
          {categories.map(({ label, emoji, score, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '24px', width: '32px' }}>{emoji}</span>
              <span style={{ fontSize: '20px', color: '#4c1d95', width: '90px', fontWeight: 600 }}>{label}</span>
              <div
                style={{
                  flex: 1,
                  height: '20px',
                  background: '#e9d5ff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${(score / 12) * 100}%`,
                    height: '100%',
                    background: color,
                    borderRadius: '10px',
                  }}
                />
              </div>
              <span style={{ fontSize: '18px', color: '#6d28d9', width: '48px', textAlign: 'right', fontWeight: 700 }}>
                {score}/12
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            fontSize: '18px',
            color: '#a78bfa',
            letterSpacing: '0.05em',
          }}
        >
          hagbits · check your habits
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
