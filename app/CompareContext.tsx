"use client";

import {
    createContext,
    ReactNode,
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

export interface CandidateRaw {
    id: string;
    name: string;
    data: {
        data: {
            skillset: {
                id: string;
                name: string;
                skills: {
                    id: string;
                    name: string;
                    pos: {
                        id: string;
                        consensus_score: number;
                    }[];
                }[];
            }[];
        };
    };
}

export type ConsensusScore = 0 | 1 | 2 | 3 | 4;

export interface Candidate {
    id: string;
    name: string;
    skills: Record<string, ConsensusScore>; // Where string is the skill's ID
}

export interface CandidateSkill {
    id: string;
    name: string;
}

interface CompareContext {
    candidates: CandidateListItem[];
    candidatesSelected: Candidate[];
    selectCandidate: (id: string) => void;
    skills: CandidateSkill[];
}

const Context = createContext<CompareContext>({
    candidates: [],
    candidatesSelected: [],
    selectCandidate: () => null,
    skills: [],
});

export const CompareProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
    const [candidatesSelected, setCandidatesSelected] = useState<Candidate[]>(
        []
    );
    const [skills, setSkills] = useState<CandidateSkill[]>([]);
    // To lookup the skill by ID if it was already added to `skills` array or not.
    // This prevents us from loopings `skills` array several times when selecting
    // a candidate and importing their skill(s).
    const [skillsMap, setSkillsMap] = useState<Map<string, boolean>>(new Map());

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

        const candidateRawData: CandidateRaw = await data.json();

        const newSkillsToAdd: CandidateSkill[] = [];

        const allCandidateSkillset = candidateRawData.data.data.skillset;
        const allCandidateSkillsWithConsensusScore: Record<
            string,
            ConsensusScore
        > = {};

        for (let i = 0; i < allCandidateSkillset.length; i++) {
            const candidateSkills = allCandidateSkillset[i].skills;

            for (let j = 0; j < candidateSkills.length; j++) {
                const skillToAdd = candidateSkills[j];
                const score = skillToAdd.pos[0]
                    .consensus_score as ConsensusScore;
                allCandidateSkillsWithConsensusScore[skillToAdd.id] = score;

                if (!skillsMap.has(skillToAdd.id)) {
                    newSkillsToAdd.push({
                        id: skillToAdd.id,
                        name: skillToAdd.name,
                    });
                    skillsMap.set(skillToAdd.id, true);
                }
            }
        }

        const candidate: Candidate = {
            id: candidateRawData.id,
            name: candidateRawData.name,
            skills: allCandidateSkillsWithConsensusScore,
        };

        setCandidatesSelected((prev) => [...prev, candidate]);
        setSkills((prev) => [...prev, ...newSkillsToAdd]);

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
            skills,
        };
    }, [candidates, candidatesSelected, selectCandidate, skills]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useCompareView = (): CompareContext => {
    const context = useContext(Context);

    if (!context) {
        console.error(
            "useCompareContext: Context not found. Make sure <CompareProvider /> is used."
        );

        return {} as CompareContext;
    }

    return context;
};
