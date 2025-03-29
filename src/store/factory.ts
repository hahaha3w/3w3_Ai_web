
import { Draft } from "immer"
import { create, StoreApi } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

//value 为函数的obj
type ActionsType = {
  [key in string]: (...args: any[]) => void;
}

type StoreApiGet<T, K> = K extends keyof T ? T[K] : never
export const createPersistedStore = <State extends object , Actions extends object>(
  key: string,
  initValues: State, 
  actions: (set: StoreApi<State & Actions>['setState']) => Actions
) => create(persist(
  immer<State & Actions>(
    set => ({
      ...initValues,
      ...actions(set)
      })
  ),
  {
    name: key, // unique name
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  }
))


export const createImmerStore = <State extends object , Actions extends object>(
  key: string,
  initValues: State, 
  actions: (set: StoreApi<State & Actions>['setState']) => Actions
) => create(
  immer<State & Actions>(
    set => ({
      ...initValues,
      ...actions(set)
      })
  )
)