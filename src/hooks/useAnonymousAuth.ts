'use client';
import { useEffect, useState } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAnonymousAuth() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else signInAnonymously(auth);
    });
  }, []);

  return uid;
}
