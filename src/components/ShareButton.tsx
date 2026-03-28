'use client';

import { useState } from 'react';

interface ShareButtonProps {
  resultId: string;
  comboLabel: string;
}

export default function ShareButton({ resultId, comboLabel }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/results/${resultId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: comboLabel, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="flex-1 text-center bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-2xl border border-slate-200 transition-colors cursor-pointer"
    >
      {copied ? 'Copied! ✓' : 'Share with a friend →'}
    </button>
  );
}
