import { create } from "zustand";

const useOTCStore = create((set) => ({
    session: {},
    setSession: (session) => set({ session }),
}));

export const useSession = () => useOTCStore(s => s.session);

export default useOTCStore;
