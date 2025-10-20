import { FC } from 'react';
import { Proposal, ProposalStatus } from '../../types';
import { useDelistProposal } from '../utils/ActiveProposal';

interface ProposalStatusControlsProps {
  proposal: Proposal;
  status: ProposalStatus;
}

export const ProposalStatusControls: FC<ProposalStatusControlsProps> = ({proposal, status }) => {
    const { delistProposal, isPending: isDelisting } = useDelistProposal();


    const isActived = status.variant === "Active";
    const handleToggleActive = (isActived: boolean)=>{
        if(isActived){
            delistProposal(proposal.id.id)
        }
    }
    return (
        <div className="flex space-x-2 mt-2">
            <button
            onClick={(e)=>{
                e.stopPropagation();
                handleToggleActive(isActived)
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:opacity-50 transition-colors duration-200"
            >
            {isDelisting? "Delisting..." : isActived ? "Delist Proposal" : "Activative Proposal"}
            </button>
        
        </div>
  );
};