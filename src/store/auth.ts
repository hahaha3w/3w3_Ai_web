import { create } from 'zustand';

interface AuthState {
  userId: number | null;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  theme: 'light' | 'dark';
  useDay: number;
  token: string;
  setAuth: (auth: Partial<AuthState>) => void;
  resetAuth: () => void;
  updateField: (field: keyof AuthState, value: any) => void;
  deleteField: (field: keyof AuthState) => void;
  getField: (field: keyof AuthState) => any;
}

const useAuthStore = create<AuthState>((set, get) => ({
  userId: null,
  username: '',
  email: '',
  avatar: '',
  bio: '',
  theme: 'light',
  useDay: 0,
  token: '',
  setAuth: (auth) => set((state) => ({ ...state, ...auth })),
  resetAuth: () =>
    set(() => ({
      userId: null,
      username: '',
      email: '',
      avatar: '',
      bio: '',
      theme: 'light',
      useDay: 0,
      token: '',
    })),
  updateField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  deleteField: (field) =>
    set((state) => {
      const newState = { ...state };
      delete newState[field];
      return newState;
    }),
  getField: (field) => get()[field],
}));

export default useAuthStore;