import { useState} from 'react'
import { useNetworkVariable } from '../config/networkConfig';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { PaginatedObjectsResponse, SuiObjectData } from '@mysten/sui/client';
import { SuiID } from '../vite-env';
import { ProposalItem } from '../components/proposal/ProposalItem';
import { useVoteNfts } from '../hooks/useVoteNfts';
import { VoteNft } from '../types';
import { CreateProposalModal } from '../components/proposal/CreateProposalModal';
import { toast } from 'react-toastify';



const ProposalView = () => {
    const dashboardId = useNetworkVariable("dashboardId");
    const {data: voteNftsRes, refetch: refetchProposal} = useVoteNfts();
    const {data: dataResponse, isPending, error, refetch } = useSuiClientQuery(
    "getObject", {
        id: dashboardId,
        options: {
            showContent: true,
        }
    }
    );
   const voteNfts = extractVoteNfts(voteNftsRes);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isRefreshing, setIsRefreshing] = useState(false);

    if(isPending) return <div className='flex justify-center items-center py-16'>
        <div className='text-center text-gray-500 dark:text-gray-400'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-blue-500 mb-4'></div>
            <div className='text-lg font-medium'>Loading proposals...</div>
        </div>
    </div>
    if(error) return <div className='text-center py-8 px-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 max-w-2xl mx-auto mt-8'>
        <div className='font-bold text-lg mb-2'>Error:</div>
        <div>{error?.message}</div>
    </div>
    if(!dataResponse) return <div className='text-center py-8 px-8 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-xl border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto mt-8'>
        <div className='font-bold text-lg mb-2'>Dashboard not found</div>
        <div>Please check your network connection and try again.</div>
    </div>

  const proposals = dataResponse.data ? getDashboardFields(dataResponse.data)?.proposals_ids : [];

  return (
    <div className="mb-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-5">
                Voting Proposals
            </h1>
            <p className="text-nowrap text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                Participate in the bootcamp of our platform and cast your vote on interested projects!
            </p>
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Proposal
            </button>
        </div>
        
        {proposals && proposals.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No proposals available</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    There are currently no active proposals. Check back later for new voting opportunities.
                </p>
            </div>
        ) : isRefreshing ? (
            <div className='flex justify-center items-center py-16'>
                <div className='text-center text-gray-500 dark:text-gray-400'>
                    <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-blue-500 mb-4'></div>
                    <div className='text-lg font-medium'>Refreshing proposals...</div>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals?.map(id => (
                    <ProposalItem
                        key={id}
                        proposal_id={id}
                        voteNft={voteNfts.find(nft=>nft.proposalId===id)}
                        onVoteTxSuccess={() => {
                            refetchProposal();
                            // Also refetch the dashboard to update the list of proposals
                            refetch();
                        }}
                    />
                ))}
            </div>
        )}
        
        
        <CreateProposalModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onProposalCreated={() => {
                setIsRefreshing(true);
                // Add a delay to ensure blockchain has processed the transaction
                setTimeout(() => {
                    refetch();
                    setIsCreateModalOpen(false);
                    setIsRefreshing(false);
                    toast.success("Proposal list refreshed successfully!");
                }, 2000); // 2 second delay
            }}
        />
    </div>
  )
};

const getDashboardFields = (data: SuiObjectData | undefined)=>{
    if(!data || data.content?.dataType !== "moveObject") return null;
    return data.content?.fields as {
        id: SuiID,
        proposals_ids: string[],
        creator: string
    };
}
function extractVoteNfts(nftRes: PaginatedObjectsResponse | undefined){
    if(!nftRes?.data) return [];
    return nftRes.data.map(nftObject =>getVoteNft(nftObject.data));
}
function getVoteNft(nftData: SuiObjectData|undefined|null): VoteNft{
    if(nftData?.content?.dataType !== "moveObject"){
        return {id:{id: ""}, url: "", proposalId:""};
    }
    const {proposal_id: proposalId,url, id} =nftData.content.fields as any; 
    return{
        proposalId, 
        id,
        url,
    }
}
export default ProposalView