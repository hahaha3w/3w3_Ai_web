import { current } from "immer";
import { createImmerStore } from "./factory";

export enum ModelBoxType {
  NONE,
  MEMOIR_BOX,
  ACTIVITY_BOX,
}

interface ModelBoxState<T = ModelBoxType> {
  type: T;
  currentId: T extends ModelBoxType.NONE ? null : number;
}

interface ModelBoxAction {
  hiddenBox: () => void;
  showMemoirBox: (id: number) => void;
  showActivityBox: (id: number) => void;
}

export const useModalBoxStore = createImmerStore<ModelBoxState<ModelBoxType>, ModelBoxAction>(
  {
    type: ModelBoxType.NONE,
    currentId: null
  },
  (set) => ({
    hiddenBox: () => {
      set((state) => {
        state.type = ModelBoxType.NONE;
        state.currentId = null;
      })
    },
    showMemoirBox: (id: number) => {
      set((state) => {
        state.type = ModelBoxType.MEMOIR_BOX;
        state.currentId = id;
      })
    },
    showActivityBox: (id: number) => {
      set((state) => {
        state.type = ModelBoxType.ACTIVITY_BOX;
        state.currentId = id;
      })
    }
  })
)