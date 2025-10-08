import { SuiID } from "./vite-env"

export interface Proposal{
    id: SuiID,
    title: string,
    description: string,
    voted_yes_count: number,
    voted_no_count: number,
    expiration: number,
    voter_registry: string[],
    creator: string,
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