"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from "react";

interface CompareContext {
    candidates: Candidate[];
    candidatesSelected: number;
    setCandidatesSelected: Dispatch<SetStateAction<number>>;
}

interface Candidate {
    id: string;
    name: string;
}

const Context = createContext<CompareContext>({
    candidates: [],
    candidatesSelected: 0,
    setCandidatesSelected: () => null,
});

export const CompareProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [candidatesSelected, setCandidatesSelected] = useState(0);

    const value = useMemo(() => {
        return {
            candidates,
            candidatesSelected,
            setCandidatesSelected,
        };
    }, []);

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useCompareContext = (): CompareContext => {
    const context = useContext(Context);

    if (!context) {
        console.error(
            "useCompareContext: Context not found. Make sure <CompareProvider /> is used."
        );

        return {} as CompareContext;
    }

    return context;
};
