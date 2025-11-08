import { useSuiClientQuery} from "@mysten/dapp-kit"
import { SuiObjectData } from "@mysten/sui/client";
import { FC, useState } from "react"
import { Proposal, VoteNft } from "../../types";
import { VoteModal } from "./VoteModal";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ProposalStatusControls } from "./ProposalStatusControls";
import { AGGREGATOR } from "../../constants";

interface ProposalItemPros {
    proposal_id: string,
    voteNft: VoteNft | undefined,
    onVoteTxSuccess: () => void;
    onProposalStatusChange?: () => void;
}

export const ProposalItem: FC<ProposalItemPros> = ({ proposal_id, voteNft, onVoteTxSuccess, onProposalStatusChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentAccount = useCurrentAccount();

    const { data: dataResponse, isPending, error, refetch: refetchProposal } = useSuiClientQuery(
        "getObject", {
        id: proposal_id,
        options: {
            showContent: true,
            showDisplay: true
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
    
    if (!dataResponse || dataResponse.data?.content?.dataType != "moveObject") return null

    const proposal = parseProposal(dataResponse.data);
    if (!proposal?.title) return null;
    console.log("Proposal: ", proposal);

    // Check if proposal is expired - timestamp could be in seconds or milliseconds
    const isMilliseconds = proposal.expiration > 1000000000000;
    const expirationDate = isMilliseconds ? new Date(proposal.expiration) : new Date(proposal.expiration * 1000);
    const currentDate = new Date();
    const isDelisted = proposal.status.variant === "Delisted";
    const isExpired = (expirationDate < currentDate);


    return (
        <div className={` `}>
            <div
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]
                bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700
                ${(isExpired || isDelisted) ? "cursor-not-allowed opacity-70 w-100" : "cursor-pointer hover:shadow-xl border-blue-500/30"}`}
                onClick={() => !(isExpired || isDelisted) && setIsModalOpen(true)}
            >
                {/* Add a subtle accent bar at the top */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isExpired ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}></div>

                {/* Content with better padding and spacing */}
                <div className="p-4 pt-5">
                    {/* Title section with better typography */}
                    <div className="mb-3">
                        <div className="flex justify-between items-start">
                            <h3 className={`text-xl font-bold ${isExpired ? "text-red-500 dark:text-red-400" : "text-gray-800 dark:text-gray-100"} mb-1`}>
                                {proposal?.title}
                            </h3>
                            {!!voteNft?.url && <img src={voteNft?.url} className="w-7 h-7 rounded-full ml-2 flex-shrink-0" />}
                        </div>
                        {/* Add creator info */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Created by: {proposal?.creator?.substring(0, 6)}...{proposal?.creator?.substring(proposal?.creator.length - 4)}
                        </div>
                    </div>

                    {/* Proposal Image */}
                    {(proposal?.image_url || proposal?.blobs_id) && (
                        <div className="mb-3 flex justify-center">
                            <img
                                src={proposal.image_url || `${AGGREGATOR}/v1/blobs/${proposal.blobs_id}`}
                                alt={proposal.title}
                                className="rounded-lg w-full h-40 object-cover"
                                onError={(e) => {
                                    // Handle image loading errors
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Description with better styling */}
                    <div className="mb-3">
                        <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 ${isExpired ? "text-red-400 dark:text-red-300" : ""}`}>
                            {proposal?.description}
                        </p>
                    </div>

                    {/* Vote counts with better visual presentation */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex space-x-3">
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${(isExpired|| isDelisted) ? "bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"}`}>
                                <span className="mr-1">👍</span>
                                <span className="font-semibold">{proposal?.voted_yes_count}</span>
                            </div>
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${(isExpired|| isDelisted) ? "bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
                                <span className="mr-1">👎</span>
                                <span className="font-semibold">{proposal?.voted_no_count}</span>
                            </div>
                        </div>

                        {/* Expiration with better styling */}
                        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${(isExpired || isDelisted)
                                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-300"
                                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300"
                            }`}>
                            {isExpired ? "Expired" : isDelisted ? "Delisted" : formatUnixTime(proposal?.expiration)}
                        </div>
                    </div>

                    {/* Add a progress bar to visualize voting results */}
                    <div className="mt-3">
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
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
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
                    
                    {/* Show expiration date for expired proposals */}
                    {isExpired && (
                        <div className="text-xs text-red-500 dark:text-red-400 font-medium mt-2">
                            Expired on: {expirationDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </div>
                    )}
                    
                    {/* Admin controls for activating/delisting proposals - only show if not expired */}
                    {currentAccount && !isExpired && (
                        <ProposalStatusControls
                            proposal={proposal}
                            status={proposal.status}
                            expiration={proposal.expiration}
                            isExpired={isExpired}
                            onStatusChangeSuccess={async () => {
                                // Refetch the proposal data to get updated status
                                await refetchProposal();
                                // Notify parent component that proposal status has changed
                                if (onProposalStatusChange) {
                                    onProposalStatusChange();
                                }
                            }}
                        />
                    )}
                    
                    {/* Placeholder for expired proposals to maintain consistent height */}
                </div>
            </div>

            <VoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                hasVoted = {!!voteNft}
                proposal={proposal}
                onVote={async () => {
                    // Refetch the proposal data to get updated vote counts
                    await refetchProposal();
                    onVoteTxSuccess();
                    setIsModalOpen(false);
                }}
            />
        </div>
    )
}

function parseProposal(data: SuiObjectData): Proposal | null {
    if (data.content?.dataType !== "moveObject") return null;

    const { voted_yes_count, voted_no_count, expiration, ...rest } = data.content.fields as any;
    
    // Use Display data if available, otherwise fall back to content fields
    const display = data.display?.data;
    const title = display?.name || rest.title || "";
    const description = display?.description || rest.description || "";
    const imageUrl = display?.image_url || "";
    
    // Extract blobs_id from image_url if it's a full URL, otherwise use blobs_id field
    let blobs_id = rest.blobs_id || "";
    if (imageUrl && !blobs_id) {
        // Extract blob ID from URL like "https://aggregator.walrus-testnet.walrus.space/v1/blobs/{blobId}"
        const match = imageUrl.match(/\/blobs\/([^\/]+)/);
        if (match) {
            blobs_id = match[1];
        }
    }
    
    return {
        ...rest,
        title,
        description,
        voted_yes_count: Number(voted_yes_count),
        voted_no_count: Number(voted_no_count),
        expiration: Number(expiration),
        blobs_id: blobs_id || rest.blobs_id,
        image_url: imageUrl,
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