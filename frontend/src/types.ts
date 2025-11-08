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
    blobs_id?: string,
}
export interface VoteNft {
    id: SuiID,
    proposalId: string,
    url: string,
}

export interface WalrusResponse {
    newlyCreated?: {
        blobObject?: {
            blobId: string;
        };
    };
}

export interface UploadState {
    isUploading: boolean;
    error: string | null;
    progress: number;
}

export interface ProposalImageUploadProps {
    onUpload: (data: { info: WalrusResponse; mediaType: string }) => void;
    currentImage?: string;
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