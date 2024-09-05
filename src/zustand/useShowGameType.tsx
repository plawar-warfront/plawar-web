import { create } from 'zustand';

interface ShowGameTypeState {
    showGameType: "auto" | "game" | "info";
    setShowGameType: (input: "auto" | "game" | "info") => void;
}

const useShowGameType = create<ShowGameTypeState>(set => ({
    showGameType: "auto",
    setShowGameType: (input) => set({ showGameType: input }),
}));

export default useShowGameType;