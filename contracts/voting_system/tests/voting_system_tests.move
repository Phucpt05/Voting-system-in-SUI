#[test_only]
module voting_system::voting_system_tests;
#[test]
fun test_create_proposal(){
    use sui::test_scenario::{Self, Scenario};
    use voting_system::proposal::{Self, Proposal};

    let user = @0xCA;
    let mut scenario: Scenario = test_scenario::begin(user); 

    scenario.next_tx(user);
    {
        let title = b"Hi".to_string();
        let desc = b"There".to_string();
        proposal::create(title, desc, 1000000000, scenario.ctx());
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



