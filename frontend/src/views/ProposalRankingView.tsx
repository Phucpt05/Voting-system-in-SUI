import React, { FC } from 'react';
import { useNetworkVariable } from '../config/networkConfig';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectData } from '@mysten/sui/client';
import { SuiID } from '../vite-env';
import { useVoteNfts } from '../hooks/useVoteNfts';
import { VoteNft, Proposal } from '../types';
import { ProposalRanking } from '../components/proposal/ProposalRanking';
import { useNavigation } from '../providers/theme/navigation/NavigationContext';

const ProposalRankingView = () => {
    const dashboardId = useNetworkVariable("dashboardId");
    const { data: voteNftsRes } = useVoteNfts();
    const { navigate } = useNavigation();
    const { data: dataResponse, isPending, error } = useSuiClientQuery(
        "getObject", {
        id: dashboardId,
        options: {
            showContent: true,
        }
    }
    );
    const voteNfts = extractVoteNfts(voteNftsRes);

    if (isPending) return <div className='flex justify-center items-center py-16'>
        <div className='text-center text-gray-500 dark:text-gray-400'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-blue-500 mb-4'></div>
            <div className='text-lg font-medium'>Loading proposal rankings...</div>
        </div>
    </div>;

    if (error) return <div className='text-center py-8 px-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 max-w-2xl mx-auto mt-8'>
        <div className='font-bold text-lg mb-2'>Error:</div>
        <div>{error?.message}</div>
    </div>;

    if (!dataResponse) return <div className='text-center py-8 px-8 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-xl border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto mt-8'>
        <div className='font-bold text-lg mb-2'>Dashboard not found</div>
        <div>Please check your network connection and try again.</div>
    </div>;

    const dashboardFields = dataResponse.data ? getDashboardFields(dataResponse.data) : null;
    const proposalIds = dashboardFields?.proposals_ids || [];

    const handleProposalClick = (proposalId: string) => {
        navigate(`/proposals/${proposalId}`);
    };

    return (
        <div className="mb-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Proposal Rankings
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Proposals ranked by the number of "Yes" votes from highest to lowest
                </p>
            </div>

            {proposalIds.length === 0 ? (
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <ProposalRanking
                        proposalIds={proposalIds}
                        onProposalClick={handleProposalClick}
                    />
                </div>
            )}
        </div>
    );
};

function getDashboardFields(data: SuiObjectData) {
    if (data.content?.dataType !== "moveObject") return null;
    return data.content?.fields as {
        id: SuiID,
        proposals_ids: string[]
    };
}

function extractVoteNfts(nftRes: any) {
    if (!nftRes?.data) return [];
    return nftRes.data.map((nftObject: any) => getVoteNft(nftObject.data));
}

function getVoteNft(nftData: any): VoteNft {
    if (nftData?.content?.dataType !== "moveObject") {
        return { id: { id: "" }, url: "", proposalId: "" };
    }
    const { proposal_id: proposalId, url, id } = nftData.content.fields as any;
    return {
        proposalId,
        id,
        url,
    };
}

export default ProposalRankingView;