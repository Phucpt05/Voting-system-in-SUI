#[test_only]
module voting_system::voting_system_tests;

    use sui::test_scenario::{Self, Scenario};
    use voting_system::proposal::{Self, Proposal};
    use voting_system::dashboard::{Self, AdminCap};

#[test]
fun test_create_proposal(){

    let user = @0xCA;
    let mut scenario: Scenario = test_scenario::begin(user); 
    {
        dashboard::issue_admin_cap(scenario.ctx());
    };
    scenario.next_tx(user);
    {
        let title = b"Hi".to_string();
        let desc = b"There".to_string();
        
        let admin_cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        
        proposal::create(&admin_cap, title, desc, 1000000000, scenario.ctx());
        test_scenario::return_to_sender<AdminCap>(&scenario, admin_cap);
    };
    scenario.next_tx(user);
    {
        let created_proposal = test_scenario::take_shared<Proposal>(&scenario);
        // assert!(created_proposal.title() == b"Hi".to_string());
        assert!(proposal::title(&created_proposal) == b"Hi".to_string());
        assert!(proposal::desc(&created_proposal) == b"There".to_string());
        assert!(proposal::voted_yes_count(&created_proposal) == 0);
        assert!(proposal::voted_no_count(&created_proposal) ==0);
        assert!(proposal::creator(&created_proposal) == user);
        test_scenario::return_shared(created_proposal);
        // created_proposal.title();
        // proposal::title(&created_proposal)

    };
    test_scenario::end(scenario);
}



