module voting_system::dashboard;

use sui::tx_context::{Self, TxContext};

public struct Dashboard has key{
    id: UID,
    proposals_ids: vector<ID>,
}

public struct AdminCap has key{
    id: UID,
}

fun init(ctx: &mut TxContext) {
    new(ctx);
    transfer::transfer(AdminCap{id: object::new(ctx)}, ctx.sender());
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

#[test_only]
public fun issue_admin_cap(ctx: &mut TxContext){
    transfer::transfer(AdminCap{id: object::new(ctx)}, ctx.sender());
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
    scenario.next_tx(creator);
    {
        let cap = test_scenario::take_from_sender<AdminCap>(&scenario);
        // ít nhất có cap rồi, có thể assert thêm nếu muốn
        test_scenario::return_to_sender<AdminCap>(&scenario, cap);
    };
    test_scenario::end(scenario);
}