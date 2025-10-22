import { SuiID } from "./vite-env"

export interface ProposalStatus{
    variant: "Active" | "Delisted"
}

export interface Proposal{
    id: SuiID,
    title: string,
    description: string,
    status: ProposalStatus,
    voted_yes_count: number,
    voted_no_count: number,
    expiration: number,
    voter_registry: string[],
    creator: string,
    score?: number, // Added score field (optional since it's calculated)
}
export interface VoteNft {
    id: SuiID,
    proposalId: string,
    url: string,
}


    // public struct Proposal has key{
    //     id: UID,
    //     title: String,
    //     description: String,
    //     voted_yes_count: u64,
    //     voted_no_count: u64,
    //     expiration: u64,
    //     creator: address,
    //     voter_registry: vector<address>,
    // }   