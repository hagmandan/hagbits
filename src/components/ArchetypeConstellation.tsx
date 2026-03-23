'use client';

import { useState } from 'react';
import { CategoryScores, ArchetypeKey, getArchetypeInfo } from '@/lib/scoring';

interface ConstellationProps {
  archetypeRanked: [ArchetypeKey, ArchetypeKey, ArchetypeKey];
  scores: CategoryScores;
}

// 2D positions derived from [sleep, activity] centroids, scaled to 360×260 viewport.
// x = sleep * 320 + 20,  y = (1 - activity) * 220 + 20
const NODES: Record<ArchetypeKey, { x: number; y: number }> = {
  blueprint:           { x: 340, y:  20 },
  main_character:      { x: 308, y:  42 },
  undercover_athlete:  { x: 148, y:  20 },
  sleep_lore:          { x: 340, y: 174 },
  soft_life:           { x: 308, y: 196 },
  chaotic_functional:  { x: 212, y: 132 },
  always_online:       { x: 180, y: 152 },
  needs_more_fruit:    { x: 244, y: 152 },
  offline_struggling:  { x: 148, y: 152 },
  plot_twist:          { x:  52, y: 240 },
};

// Pairs to draw faint connecting lines between nearby archetypes
const EDGES: [ArchetypeKey, ArchetypeKey][] = [
  ['blueprint', 'main_character'],
  ['main_character', 'undercover_athlete'],
  ['blueprint', 'sleep_lore'],
  ['sleep_lore', 'soft_life'],
  ['soft_life', 'main_character'],
  ['chaotic_functional', 'always_online'],
  ['chaotic_functional', 'needs_more_fruit'],
  ['chaotic_functional', 'offline_struggling'],
  ['offline_struggling', 'plot_twist'],
  ['always_online', 'offline_struggling'],
];

const RANK_COLORS = ['#8b5cf6', '#ec4899', '#0ea5e9'] as const;

export default function ArchetypeConstellation({ archetypeRanked, scores }: ConstellationProps) {
  const [hovered, setHovered] = useState<ArchetypeKey | null>(null);

  const userX = (scores.sleep_score / 12) * 320 + 20;
  const userY = (1 - scores.activity_score / 12) * 220 + 20;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 380 280"
        className="w-full max-w-lg mx-auto"
        style={{ minWidth: 300 }}
      >
        {/* Axis labels */}
        <text x="190" y="272" textAnchor="middle" className="text-xs" style={{ fill: '#94a3b8', fontSize: 9, fontWeight: 500 }}>
          ← less sleep · more sleep →
        </text>
        <text x="8" y="140" textAnchor="middle" style={{ fill: '#94a3b8', fontSize: 9, fontWeight: 500 }}
          transform="rotate(-90, 8, 140)">
          active ↑
        </text>

        {/* Edges */}
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke="#e2e8f0" strokeWidth={1}
          />
        ))}

        {/* Dashed lines from user to top-3 */}
        {archetypeRanked.map((key, rank) => (
          <line
            key={key}
            x1={userX} y1={userY}
            x2={NODES[key].x} y2={NODES[key].y}
            stroke={RANK_COLORS[rank]}
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.5}
          />
        ))}

        {/* Archetype nodes */}
        {(Object.keys(NODES) as ArchetypeKey[]).map((key) => {
          const { x, y } = NODES[key];
          const rankIdx = archetypeRanked.indexOf(key);
          const isTop3 = rankIdx !== -1;
          const isHovered = hovered === key;
          const info = getArchetypeInfo(key);
          const r = isTop3 ? 22 : 16;

          return (
            <g
              key={key}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}
            >
              {/* Glow ring for top-3 */}
              {isTop3 && (
                <circle
                  r={r + 5}
                  fill="none"
                  stroke={RANK_COLORS[rankIdx]}
                  strokeWidth={2}
                  opacity={0.4}
                />
              )}
              <circle
                r={r}
                fill={isTop3 ? `${RANK_COLORS[rankIdx]}22` : '#f8fafc'}
                stroke={isTop3 ? RANK_COLORS[rankIdx] : '#e2e8f0'}
                strokeWidth={isTop3 ? 2 : 1}
              />
              <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: isTop3 ? 14 : 11 }}>
                {info.emoji}
              </text>

              {/* Rank badge */}
              {isTop3 && (
                <text
                  x={r - 2} y={-(r - 2)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: RANK_COLORS[rankIdx], fontSize: 8, fontWeight: 700 }}
                >
                  #{rankIdx + 1}
                </text>
              )}

              {/* Hover tooltip */}
              {isHovered && (
                <g transform={`translate(0, ${-(r + 18)})`}>
                  <rect
                    x={-50} y={-10} width={100} height={20}
                    rx={6} fill="white"
                    stroke="#e2e8f0" strokeWidth={1}
                    filter="url(#shadow)"
                  />
                  <text
                    textAnchor="middle" dominantBaseline="central"
                    style={{ fill: '#475569', fontSize: 9, fontWeight: 600 }}
                  >
                    {info.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* User marker */}
        <g transform={`translate(${userX}, ${userY})`}>
          <circle r={10} fill="#8b5cf6" opacity={0.15} />
          <text textAnchor="middle" dominantBaseline="central" style={{ fill: '#8b5cf6', fontSize: 13, fontWeight: 700 }}>
            ★
          </text>
        </g>

        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
          </filter>
        </defs>
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-1">
        {archetypeRanked.map((key, i) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: RANK_COLORS[i] }} />
            #{i + 1} {getArchetypeInfo(key).label}
          </div>
        ))}
      </div>
    </div>
  );
}
