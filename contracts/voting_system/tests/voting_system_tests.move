#[test_only]
module voting_system::voting_system_tests;

    use sui::test_scenario::{Self, Scenario};
    use voting_system::proposal::{Self, Proposal, VoteProofNFT, ProposalStatus};
    use voting_system::dashboard::{Self, AdminCap, Dashboard, DASHBOARD};
    use sui::clock::{Self, Clock};

    const EWrongVoteCount: u64 = 1;
    const ENoFoundVoteNFT: u64 = 2;
    const EWrongStatus: u64 = 3;

/*
fun new_proposal(admin_cap: &AdminCap, ctx: &mut TxContext): ID{
    let tile = b"test".to_string();
    let desc = b"test".to_string();

    proposal::create(admin_cap, tile, desc, 2000000000000, ctx)
}
*/

fun new_proposal(ctx: &mut TxContext): ID{
    let tile = b"test".to_string();
    let desc = b"test".to_string();

    proposal::create(tile, desc, 2000000000000, ctx)
}

/*
#[test]
fun test_create_proposal_with_admin(){

    let user = @0xCA;
    let mut scenario: Scenario = test_scenario::begin(user);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(user);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };
    scenario.next_tx(user);
    {
        let created_proposal = test_scenario::take_shared<Proposal>(&scenario);
        // assert!(created_proposal.title() == b"Hi".to_string());
        assert!(proposal::title(&created_proposal) == b"test".to_string());
        assert!(proposal::desc(&created_proposal) == b"test".to_string());
        assert!(proposal::expiration(&created_proposal) == 2000000000000);
        assert!(proposal::voted_yes_count(&created_proposal) == 0);
        assert!(proposal::voted_no_count(&created_proposal) ==0);
        assert!(proposal::creator(&created_proposal) == user);
        test_scenario::return_shared(created_proposal);
        // created_proposal.title();
        // proposal::title(&created_proposal)

    };
    test_scenario::end(scenario);
}
*/
/*
#[test]
#[expected_failure(abort_code = test_scenario::EEmptyInventory)]
fun test_create_proposal_without_admin(){

    let admin = @0xA01;
    let user = @0xB0B;

    let mut scenario: Scenario = test_scenario::begin(admin);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(user);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);

        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };
    test_scenario::end(scenario);
}
*/
/*
#[test]
fun test_register_proposal_as_admin(){
    let admin = @0xAD;
    let mut scenario:  Scenario = test_scenario::begin(admin);
    {
        let otw: DASHBOARD = dashboard::new_otw(scenario.ctx());
        dashboard::issue_admin_cap(scenario.ctx());
        dashboard::new(otw, scenario.ctx());

    };
    scenario.next_tx(admin);
    {
        let mut dashboard: Dashboard = test_scenario::take_shared<Dashboard>(&scenario);
        let admin_cap: AdminCap = test_scenario::take_from_sender<AdminCap>(&scenario);

        let proposal_id = new_proposal(&admin_cap, scenario.ctx());

        dashboard.register_proposal(&admin_cap , proposal_id);
        let proposal_ids = dashboard.proposal_ids();
        let proposal_exists = proposal_ids.contains(&proposal_id);
        assert!(proposal_exists);

        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
        test_scenario::return_shared(dashboard);
    };
    test_scenario::end(scenario);
}
*/

#[test]
fun test_register_proposal_without_admin(){
    let user = @0xAD;
    let mut scenario:  Scenario = test_scenario::begin(user);
    {
        let otw: DASHBOARD = dashboard::new_otw(scenario.ctx());
        dashboard::new(otw, scenario.ctx());
    };
    scenario.next_tx(user);
    {
        let mut dashboard: Dashboard = test_scenario::take_shared<Dashboard>(&scenario);
        let proposal_id = new_proposal(scenario.ctx());

        dashboard.register_proposal(proposal_id);
        let proposal_ids = dashboard.proposal_ids();
        let proposal_exists = proposal_ids.contains(&proposal_id);
        assert!(proposal_exists);

        test_scenario::return_shared(dashboard);
    };
    test_scenario::end(scenario);
}


