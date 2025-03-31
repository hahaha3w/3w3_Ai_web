import { createPersistedStore } from "./factory";


interface TokenState {
  token: string | null;
  user: string | null;
  email: string | null;
}

interface TokenActions {
  setToken: (token?: string) => void;
  setUser: (user?: string) => void;
  setEmail: (email?: string) => void;
  clearToken: () => void;
}

export const useTokenStore = createPersistedStore<TokenState, TokenActions>(
  "user_token",
  {
    token: null,
    user: null,
    email: null,
  },
  (set) => ({
    setToken: (token) => set((state) => { 
      state.token = token ?? null
    }),
    setUser: (user) => set((state) => {
      state.user = user ?? null
    }),
    setEmail: (email) => set((state) => {
      state.email = email ?? null
    }),
    clearToken: () => set(() => ({
      token: "",
      user: "",
      email: "",
    })),
  })
)