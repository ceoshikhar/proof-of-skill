import clsx from "clsx";
import { FC, ReactNode, useMemo } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import {
    Candidate,
    CandidateSkill,
    ConsensusScore,
    useCompareView,
} from "../CompareContext";
import { getInitials } from "../lib/utils";
import {
    heatmapTileColorMap,
    heatmapTileColorMapDisabled,
    staticCandidatesSelectedData,
    staticSkillData,
} from "../lib/constants";

export const CompareViewHeatmap = () => {
    const { skills, candidatesSelected } = useCompareView();

    return (
        <div>
            <div className="border-b-1 flex items-end justify-between">
                <div>
                    <HeatmapButton isActive>Compare View</HeatmapButton>
                    <HeatmapButton>Individual view</HeatmapButton>
                    <HeatmapButton>Shortlisted candidates</HeatmapButton>
                </div>

                <div className="mr-4 flex gap-2 pb-2">
                    <ArrowButton dir="left" />
                    <ArrowButton dir="right" />
                </div>
            </div>

            {/* The heatmap table starts here. */}
            <HeatmapTable
                skills={skills}
                candidates={candidatesSelected}
                noCandidateSelected={candidatesSelected.length === 0}
            />
        </div>
    );
};

const HeatmapButton: FC<{ children: ReactNode; isActive?: boolean }> = ({
    children,
    isActive,
}) => {
    return (
        <button
            className={clsx(
                "border-1 border-black p-2 text-sm font-[poppins] hover:cursor-pointer",
                {
                    "bg-green-700": isActive,
                    "text-white": isActive,
                }
            )}
        >
            {children}
        </button>
    );
};

const ArrowButton: FC<{ dir: "left" | "right" }> = ({ dir }) => {
    if (!dir) return null;

    const content = () => {
        if (dir === "left") {
            return <BsArrowLeft size={16} />;
        }

        return <BsArrowRight size={16} />;
    };

    return <button className="p-2 border-1 border-black">{content()}</button>;
};

interface HeatmapTableProps {
    skills: CandidateSkill[];
    candidates: Candidate[];
    // To allow us to render unfilled state. Where we show "Select candidate to compare".
    noCandidateSelected?: boolean;
}

const HeatmapTable: FC<HeatmapTableProps> = ({
    skills: skillsProp,
    candidates: candidatesProp,
    noCandidateSelected = false,
}) => {
    const candidates = useMemo(
        () =>
            noCandidateSelected ? staticCandidatesSelectedData : candidatesProp,
        [noCandidateSelected, candidatesProp]
    );

    const skills = useMemo(
        () => (noCandidateSelected ? staticSkillData : skillsProp),
        [noCandidateSelected, skillsProp]
    );

    return (
        <table className="relative mt-12">
            <thead>
                <tr>
                    <th>{""}</th>
                    {candidates.map((candidate) => (
                        <th key={candidate.id} className="pr-6">
                            <div className="relative left-1.75 bottom-1">
                                <div className="w-5 h-5 rounded-full bg-gray-300" />
                                <div className="absolute bottom-6 left-4 -rotate-45">
                                    {getInitials(candidate.name)}
                                </div>
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td
                        className={clsx("absolute top-50 left-135", {
                            hidden: !noCandidateSelected,
                        })}
                    >
                        <HeatmapButton isActive>
                            Select candidate to compare
                        </HeatmapButton>
                    </td>
                </tr>

                {skills.map((skill) => {
                    return (
                        <tr key={skill.id}>
                            <td className="pr-4 font-[poppins] min-w-[350px]">
                                {skill.name}
                            </td>
                            {candidates.map((candidate) => {
                                return (
                                    <td key={candidate.id}>
                                        <HeatmapTableTile
                                            score={candidate.skills[skill.id]}
                                            noCandidateSelected={
                                                noCandidateSelected
                                            }
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

const HeatmapTableTile: FC<{
    score: ConsensusScore;
    noCandidateSelected?: boolean;
}> = ({ score, noCandidateSelected = false }) => {
    const bgColor = noCandidateSelected
        ? heatmapTileColorMapDisabled[score]
        : heatmapTileColorMap[score];

    return <div className="w-8 h-5" style={{ background: bgColor }}></div>;
};