/*
#[test]
fun test_voting(){
    let admin = @0xA01;
    let tuan = @0xB0B;
    let tu = @0xC0C;

    let mut scenario: Scenario = test_scenario::begin(admin);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(admin);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);

        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };
    // scenario.next_tx(admin);
    // {
    //     let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
    //     let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
    //     proposal.set_delisted_status(&admin_cap);
    //     test_scenario::return_shared(proposal);
    //     scenario.return_to_sender(admin_cap);
    // };
    scenario.next_tx(tuan);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,true, &test_clock, scenario.ctx());

        assert!(proposal.voted_yes_count() == 1, EWrongVoteCount);
        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };
    scenario.next_tx(tu);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,false, &test_clock, scenario.ctx());

        assert!(proposal.voted_no_count() == 1, EWrongVoteCount);
        // assert!(proposal.voted_no_count() == 1, EWrongVoteCount);
        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();
    };
    test_scenario::end(scenario);
}
*/

#[test]
fun test_voting(){
    let creator = @0xA01;
    let tuan = @0xB0B;
    let tu = @0xC0C;

    let mut scenario: Scenario = test_scenario::begin(creator);
    scenario.next_tx(creator);
    {
        new_proposal(scenario.ctx());
    };
    scenario.next_tx(tuan);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,true, &test_clock, scenario.ctx());

        assert!(proposal.voted_yes_count() == 1, EWrongVoteCount);
        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };
    scenario.next_tx(tu);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,false, &test_clock, scenario.ctx());

        assert!(proposal.voted_no_count() == 1, EWrongVoteCount);
        // assert!(proposal.voted_no_count() == 1, EWrongVoteCount);
        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();
    };
    test_scenario::end(scenario);
}
/*
#[test]
#[expected_failure(abort_code = voting_system::proposal::EDuplicateVote)]
fun test_duplicate_voting(){
    let admin = @0xA01;
    let tuan = @0xB0B;

    let mut scenario: Scenario = test_scenario::begin(admin);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(admin);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);

        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };
    scenario.next_tx(tuan);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,true, &test_clock, scenario.ctx());
        proposal::vote(&mut proposal, false, &test_clock, scenario.ctx());
        // proposal::vote(&mut proposal, false, scenario.ctx());

        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };
    test_scenario::end(scenario);

}
*/

#[test]
#[expected_failure(abort_code = voting_system::proposal::EDuplicateVote)]
fun test_duplicate_voting(){
    let creator = @0xA01;
    let tuan = @0xB0B;

    let mut scenario: Scenario = test_scenario::begin(creator);
    scenario.next_tx(creator);
    {
        new_proposal(scenario.ctx());
    };
    scenario.next_tx(tuan);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,true, &test_clock, scenario.ctx());
        proposal::vote(&mut proposal, false, &test_clock, scenario.ctx());
        // proposal::vote(&mut proposal, false, scenario.ctx());

        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };
    test_scenario::end(scenario);

}
/*
#[test]
fun test_issue_vote_proof(){
    let admin = @0xA01;
    let user = @0xB0B;
    
    let mut scenario: Scenario = test_scenario::begin(admin);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(admin);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        
        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };
    scenario.next_tx(user);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,true, &test_clock,  scenario.ctx());
        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };
    scenario.next_tx(user);
    {
        let vote_proof = test_scenario::take_from_sender<VoteProofNFT>(&scenario);
        assert!(!vote_proof.vote_proof_url().inner_url().is_empty(), ENoFoundVoteNFT);
        test_scenario::return_to_sender(&scenario, vote_proof);
    };
    test_scenario::end(scenario);

}
*/

