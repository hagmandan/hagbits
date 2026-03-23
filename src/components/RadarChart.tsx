'use client';

import { ResponsiveRadar } from '@nivo/radar';
import { CategoryScores } from '@/lib/scoring';

interface RadarChartProps {
  scores: CategoryScores;
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data = [
    { category: 'Sleep',    score: scores.sleep_score,    ideal: 12 },
    { category: 'Screen',   score: scores.screen_score,   ideal: 12 },
    { category: 'Diet',     score: scores.diet_score,     ideal: 12 },
    { category: 'Activity', score: scores.activity_score, ideal: 12 },
  ];

  return (
    <div className="h-72">
      <ResponsiveRadar
        data={data}
        keys={['ideal', 'score']}
        indexBy="category"
        maxValue={12}
        valueFormat=" >-.0f"
        margin={{ top: 28, right: 60, bottom: 28, left: 60 }}
        gridShape="circular"
        gridLevels={4}
        gridLabelOffset={14}
        enableDots={true}
        dotSize={6}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={false}
        colors={['rgba(139,92,246,0.08)', 'rgba(139,92,246,0.35)']}
        fillOpacity={1}
        blendMode="normal"
        borderWidth={2}
        borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
        gridLabel={({ id }) => (
          <text
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
          >
            {id}
          </text>
        )}
        motionConfig="gentle"
        legends={[]}
        isInteractive={false}
      />
    </div>
  );
}
