"use client";

import { FaArrowLeft } from "react-icons/fa6";

import { useCompareView } from "./CompareContext";
import { CompareViewHeatmap } from "./components/CompareViewHeatmap";
import { CandidateSelector } from "./components/CandidateSelector";

export default function Home() {
    const { candidatesSelected } = useCompareView();

    return (
        <div>
            <div className="ms-12 mt-4">
                <button className="bg-transparent flex items-center gap-2 font-[inter] font-bold text-gray-400">
                    <FaArrowLeft /> Back To My Jobs
                </button>
            </div>

            <div className="flex items-center justify-between mx-14 mt-8 mb-4">
                <h1 className="text-3xl font-bold text-gray-400 font-[poppins]">
                    Posk_UXdesigner_sr001
                </h1>

                <h3 className="text-md text-gray-500 font-[poppins] font-normal">
                    {candidatesSelected.length} Candidates
                </h3>
            </div>

            <div className="flex gap-8">
                <CandidateSelector />
                <div className="w-full">
                    <CompareViewHeatmap />
                </div>
            </div>
        </div>
    );
}
