import { SignBytesResult } from '@xpla/wallet-provider';
import { create } from 'zustand';

interface LoginSession {
    loginSession: SignBytesResult | undefined;
    setLoginSession: (input: SignBytesResult | undefined) => void;
}

const useLoginSession = create<LoginSession>(set => ({
    loginSession: undefined,
    setLoginSession: (input) => set({ loginSession: input }),
}));

export default useLoginSession;