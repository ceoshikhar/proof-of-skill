import { FC } from "react";
import { GoPlusCircle } from "react-icons/go";

import {
    CandidateRaw,
    CandidateListItem,
    useCompareView,
} from "../CompareContext";
import clsx from "clsx";

export const CandidateSelector = () => {
    const { candidates } = useCompareView();

    // First 5 will be considered as "Recommended";
    const recommendedCandidates = candidates.slice(4);

    return (
        <div className="border-2 border-black border-solid flex flex-col items-center min-w-[300px]">
            <h1 className="text-lg font-[poppins] pt-2 pb-2">
                Most Recommeneded
            </h1>

            <div className="border-t-2 border-t-back border-b-2 border-b-back border-solid flex flex-col items-center justify-center gap-y-3 pt-3 bg-[#F6F6EF]">
                {candidates.map((candidate, idx) => {
                    // Don't show the not "recommended" candidates.
                    if (idx > 4) return null;

                    return (
                        <CandidateSelectItem
                            key={candidate.id}
                            id={candidate.id}
                            name={candidate.name}
                            isSelected={candidate.isSelected}
                        />
                    );
                })}

                <p className="text-sm text-center pb-4">
                    Recommendations are based on your skill requirements and
                    candidate's performance.
                </p>
            </div>

            <div className="h-18" />

            <div className="w-full border-t-2 border-t-back border-b-2 border-b-back border-solid flex flex-col items-center justify-center gap-y-3 pt-3">
                {candidates.map((candidate, idx) => {
                    // Don't show the "recommended" candidates again.
                    if (idx < 5) return null;

                    return (
                        <CandidateSelectItem
                            key={candidate.id}
                            id={candidate.id}
                            name={candidate.name}
                            isSelected={candidate.isSelected}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const randomAvatarUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7x7RFFT8-4WY26mVJxhk5lvmoTIhb_0NzAQ&s";

const CandidateSelectItem: FC<CandidateListItem> = ({
    id,
    name,
    isSelected,
}) => {
    const { selectCandidate } = useCompareView();

    return (
        <div
            className={clsx(
                "w-full pl-4 pr-4 pb-4 flex gap-x-3 items-center justify-between border-b-1 border-b-gray-400",
                {
                    "opacity-25": isSelected,
                    "hover:cursor-not-allowed": isSelected,
                }
            )}
        >
            <img src={randomAvatarUrl} width={20} alt="avatar" />

            <p className="font-bold text-sm">{name}</p>

            <button
                className={clsx({
                    "hover:cursor-pointer": !isSelected,
                    "hover:cursor-not-allowed": isSelected,
                })}
                onClick={() => !isSelected && selectCandidate(id)}
            >
                <GoPlusCircle color="#998AFF" />
            </button>
        </div>
    );
};
