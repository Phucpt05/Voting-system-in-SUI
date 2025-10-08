import { useSuiClientQuery } from "@mysten/dapp-kit"
import { SuiObjectData } from "@mysten/sui/client";
import { FC, useState } from "react"
import { Proposal } from "../../types";
import { VoteModal } from "./VoteModal";

interface ProposalItemPros {
    proposal_id: string,
}

export const ProposalItem: FC<ProposalItemPros> = ({ proposal_id }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: dataResponse, isPending, error } = useSuiClientQuery(
        "getObject", {
        id: proposal_id,
        options: {
            showContent: true
        }
    }
    );
    
    if (isPending) return <div className='flex justify-center items-center py-8'>
        <div className='text-center text-gray-500 dark:text-gray-400'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2'></div>
            <div>Loading...</div>
        </div>
    </div>
    
    if (error) return <div className='text-center py-4 px-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800'>
        <div className='font-medium'>Error:</div>
        <div>{error?.message}</div>
    </div>
    
    if (!dataResponse || dataResponse.data?.content?.dataType != "moveObject") return <div className='text-center py-4 px-6 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg border border-yellow-200 dark:border-yellow-800'>
        Proposal not found
    </div>

    const proposal = parseProposal(dataResponse.data);
    if (!proposal?.title) return null;

    // Check if proposal is expired - timestamp is in seconds format
    const expirationDate = new Date(proposal.expiration * 1000);
    const currentDate = new Date();
    const isExpired = expirationDate < currentDate;
    console.log(expirationDate)

    return (
        <>
            <div 
                className={`relative overflow-hidden rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] 
                ${isExpired ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:shadow-lg border-blue-500/30"}
                bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700`}
                onClick={() => !isExpired && setIsModalOpen(true)}
            >
                {/* Add a subtle accent bar at the top */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${isExpired ? "bg-red-500" : "bg-blue-500"}`}></div>

                {/* Content with better padding and spacing */}
                <div className="p-5 pt-6">
                    {/* Title section with better typography */}
                    <div className="mb-3">
                        <h3 className={`text-xl font-bold ${isExpired ? "text-red-500 dark:text-red-400" : "text-gray-800 dark:text-gray-100"} mb-1`}>
                            {proposal?.title}
                        </h3>
                        {/* Add creator info */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <span>Created by: {proposal?.creator?.substring(0, 6)}...{proposal?.creator?.substring(proposal?.creator.length - 4)}</span>
                        </div>
                    </div>

                    {/* Description with better styling */}
                    <div className="mb-4">
                        <p className={`text-gray-600 dark:text-gray-300 text-sm ${isExpired ? "text-red-400 dark:text-red-300" : ""}`}>
                            {proposal?.description}
                        </p>
                    </div>

                    {/* Vote counts with better visual presentation */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-6">
                            <div className={`flex items-center ${isExpired ? "text-green-700 dark:text-green-400" : "text-green-600 dark:text-green-400"}`}>
                                <span className="mr-1">👍</span>
                                <span className="font-medium">{proposal?.voted_yes_count}</span>
                            </div>
                            <div className={`flex items-center ${isExpired ? "text-red-700 dark:text-red-400" : "text-red-600 dark:text-red-400"}`}>
                                <span className="mr-1">👎</span>
                                <span className="font-medium">{proposal?.voted_no_count}</span>
                            </div>
                        </div>

                        {/* Expiration with better styling */}
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${isExpired
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            }`}>
                            {formatUnixTime(proposal?.expiration)}
                        </div>
                    </div>

                    {/* Add a progress bar to visualize voting results */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                style={{ width: `${(proposal?.voted_yes_count / (proposal?.voted_yes_count + proposal?.voted_no_count || 1)) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{Math.round((proposal?.voted_yes_count / (proposal?.voted_yes_count + proposal?.voted_no_count || 1)) * 100)}% Yes</span>
                            <span>{Math.round((proposal?.voted_no_count / (proposal?.voted_yes_count + proposal?.voted_no_count || 1)) * 100)}% No</span>
                        </div>
                    </div>
                </div>
            </div>

            <VoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                proposal={proposal}
                onVote={(votedYes: boolean) => console.log(votedYes)}
            />
        </>
    )
}

function parseProposal(data: SuiObjectData): Proposal | null {
    if (data.content?.dataType !== "moveObject") return null;

    const { voted_yes_count, voted_no_count, expiration, ...rest } = data.content.fields as any;
    return {
        ...rest,
        voted_yes_count: Number(voted_yes_count),
        voted_no_count: Number(voted_no_count),
        expiration: Number(expiration),
    }
}

function formatUnixTime(timestampSec: number) {
    const expirationDate = new Date(timestampSec * 1000);
    const now = new Date();
    
    // Check if expired
    if (expirationDate < now) return "Expired";
    
    const diffInMs = expirationDate.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInDays === 0) {
        if (diffInHours === 0) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return diffInMinutes <= 1 ? "Ends soon" : `Ends in ${diffInMinutes}m`;
        }
        return `Ends in ${diffInHours}h`;
    } else if (diffInDays === 1) {
        return "Ends tomorrow";
    } else if (diffInDays <= 7) {
        return `Ends in ${diffInDays} days`;
    } else {
        return expirationDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });
    }
}