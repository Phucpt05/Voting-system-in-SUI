import { ProposalRankingTable } from '../components/proposal/ProposalRankingTable';
import { useNavigation } from '../providers/theme/navigation/NavigationContext';

const ProposalRankingTableView = () => {
    const { navigate } = useNavigation();

    const handleProposalClick = (proposalId: string) => {
        navigate(`/proposals/${proposalId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ProposalRankingTable onProposalClick={handleProposalClick} />
        </div>
    );
};

export default ProposalRankingTableView;