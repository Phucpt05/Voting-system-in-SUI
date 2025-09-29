module voting_system::dashboard;

use sui::tx_context::TxContext;


public struct Dashboard has key{
    id: UID,
    proposals_ids: vector<ID>,
}


fun init(ctx: &mut TxContext) {
    new(ctx);
}

public fun new(ctx: &mut TxContext) {
    let dashboard = Dashboard{
        id: object::new(ctx),
        proposals_ids: vector[],
    };
    transfer::share_object(dashboard);
    
}
public fun register_proposal(self: &mut Dashboard, proposal_id: ID){
    // self.proposals_ids.push_back(proposal_id);
    vector::push_back(&mut self.proposals_ids, proposal_id);
}

#[test]
fun test_init_module(){

    use sui::test_scenario::{Self, Scenario};
    let creator = @0xCA;
    let mut scenario: Scenario = test_scenario::begin(creator); 
    {
        init(scenario.ctx());
    };    
    scenario.next_tx(creator);
    {
        let dashboard = test_scenario::take_shared<Dashboard>(&scenario);
        assert!(dashboard.proposals_ids.is_empty());
        test_scenario::return_shared(dashboard);
    };
    test_scenario::end(scenario);
}