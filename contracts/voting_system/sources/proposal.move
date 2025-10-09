
module voting_system::proposal{
    use sui::object::{UID};
    use sui::tx_context::TxContext;
    use voting_system::dashboard::AdminCap;
    use std::string::String;
    use sui::table::{Self, Table};

    const EDuplicateVote: u64 = 0;

    public struct Proposal has key{
        id: UID,
        title: String,
        description: String,
        voted_yes_count: u64,
        voted_no_count: u64,
        expiration: u64,
        creator: address,
        voters: Table<address, bool>,
    }   
    // public function
    public fun vote(self: &mut Proposal, vote_yes: bool, ctx: &TxContext){
        assert!(!self.voters.contains(ctx.sender()), EDuplicateVote);
        if(vote_yes){
            self.voted_yes_count = self.voted_yes_count + 1;
        }else{
            self.voted_no_count = self.voted_no_count + 1; 
        };
        table::add(&mut self.voters, ctx.sender(), vote_yes);
    }

    //  View function
    public fun title (self: &Proposal) : String{
        self.title
    }
    public fun desc (self: &Proposal) : String{
        self.description
    }
    public fun voted_yes_count (self: &Proposal) : u64{
        self.voted_yes_count
    }
    public fun voted_no_count (self: &Proposal) : u64{
        self.voted_no_count
    }
    public fun expiration (self: &Proposal) : u64{
        self.expiration
    }
    public fun creator (self: &Proposal) : address{
        self.creator
    }

    // ===admin function ===
    public fun create(
        _admin_cap: &AdminCap,
        title: String,
        description: String,
        expiration: u64,
        ctx: &mut TxContext
    ): ID{
        let proposal = Proposal{            
            id: object::new(ctx),
            title,
            description,
            voted_yes_count: 0,
            voted_no_count: 0,
            expiration,
            creator: ctx.sender(),
            voters : table::new(ctx),
        };
        let id = proposal.id.to_inner(); 
        transfer::share_object(proposal);
        id
    }
}
