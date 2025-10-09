#[test_only]
module voting_system::voting_system_tests;

    use sui::test_scenario::{Self, Scenario};
    use voting_system::proposal::{Self, Proposal};
    use voting_system::dashboard::{Self, AdminCap, Dashboard, DASHBOARD};

    const EWrongVote: u64 = 0;
    const EWrongVoteCount: u64 = 1;
    
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
        assert!(proposal::voted_yes_count(&created_proposal) == 0);
        assert!(proposal::voted_no_count(&created_proposal) ==0);
        assert!(proposal::creator(&created_proposal) == user);
        test_scenario::return_shared(created_proposal);
        // created_proposal.title();
        // proposal::title(&created_proposal)

    };
    test_scenario::end(scenario);
}
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

fun new_proposal(admin_cap: &AdminCap, ctx: &mut TxContext): ID{
    let tile = b"test".to_string();
    let desc = b"test".to_string();

    proposal::create(admin_cap, tile, desc, 100000000, ctx)
} 
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
    scenario.next_tx(tuan);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        proposal::vote(&mut proposal,true, scenario.ctx());
        // proposal::vote(&mut proposal, true, scenario.ctx());
        // proposal::vote(&mut proposal, false, scenario.ctx());

        assert!(proposal.voted_yes_count() == 1, EWrongVoteCount);
        // assert!(proposal.voted_no_count() == 1, EWrongVoteCount);
        test_scenario::return_shared(proposal);
    };
    scenario.next_tx(tu);
    {
        let mut proposal = test_scenario::take_shared<Proposal>(&scenario);
        proposal::vote(&mut proposal,false, scenario.ctx());
        // proposal::vote(&mut proposal, true, scenario.ctx());
        // proposal::vote(&mut proposal, false, scenario.ctx());

        assert!(proposal.voted_no_count() == 1, EWrongVoteCount);
        // assert!(proposal.voted_no_count() == 1, EWrongVoteCount);
        test_scenario::return_shared(proposal);
    };
    test_scenario::end(scenario);

}