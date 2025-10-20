import { FC } from 'react';
import { Proposal, ProposalStatus } from '../../types';
import { useActivateProposal, useDelistProposal } from '../utils/ActiveProposal';
import { useRemoveProposal } from '../utils/RemoveProposal';

interface ProposalStatusControlsProps {
  proposal: Proposal;
  status: ProposalStatus;
}

export const ProposalStatusControls: FC<ProposalStatusControlsProps> = ({proposal, status }) => {
    const { delistProposal, isPending: isDelisting } = useDelistProposal();
    const {activateProposal, isPending: isActivating } = useActivateProposal();
    const {removeProposal, isPending: isRemoving} = useRemoveProposal();

    const isActived = status.variant === "Active";
    const handleToggleActive = (isActived: boolean)=>{
        if(isActived){
            delistProposal(proposal.id.id);
        }else{
            activateProposal(proposal.id.id);
        }

    }

    return (
        <div className="flex space-x-2 mt-4 justify-between">
            <button
            onClick={(e)=>{
                e.stopPropagation();
                handleToggleActive(isActived)
            }}
            className={`w-1/3 px-3 py-1 ${isActived? "bg-red-500 hover:bg-red-600":"bg-green-500 hover:bg-green-600"}  text-white rounded-md text-sm  disabled:opacity-50 transition-colors duration-200`}
            >
            {isActivating?"Activating...": isDelisting? "Delisting..." : isActived ? "Delist" : "Activative"}
            </button>

            {!isActived && <button 
                onClick={(e)=>{
                    e.stopPropagation();
                    removeProposal(proposal.id.id);
                }}
                className='w-1/3 px-3 py-1 text-white rounded-md text-sm  disabled:opacity-50 transition-colors duration-200 bg-red-500 hover:bg-red-600'
            >
                Remove
            </button>}
        
        </div>
  );
};