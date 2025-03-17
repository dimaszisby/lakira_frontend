// atom/userAtom.ts

import { atom } from "jotai";

export interface UserAtom {
  id: string;
  username: string;
  email: string;
  isPublicProfile: boolean;
  token?: string;
}

export const userAtom = atom<UserAtom | null>(null);
