import { ConsensusScore } from "../CompareContext";

// number is the consensus score of the skill, the string is the hex code of the color.
export const heatmapTileColorMap: Record<ConsensusScore, string> = {
    0: "#E3FFEB",
    1: "#F8F8A7",
    2: "#A6D96A",
    3: "#1A9641",
    4: "#003F0B",
};
