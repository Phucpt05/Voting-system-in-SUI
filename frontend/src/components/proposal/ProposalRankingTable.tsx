import { FC, useState, useEffect } from 'react';
import { useNetworkVariable } from '../../config/networkConfig';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { Proposal } from '../../types';

interface ProposalRankingTableProps {
    onProposalClick?: (proposalId: string) => void;
}

export const ProposalRankingTable: FC<ProposalRankingTableProps> = ({ onProposalClick }) => {
    const dashboardId = useNetworkVariable("dashboardId");
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    
    //  Lấy dashboard để có danh sách proposal IDs
    const { data: dashboardData, isPending: dashboardPending, error: dashboardError } = useSuiClientQuery(
        "getObject", {
        id: dashboardId,
        options: {
            showContent: true,
        }
    }
    );

    // Lấy danh sách proposal IDs từ dashboard
    const proposalIds = dashboardData?.data?.content?.dataType === "moveObject" 
        ? (dashboardData.data.content.fields as any).proposals_ids || []
        : [];

    // Dùng multiGetObjects để lấy tất cả proposals một lần
    const { data: proposalsData, isPending: proposalsPending, error: proposalsError } = useSuiClientQuery(
        "multiGetObjects", {
        ids: proposalIds,
        options: {
            showContent: true,
        }
    },
    {
        enabled: proposalIds.length > 0, // Chỉ chạy khi có ID
    }
    );
    console.log(proposalsData);
    useEffect(() => {
        if (proposalsData) {
            console.log("All proposals data:", proposalsData);
            
            const proposalData: Proposal[] = [];
            
            // Xử lý dữ liệu từ multiGetObjects
            proposalsData.forEach((obj: any) => {
                if (obj.data?.content?.dataType === "moveObject") {
                    const fields = obj.data.content.fields;
                    // Transform the data to match the Proposal interface
                    const proposal: Proposal = {
                        id: { id: obj.data.objectId },
                        title: fields.title,
                        description: fields.description,
                        status: fields.status,
                        voted_yes_count: Number(fields.voted_yes_count),
                        voted_no_count: Number(fields.voted_no_count),
                        expiration: Number(fields.expiration),
                        voter_registry: fields.voter_registry || [],
                        creator: fields.creator,
                    };
                    proposalData.push(proposal);
                }
            });
            
            console.log("Processed proposals array:", proposalData);
            
            // Calculate score for each proposal (vote_yes - vote_no) and set to 0 if negative
            const proposalsWithScore = proposalData.map(proposal => {
                const score = proposal.voted_yes_count - proposal.voted_no_count;
                return {
                    ...proposal,
                    score: score < 0 ? 0 : score
                };
            });
            
            // Sắp xếp các proposal theo score từ cao đến thấp
            const proposalSort = [...proposalsWithScore].sort((a, b) => b.score - a.score);
            const proposalRanking = proposalSort.filter((proposal)=> proposal.status.variant !== "Delisted");
            console.log("Sorted proposals by score:", proposalRanking);

            setProposals(proposalRanking);
            setLoading(false);
        }
    }, [proposalsData]);

    if (dashboardPending || proposalsPending || loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-blue-500 mb-4"></div>
                    <div className="text-lg font-medium">Loading proposal rankings...</div>
                </div>
            </div>
        );
    }

    if (dashboardError || proposalsError) {
        return (
            <div className="text-center py-8 px-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 max-w-2xl mx-auto mt-8">
                <div className="font-bold text-lg mb-2">Error:</div>
                <div>{dashboardError?.message || proposalsError?.message}</div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="text-center py-8 px-8 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-xl border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto mt-8">
                <div className="font-bold text-lg mb-2">Dashboard not found</div>
                <div>Please check your network connection and try again.</div>
            </div>
        );
    }

    return (
        <div className="mb-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-5">
                    Proposal Rankings
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Proposals ranked by score (Yes votes - No votes) from highest to lowest
                </p>
            </div>

            {proposals.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No proposals available</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        There are currently no proposals to rank. Check back later for new voting opportunities.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Yes Votes
                                </th>
                                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    No Votes
                                </th>
                                <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Score
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {proposals.map((proposal, index) => (
                                <tr
                                    key={proposal.id.id}
                                    className={`hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 ${
                                        index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20' : ''
                                    }`}
                                    onClick={() => onProposalClick && onProposalClick(proposal.id.id)}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            {index === 0 ? (
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold mr-3 shadow-md">
                                                    1
                                                </span>
                                            ) : index === 1 ? (
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-white font-bold mr-3 shadow-md">
                                                    2
                                                </span>
                                            ) : index === 2 ? (
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-amber-700 to-amber-800 text-white font-bold mr-3 shadow-md">
                                                    3
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold mr-3">
                                                    {index + 1}
                                                </span>
                                            )}
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {proposal.title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                            {proposal.description}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <span className="mr-1.5 text-green-500">👍</span>
                                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                {proposal.voted_yes_count}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <span className="mr-1.5 text-red-500">👎</span>
                                            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                {proposal.voted_no_count}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            {proposal.score && proposal.score > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    {proposal.score}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    {proposal.score || 0}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};