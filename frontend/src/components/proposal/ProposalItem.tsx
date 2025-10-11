import { useSuiClientQuery } from "@mysten/dapp-kit"
import { SuiObjectData } from "@mysten/sui/client";
import { FC, useState } from "react"
import { Proposal } from "../../types";
import { VoteModal } from "./VoteModal";

interface ProposalItemPros {
    proposal_id: string,
    hasVoted: boolean;
    isUserAllowed?: boolean;
    
}

export const ProposalItem: FC<ProposalItemPros> = ({ proposal_id, hasVoted, isUserAllowed = true }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: dataResponse, isPending, error } = useSuiClientQuery(
        "getObject", {
        id: proposal_id,
        options: {
            showContent: true
        }
    }
    );
    console.log(dataResponse?.data)
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

    return (
        <>
            <div
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]
                ${isExpired ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:shadow-xl border-blue-500/30"}
                bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700`}
                onClick={() => !isExpired && setIsModalOpen(true)}
            >
                {/* Add a subtle accent bar at the top */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isExpired ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}></div>

                {/* Content with better padding and spacing */}
                <div className="p-6 pt-7">
                    {/* Title section with better typography */}
                    <div className="mb-4">
                        <h3 className={`text-2xl font-bold ${isExpired ? "text-red-500 dark:text-red-400" : "text-gray-800 dark:text-gray-100"} mb-2`}>
                            {proposal?.title}
                        </h3>
                        {/* Add creator info */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <span className="inline-flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Created by: {proposal?.creator?.substring(0, 6)}...{proposal?.creator?.substring(proposal?.creator.length - 4)}
                            </span>
                        </div>
                    </div>

                    {/* Description with better styling */}
                    <div className="mb-5">
                        <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed ${isExpired ? "text-red-400 dark:text-red-300" : ""}`}>
                            {proposal?.description}
                        </p>
                    </div>

                    {/* Vote counts with better visual presentation */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-6">
                            <div className={`flex items-center px-3 py-1 rounded-full ${isExpired ? "bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"}`}>
                                <span className="mr-1.5">👍</span>
                                <span className="font-semibold">{proposal?.voted_yes_count}</span>
                            </div>
                            <div className={`flex items-center px-3 py-1 rounded-full ${isExpired ? "bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
                                <span className="mr-1.5">👎</span>
                                <span className="font-semibold">{proposal?.voted_no_count}</span>
                            </div>
                        </div>

                        {/* Expiration with better styling */}
                        <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${isExpired
                                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-300"
                                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300"
                            }`}>
                            {formatUnixTime(proposal?.expiration)}
                        </div>
                    </div>

                    {/* Add a progress bar to visualize voting results */}
                    <div className="mt-5">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 flex overflow-hidden shadow-inner">
                            <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 transition-all duration-500"
                            style={{
                                width: `${(proposal?.voted_yes_count / (proposal?.voted_yes_count + proposal?.voted_no_count || 1)) * 100}%`,
                            }}
                            ></div>
                            <div
                            className="bg-gradient-to-r from-red-500 to-rose-500 h-1 transition-all duration-500"
                            style={{
                                width: `${(proposal?.voted_no_count / (proposal?.voted_yes_count + proposal?.voted_no_count || 1)) * 100}%`,
                            }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            <span className="inline-flex items-center">
                                <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {Math.round(
                                    (proposal?.voted_yes_count /
                                    (proposal?.voted_yes_count + proposal?.voted_no_count || 1)) * 100
                                )}
                                % Yes
                            </span>
                            <span className="inline-flex items-center">
                                <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {Math.round(
                                    (proposal?.voted_no_count /
                                    (proposal?.voted_yes_count + proposal?.voted_no_count || 1)) * 100
                                )}
                                % No
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <VoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                hasVoted = {hasVoted}
                proposal={proposal}
                isUserAllowed={isUserAllowed}
                onVote={(votedYes: boolean) => {
                    console.log(votedYes);
                    setIsModalOpen(false);
                }}
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
    // Check if the timestamp is in milliseconds rather than seconds
    // If it's a very large number (greater than 1000000000000), it's likely in milliseconds
    const isMilliseconds = timestampSec > 1000000000000;
    const expirationDate = isMilliseconds ? new Date(timestampSec) : new Date(timestampSec * 1000);
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