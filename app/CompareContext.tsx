"use client";

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export interface CandidateListItem {
    id: string;
    name: string;
    isSelected?: boolean;
}

export interface Candidate {
    id: string;
    name: string;
}

interface CompareContext {
    candidates: CandidateListItem[];
    candidatesSelected: Candidate[];
    selectCandidate: (id: string) => void;
}

const Context = createContext<CompareContext>({
    candidates: [],
    candidatesSelected: [],
    selectCandidate: () => null,
});

export const CompareProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
    const [candidatesSelected, setCandidatesSelected] = useState<Candidate[]>(
        []
    );

    const selectCandidate = useCallback(async (id: string) => {
        for (let i = 0; i < candidatesSelected.length; i++) {
            const alreadyAddedCandidateId = candidatesSelected[i].id;

            // Just saving unnecesary API calls and we will be sure that same
            // candidates are not getting added.
            if (id == alreadyAddedCandidateId) {
                console.warn("This candidate is already added. Skipping.");
                return;
            }
        }

        const data = await fetch(
            `https://forinterview.onrender.com/people/${id}`
        );

        const candidateData = await data.json();
        setCandidatesSelected((prev) => [...prev, candidateData]);

        setCandidates((prev) => {
            const copy = Array.from(prev);

            for (let i = 0; i < copy.length; i++) {
                if (copy[i].id === id) {
                    copy[i].isSelected = true;
                }
            }

            return copy;
        });
    }, []);

    useEffect(() => {
        const fetchCandidates = async () => {
            const data = await fetch(
                "https://forinterview.onrender.com/people"
            );
            const candidates = await data.json();
            setCandidates(candidates);
        };

        fetchCandidates();
    }, []);

    const value = useMemo(() => {
        return {
            candidates,
            candidatesSelected,
            selectCandidate,
        };
    }, [candidates, candidatesSelected, selectCandidate]);

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
