
#[test_only]
module backhack::market_tests {

    use sui::coin::{ Self, Coin, mint_for_testing as mint, burn_for_testing as burn}; 
    use sui::test_scenario::{Self, Scenario, next_tx, next_epoch, ctx, end};
    use sui::sui::SUI;  
    use sui::tx_context::{Self};

    use backhack::market::{Self, ManagerCap, MarketGlobal};

    const ADMIN_ADDR: address = @0x21;

    const TEAM_ADDR_1: address = @0x41;
    const TEAM_ADDR_2: address = @0x42;

    const SUPPORTER_ADDR_1: address = @0x61;
    const SUPPORTER_ADDR_2: address = @0x62;
    const SUPPORTER_ADDR_3: address = @0x63;
    const SUPPORTER_ADDR_4: address = @0x64;

    #[test]
    public fun test_create_market() {
        let mut scenario = scenario(); 

        setup_market( &mut scenario, ADMIN_ADDR );

        next_tx(&mut scenario, ADMIN_ADDR);
        {
            let mut global = test_scenario::take_shared<MarketGlobal>(&mut scenario);
            
            let (start_time, end_time) = market::get_market_start_and_end_time( &global, 0);

            assert!(start_time == 0, start_time); 
            assert!(end_time == 3, end_time); 
 
            test_scenario::return_shared(global);
        };

        test_scenario::end(scenario);
    }

    #[test]
    public fun test_resolve_market() {
        let mut scenario = scenario(); 

        setup_market( &mut scenario, ADMIN_ADDR );
        setup_odds(  &mut scenario, ADMIN_ADDR );

        place_bet( &mut scenario, TEAM_ADDR_1, 1, 1_000000000);
        place_bet( &mut scenario, TEAM_ADDR_2, 2, 1_000000000);

        place_bet( &mut scenario, SUPPORTER_ADDR_1, 1, 1_000000000);
        place_bet( &mut scenario, SUPPORTER_ADDR_2, 2, 1_000000000);
        place_bet( &mut scenario, SUPPORTER_ADDR_3, 3, 1_000000000);
        place_bet( &mut scenario, SUPPORTER_ADDR_4, 4, 1_000000000);

        next_epoch(&mut scenario, ADMIN_ADDR);
        next_epoch(&mut scenario, ADMIN_ADDR);
        next_epoch(&mut scenario, ADMIN_ADDR);
        
        resolve_market( &mut scenario, ADMIN_ADDR );

        claim_prizes( &mut scenario, TEAM_ADDR_1 );
        // claim_prizes( &mut scenario, TEAM_ADDR_2 );

        // claim_prizes( &mut scenario, SUPPORTER_ADDR_1 );
        // claim_prizes( &mut scenario, SUPPORTER_ADDR_2 );
        // claim_prizes( &mut scenario, SUPPORTER_ADDR_3 );
        // claim_prizes( &mut scenario, SUPPORTER_ADDR_4 );


        test_scenario::end(scenario);

    }

    public fun resolve_market(test: &mut Scenario, admin_address: address) {

        next_tx(test, admin_address);
        { 
            let mut global = test_scenario::take_shared<MarketGlobal>(test);

            market::resolve_market(
                &mut global,
                0,
                0,
                vector[1, 2, 1], // Team#1 gets Prize#1, Team#2 gets Prize#2, Team#1 gets Prize#3,
                ctx(test)
            );

            test_scenario::return_shared(global);  
        };

    }

    public fun setup_market(test: &mut Scenario, admin_address: address) {

        next_tx(test, admin_address);
        {
            market::test_init(ctx(test));
        };

        next_tx(test, admin_address);
        {
            let mut managercap = test_scenario::take_from_sender<ManagerCap>(test); 
            let mut global = test_scenario::take_shared<MarketGlobal>(test);

            market::add_market(  &mut global, 0, 3, vector[10000], ctx(test));

            test_scenario::return_shared(global); 
            test_scenario::return_to_sender(test, managercap);
        };

    }

    public fun setup_odds(test: &mut Scenario, admin_address: address) {

        next_tx(test, admin_address);
        { 
            let mut global = test_scenario::take_shared<MarketGlobal>(test);

            market::update_prize_odds(
                &mut global,
                0,
                vector[30000,20000,10000], // 3 prizes 
                ctx(test)
            );

            test_scenario::return_shared(global);  
        };

    }

    public fun place_bet(test: &mut Scenario, user_address: address, team_id: u64, bet_amount: u64) {

        next_tx(test, user_address);
        { 
            let mut global = test_scenario::take_shared<MarketGlobal>(test);

            market::place_bet(
                &mut global,
                0,
                team_id,
                coin::mint_for_testing<SUI>( bet_amount , ctx(test)),
                ctx(test)
            );

            test_scenario::return_shared(global);  
        };

    }

    public fun claim_prizes(test: &mut Scenario, user_address: address) {

        // next_tx(test, user_address);
        // { 
        //     let mut global = test_scenario::take_shared<MarketGlobal>(test);

        //     // Find the position ID belongs to the user
        //     let mut position_id = 0;
        //     let mut count = 0;

        //     while (count < 6) {
        //         let (_,_,_,holder,_,_) = market::get_bet_position( &global, count );
        //         if (holder == user_address) {
        //             position_id = count;
        //             break
        //         };
        //         count = count+1;
        //     };

        //     let payout_amount = market::check_payout_amount(&global, position_id);

        //     std::debug::print(&(payout_amount));

        //     test_scenario::return_shared(global);  
        // };

    }

    public fun scenario(): Scenario { test_scenario::begin(ADMIN_ADDR) }

}