#[test]
fun test_issue_vote_proof(){
    let creator = @0xA01;
    let user = @0xB0B;
    
    let mut scenario: Scenario = test_scenario::begin(creator);
    scenario.next_tx(creator);
    {
        new_proposal(scenario.ctx());
    };
    scenario.next_tx(user);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(200000000000);
        proposal::vote(&mut proposal,true, &test_clock,  scenario.ctx());
        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };
    scenario.next_tx(user);
    {
        let vote_proof = test_scenario::take_from_sender<VoteProofNFT>(&scenario);
        assert!(!vote_proof.vote_proof_url().inner_url().is_empty(), ENoFoundVoteNFT);
        test_scenario::return_to_sender(&scenario, vote_proof);
    };
    test_scenario::end(scenario);

}
/*
#[test]
fun test_change_proposal_status(){
    let admin = @0xA01;
    
    let mut scenario: Scenario = test_scenario::begin(admin);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(admin);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        
        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };
    scenario.next_tx(admin);
    {
        let proposal = test_scenario::take_shared<Proposal>(&scenario);
        assert!(proposal.is_active());

        test_scenario::return_shared(proposal);
    };
    scenario.next_tx(admin);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        proposal.set_delisted_status(&admin_cap);
        
        assert!(!proposal.is_active(), EWrongStatus);

        test_scenario::return_shared(proposal);
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);

    };
    scenario.next_tx(admin);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        proposal.set_active_status(&admin_cap);
        
        assert!(proposal.is_active(), EWrongStatus);

        test_scenario::return_shared(proposal);
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);

    };
    test_scenario::end(scenario);
}
*/

#[test]
fun test_change_proposal_status(){
    let creator = @0xA01;
    
    let mut scenario: Scenario = test_scenario::begin(creator);
    scenario.next_tx(creator);
    {
        new_proposal(scenario.ctx());
    };
    scenario.next_tx(creator);
    {
        let proposal = test_scenario::take_shared<Proposal>(&scenario);
        assert!(proposal.is_active());

        test_scenario::return_shared(proposal);
    };
    scenario.next_tx(creator);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        proposal.set_delisted_status();
        
        assert!(!proposal.is_active(), EWrongStatus);

        test_scenario::return_shared(proposal);

    };
    scenario.next_tx(creator);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        proposal.set_active_status();
        
        assert!(proposal.is_active(), EWrongStatus);

        test_scenario::return_shared(proposal);

    };
    test_scenario::end(scenario);
}
/*
#[test]
#[expected_failure(abort_code = voting_system::proposal::EProposalExpired)]
fun test_voting_expiration(){
    let admin = @0xA01;
    let tuan = @0xC0C;

    let mut scenario: Scenario = test_scenario::begin(admin);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(admin);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);

        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };

    scenario.next_tx(tuan);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(2000000000000);
        proposal::vote(&mut proposal,true, &test_clock, scenario.ctx());

        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };

    test_scenario::end(scenario);
}
*/

#[test]
#[expected_failure(abort_code = voting_system::proposal::EProposalExpired)]
fun test_voting_expiration(){
    let creator = @0xA01;
    let tuan = @0xC0C;

    let mut scenario: Scenario = test_scenario::begin(creator);
    scenario.next_tx(creator);
    {
        new_proposal(scenario.ctx());
    };

    scenario.next_tx(tuan);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        let mut test_clock = clock::create_for_testing(scenario.ctx());
        test_clock.set_for_testing(2000000000000);
        proposal::vote(&mut proposal,true, &test_clock, scenario.ctx());

        test_scenario::return_shared(proposal);
        test_clock.destroy_for_testing();

    };

    test_scenario::end(scenario);
}
/*
#[test]
#[expected_failure(abort_code = test_scenario::EEmptyInventory)]
fun test_remove_proposal(){
    let admin = @0xA01;

    let mut scenario: Scenario = test_scenario::begin(admin);
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(admin);
    {
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);

        new_proposal(&admin_cap, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };

    scenario.next_tx(admin);
    {
        let proposal = test_scenario::take_shared<Proposal>(&scenario);
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        proposal.remove(&admin_cap);
        scenario.return_to_sender(admin_cap)
    };
    scenario.next_tx(admin);
    {
        let proposal = test_scenario::take_shared<Proposal>(&scenario);
        test_scenario::return_shared(proposal);
    };

    test_scenario::end(scenario);
}
*/

#[test]
#[expected_failure(abort_code = test_scenario::EEmptyInventory)]
fun test_remove_proposal(){
    let creator = @0xA01;

    let mut scenario: Scenario = test_scenario::begin(creator);
    scenario.next_tx(creator);
    {
        new_proposal(scenario.ctx());
    };

    scenario.next_tx(creator);
    {
        let proposal = test_scenario::take_shared<Proposal>(&scenario);
        proposal.remove();
    };
    scenario.next_tx(creator);
    {
        let proposal = test_scenario::take_shared<Proposal>(&scenario);
        test_scenario::return_shared(proposal);
    };

    test_scenario::end(scenario);
}