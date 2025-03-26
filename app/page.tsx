"use client";

import { FaArrowLeft } from "react-icons/fa6";

import { useCompareContext } from "./CompareContext";
import { CompareViewHeatmap } from "./components/CompareViewHeatmap";
import { PeopleSelector } from "./components/PeopleSelector";

export default function Home() {
    const { candidatesSelected } = useCompareContext();

    return (
        <div>
            <div className="ms-12 mt-4">
                <button className="bg-transparent flex items-center gap-2 font-[inter] font-bold text-gray-400">
                    <FaArrowLeft /> Back To My Jobs
                </button>
            </div>

            <div className="flex items-center justify-between mx-14 mt-8">
                <h1 className="text-3xl font-bold text-gray-500">
                    Posk_UXdesigner_sr001
                </h1>

                <h3 className="text-lg text-gray-500">
                    {candidatesSelected} Candidates
                </h3>
            </div>

            <div className="flex gap-8">
                <PeopleSelector />
                <div className="w-full bg-red-500">
                    <CompareViewHeatmap />
                </div>
            </div>
        </div>
    );
}
