import clsx from "clsx";
import { FC, ReactNode } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import {
    Candidate,
    CandidateSkill,
    ConsensusScore,
    useCompareView,
} from "../CompareContext";
import { getInitials } from "../lib/utils";
import { heatmapTileColorMap } from "../lib/constants";

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
                noCandidatesAreSelected={candidatesSelected.length === 0}
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
                "border-1 border-black p-2 text-sm font-[poppins]",
                {
                    "bg-green-700": isActive,
                    "text-white": isActive,
                    "hover:cursor-pointer": !isActive,
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
    noCandidatesAreSelected?: boolean;
}

const HeatmapTable: FC<HeatmapTableProps> = ({
    skills,
    candidates,
    noCandidatesAreSelected = false,
}) => {
    return (
        <table className="mt-10">
            <thead>
                <tr>
                    <th>Skill</th>
                    {candidates.map((candidate) => (
                        <th key={candidate.id} className="pr-6">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-gray-200" />
                                <div className="absolute bottom-6 left-4 -rotate-45">
                                    {getInitials(candidate.name)}
                                </div>
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {skills.map((skill) => {
                    return (
                        <tr key={skill.id}>
                            <td className="pr-4">{skill.name}</td>
                            {candidates.map((candidate) => {
                                return (
                                    <td key={candidate.id}>
                                        <HeatmapTableTile
                                            score={candidate.skills[skill.id]}
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

const HeatmapTableTile: FC<{ score: ConsensusScore }> = ({ score }) => {
    const bgColor = heatmapTileColorMap[score];

    return <div className="w-8 h-5" style={{ background: bgColor }}></div>;
};
