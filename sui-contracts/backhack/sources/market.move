
// Market prediction on hackathon results enables users to bet  
// on teams using SUI, while an AI agent dynamically updates odds  
// and verifies results for payouts.  

module backhack::market {
 
    use sui::sui::SUI; 
    use sui::transfer; 
    use sui::coin::{Self, Coin};
    use sui::tx_context::{ Self, TxContext};
    use sui::table::{ Self, Table};
    use sui::balance::{ Self, Supply, Balance};

    use backhack::fixed_point64::{Self, FixedPoint64};

    // ======== Constants ========

    const SCALE: u64 = 10000; // Scaling factor for fixed-point calculations
    const DEFAULT_WINNING_FEE: u64 = 1000; // Default commission fee
    const DEFAULT_MAX_BET_AMOUNT: u64 = 1_000000000; // 1 SUI
    // const DEFAULT_TOTAL_PRIZES: u64 = 10;

    // ======== Errors ========

    const ERR_UNAUTHORIZED: u64 = 1;
    const ERR_INVALID_VALUE: u64 = 2;
    const ERR_ZERO_VALUE: u64 = 3;
    const ERR_DUPLICATED: u64 = 4;
    const ERR_NOT_FOUND: u64  = 5;
    const ERR_ALREADY_RESOLVED: u64 = 6;
    const ERR_PAUSED: u64 = 7;
    const ERR_MARKET_CLOSED: u64 = 8;
    const ERR_INVALID_BET_AMOUNT: u64 = 9;
    const ERR_INVALID_MARKET: u64 = 10;
    const ERR_INSUFFICIENT_AMOUNT: u64 = 11;
    const ERR_EMPTY: u64 = 12; 
    const ERR_INVALID_POSITION: u64 = 13;
    const ERR_NOT_RESOLVED: u64 = 14;
    const ERR_INVALID_LENGTH: u64 = 15;

    // ======== Structs =========


    // Using ManagerCap for admin permission
    public struct ManagerCap has key {
        id: UID
    }

    public struct Position has store {
        market_id: u64, // The ID of the market this bet belongs to
        predicted_team: u64, // The team ID the user is betting on
        amount: u64, // The amount of SUI staked 
        holder: address, // Owner address
        epoch: u64, // The time when the bet was placed
        is_open: bool // A flag indicating whether the position is still open or settled
    }

    public struct MarketStore has store {
        start_time: u64, // Hackathon start timestamp in epoch
        end_time: u64, // Hackathon end timestamp in epoch  
        // total_bets: Table<u64, u64>, // Mapping: Team ID -> Total bet amount
        // total_bets_amount: u64,
        // prize_odds:  Table<u64, u64>, // Mapping: Prize ID -> Odds multiplier
        // winning_teams: Table<u64, u64>, // Mapping of Prize ID -> Winning Team ID
        total_bets: Table<u64, u64>, // Mapping: Team ID -> Total bet amount
        total_bets_amount: u64,
        team_ids: vector<u64>,
        prize_odds: vector<u64>, // Mapping: Prize ID -> Odds multiplier
        winning_teams: vector<u64>, // Mapping of Prize ID -> Winning Team ID
        balance: Balance<SUI>, // SUI assets locked in the market
        is_resolved: bool, // Whether the market has been resolved 
        is_paused: bool // whether the market is currently paused
    }

    // The global state
    public struct MarketGlobal has key {
        id: UID, // Object ID
        ai_agent_list: vector<address>, // List of addresses with management permissions
        markets: Table<u64, MarketStore>, // Mapping: Market ID -> MarketStore
        positions: Table<u64, Position>, // Mapping: Position ID -> User's betting position
        max_bet_amount: u64, // Maximum allowable bet per position 
        winning_fee: u64, // Commission fee taken from winnings
        treasury_address: address // where all fees will be sent
    }

    fun init(ctx: &mut TxContext) {

        transfer::transfer(
            ManagerCap {id: object::new(ctx)},
            tx_context::sender(ctx)
        );

        // Create a new list for adding to the global state
        let mut whitelist_list = vector::empty<address>();
        vector::push_back<address>(&mut whitelist_list, tx_context::sender(ctx));

        // Initialize the global state
        let global = MarketGlobal {
            id: object::new(ctx),
            ai_agent_list: whitelist_list,
            markets: table::new<u64, MarketStore>(ctx),
            positions: table::new<u64, Position>(ctx),
            max_bet_amount: DEFAULT_MAX_BET_AMOUNT,
            winning_fee: DEFAULT_WINNING_FEE,
            treasury_address: tx_context::sender(ctx)
        };

        transfer::share_object(global)
    }

    // ======== Entry Functions =========

    public entry fun place_bet(
        global: &mut MarketGlobal,
        market_id: u64,
        team_id: u64,
        sui: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let bet_amount = coin::value(&sui);

        assert!( global.max_bet_amount >= bet_amount, ERR_INVALID_BET_AMOUNT );

        let market = get_mut_market(global, market_id);

        // Ensure the market is still active and accepting bets
        assert!( market.is_resolved == false, ERR_ALREADY_RESOLVED );
        assert!( market.is_paused == false, ERR_PAUSED );
        assert!( market.end_time > tx_context::epoch(ctx) , ERR_MARKET_CLOSED );
        
        // Deposit the SUI bet into the market's contract
        balance::join(&mut market.balance, coin::into_balance(sui));

        // Update the total bets for the selected team
        if (table::contains( &market.total_bets, team_id)) {
            // If there is already a bet for this team, increase it
            *table::borrow_mut( &mut market.total_bets, team_id ) = *table::borrow( &market.total_bets, team_id )+bet_amount;
        } else {
            // Otherwise, add a new entry
            table::add( &mut market.total_bets, team_id, bet_amount );
        };

        if (vector::contains( &market.team_ids, &team_id ) == false) {
            vector::push_back( &mut market.team_ids, team_id );
        };

        market.total_bets_amount = market.total_bets_amount+bet_amount;

        // Create a new bet position
        let new_position = Position {
            market_id,
            predicted_team: team_id,
            amount: bet_amount,
            holder: tx_context::sender(ctx),
            epoch: tx_context::epoch(ctx),
            is_open: true
        };

        let position_id = table::length( &global.positions );
        table::add( &mut global.positions, position_id, new_position );

        // TODO: emit an event

    }

    public entry fun get_bet_position(global: &MarketGlobal, position_id: u64): (u64, u64, u64, address, u64, bool ) {
        let entry = table::borrow( &global.positions, position_id );
        ( entry.market_id, entry.predicted_team, entry.amount, entry.holder, entry.epoch, entry.is_open )
    }

    // public entry fun get_bet_position_ids(global: &MarketGlobal, market_type: u8, user_address: address): (vector<u64>) {
    //     assert!( market_type == 0 || market_type == 1 || market_type == 2, ERR_INVALID_VALUE);

    //     let mut count = 0;
    //     let mut result = vector::empty<u64>();

    //     while ( count < table::length( &global.positions) ) {
    //         let this_position = table::borrow( &global.positions, count );
    //         if ( market_type == this_position.market_type && user_address == this_position.holder ) {
    //             vector::push_back( &mut result, count );
    //         };
    //         count = count+1;
    //     };

    //     result
    // }

    // public entry fun get_bet_position(global: &MarketGlobal, position_id: u64): (u8, u64, u64, u8, u64, u64, bool ) {
    //     let entry = table::borrow( &global.positions, position_id );
    //     ( entry.market_type, entry.placing_odds, entry.amount, entry.predicted_outcome, entry.round, entry.epoch, entry.is_open )
    // }

    // public entry fun check_payout_amount( global: &MarketGlobal, round: u64, market_type: u8, from_id: u64, until_id: u64, ctx: &mut TxContext  )  : (u64, u64) {
    //     let (_, amount_list , _) = list_winners_and_payouts( global, round, market_type, from_id, until_id, ctx );
    //     let mut total_amount = 0;
    //     let mut count = 0;
    //     let length = vector::length(&amount_list);

    //     while (count < length) {
    //         total_amount = total_amount+*vector::borrow( &amount_list, count );
    //         count = count+1;
    //     };

    //     (length, total_amount)
    // }

    // public entry fun total_bet_positions(global: &MarketGlobal) : u64 {
    //     (table::length(&global.positions))
    // }

    // Adds a new market 
    public entry fun add_market(
        global: &mut MarketGlobal,
        start_time: u64,
        end_time: u64,
        prize_odds: vector<u64>,
        ctx: &mut TxContext
    ) {
        // Ensure that the caller has permission
        verify_caller( global, tx_context::sender(ctx) );
        assert!( end_time >= tx_context::epoch(ctx), ERR_INVALID_VALUE );
        assert!( end_time > start_time, ERR_INVALID_VALUE );
        assert!( vector::length(&prize_odds) > 0, ERR_EMPTY );

        let market_id = table::length( &global.markets );

        // Initialize the prize odds table
        // let mut prize_odds = table::new<u64, u64>(ctx);
        // let mut count = 0;

        // // Set default prize odds for each prize slot
        // while ( count < MAX_PRIZES) {
        //     table::add( &mut prize_odds, count, 0 );
        //     count = count+1;
        // };

        let new_market = MarketStore {
            start_time,
            end_time,
            total_bets: table::new<u64, u64>(ctx),
            total_bets_amount: 0,
            team_ids: vector::empty<u64>() ,
            prize_odds,
            winning_teams: vector::empty<u64>(),
            balance: balance::zero<SUI>(),
            is_resolved: false,
            is_paused: false
        };

        table::add( &mut global.markets, market_id, new_market );

        // TODO: emit an event

    }

    // Updates the market name and URL
    // public entry fun update_market_name_and_url(global: &mut MarketGlobal, market_id:u64,  market_name: String, market_url: String, ctx: &mut TxContext) {
    //     // Ensure that the caller has permission
    //     verify_caller( global, tx_context::sender(ctx) );
    //     assert!( table::length(&global.markets) > market_id, ERR_INVALID_VALUE );

    //     let market = table::borrow_mut(&mut global.markets, market_id);

    //     market.market_name = market_name;
    //     market.market_url = market_url;
    // }

    // Updates the market start and end time
    public entry fun update_market_start_and_end_time(global: &mut MarketGlobal, market_id:u64, start_time: u64, end_time: u64, ctx: &mut TxContext ) {
        // Ensure that the caller has permission
        verify_caller( global, tx_context::sender(ctx) ); 
        assert!( end_time >= tx_context::epoch(ctx), ERR_INVALID_VALUE );
        assert!( end_time > start_time, ERR_INVALID_VALUE );
 
        let market = get_mut_market(global, market_id);

        assert!( market.is_resolved == false, ERR_ALREADY_RESOLVED );

        market.start_time = start_time;
        market.end_time = end_time;
    }

    // Update the prize odds
    public entry fun update_prize_odds(global: &mut MarketGlobal, market_id: u64, odds_list: vector<u64>, ctx: &mut TxContext ) {
        assert!( vector::length(&odds_list) > 0 , ERR_EMPTY );
        
        // Ensure that the caller has permission
        verify_caller( global, tx_context::sender(ctx) );  

        let market = get_mut_market(global, market_id);

        assert!( market.is_resolved == false, ERR_ALREADY_RESOLVED );

        market.prize_odds = odds_list;

        // let mut count = 0;
        // let total = vector::length( &odds_list );

        // while (count < total) {
        //     let value = *vector::borrow( &odds_list, count );
        //     *table::borrow_mut( &mut market.prize_odds, count+start_prize_id) = value;
        //     count = count+1;
        // };

    }

    public entry fun pause_market(global: &mut MarketGlobal, market_id: u64, ctx: &mut TxContext) {
        // Ensure that the caller has permission
        verify_caller( global, tx_context::sender(ctx) ); 
        let market = get_mut_market(global, market_id);
        market.is_paused = true;
    }

    public entry fun unpause_market(global: &mut MarketGlobal, market_id: u64, ctx: &mut TxContext) {
        // Ensure that the caller has permission
        verify_caller( global, tx_context::sender(ctx) ); 
        let market = get_mut_market(global, market_id);
        market.is_paused = false;
    }


    public entry fun resolve_market(
        global: &mut MarketGlobal, 
        market_id: u64, 
        start_prize_id: u64, 
        winnings_list: vector<u64>,
        ctx: &mut TxContext
    ) {
        assert!( vector::length(&winnings_list) > 0 , ERR_EMPTY );
        
        // Ensure that the caller has permission
        verify_caller( global, tx_context::sender(ctx) ); 

        let market = get_mut_market(global, market_id);

        assert!( vector::length(&winnings_list) == vector::length(&market.prize_odds), ERR_INVALID_LENGTH );

        market.winning_teams = winnings_list;

        // let mut count = 0;
        // let total = vector::length( &winnings_list );

        // while (count < total) {
        //     let team_id = *vector::borrow( &winnings_list, count );

        //     // Prevent exceeding max prize slots
        //     assert!(count + start_prize_id < MAX_PRIZES, ERR_EXCEEDS_MAX_PRIZES);

        //     if (table::contains( &market.winning_teams, count+start_prize_id)) { 
        //         *table::borrow_mut( &mut market.winning_teams, count+start_prize_id ) = team_id;
        //     } else { 
        //         table::add( &mut market.winning_teams, count+start_prize_id, team_id );
        //     };

        //     count = count+1;
        // };

        // Mark market as resolved 
        market.is_resolved = true;

        // TODO: emit an event
    }


    // ======== Public Functions =========

    public fun get_mut_market(global: &mut MarketGlobal, market_id:u64) : &mut MarketStore { 
        assert!(table::contains(&global.markets, market_id), ERR_INVALID_MARKET);
        table::borrow_mut(&mut global.markets, market_id)
    }

    public fun get_market_start_and_end_time(global: &MarketGlobal, market_id: u64) : (u64, u64) {
        assert!( table::length(&global.markets) > market_id, ERR_INVALID_VALUE );
        let market = table::borrow( &global.markets, market_id );
        (market.start_time, market.end_time)
    }

    // public fun check_payout_amount( global: &MarketGlobal, position_id: u64): (u64) {
    //     calculate_payout_amount(global, position_id)
    // }

    // ======== Only Governance =========

    // Adds a given address to the whitelist.
    public entry fun add_address(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, caller_address: address) {
        let (found, _) = vector::index_of<address>(&global.ai_agent_list, &caller_address);
        assert!( found == false , ERR_DUPLICATED);
        vector::push_back(&mut global.ai_agent_list, caller_address );
    }

    // Removes a given address from the whitelist.
    public entry fun remove_address(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, caller_address: address) {
        let (found, index) = vector::index_of<address>(&global.ai_agent_list, &caller_address);
        assert!( found == true , ERR_NOT_FOUND);
        vector::swap_remove<address>(&mut global.ai_agent_list, index );
    }

    // Updates the maximum bet amount.
    public entry fun update_max_bet_amount(global: &mut MarketGlobal,  _manager_cap: &mut ManagerCap, new_max_bet_amount: u64) {
        assert!( new_max_bet_amount > 0, ERR_ZERO_VALUE );
        global.max_bet_amount = new_max_bet_amount;
    }

    // Updates the fee.
    public entry fun update_winning_fee(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, new_winning_fee: u64) {
        assert!( new_winning_fee > 0 && new_winning_fee <= 4000, ERR_INVALID_VALUE ); // No more 40%
        global.winning_fee = new_winning_fee;
    }

    // Updates the treasury address that receives the fee.
    public entry fun update_treasury_adddress(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, new_address: address) {
        global.treasury_address = new_address;
    }
    
    public entry fun emergency_topup(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, market_id: u64, sui: Coin<SUI>) {
        let sui_amount = coin::value(&sui);
        let market = get_mut_market(global, market_id);
        market.total_bets_amount = market.total_bets_amount+sui_amount;
        balance::join(&mut market.balance, coin::into_balance(sui));
    }

    public entry fun emergency_withdraw(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, market_id: u64, withdraw_amount: u64, to_address: address, ctx: &mut TxContext ) {
        let market = get_mut_market(global, market_id);
        assert!( market.total_bets_amount >=  withdraw_amount, ERR_INSUFFICIENT_AMOUNT);
        market.total_bets_amount = market.total_bets_amount-withdraw_amount;

        let withdrawn_balance = balance::split<SUI>(&mut market.balance, withdraw_amount);
        transfer::public_transfer(coin::from_balance(withdrawn_balance, ctx), to_address);
    }

    // ======== Internal Functions =========

    fun verify_caller(global: &MarketGlobal , caller_address: address) {
        let (found, _) = vector::index_of<address>(&global.ai_agent_list, &caller_address);
        assert!( found, ERR_UNAUTHORIZED );
    }

    // fun calculate_payout_amount(global: &MarketGlobal, position_id: u64) : u64 {
    //     assert!(table::contains(&global.positions, position_id), ERR_INVALID_POSITION);

    //     let current_position = table::borrow( &global.positions, position_id );
    //     let market_id = current_position.market_id;
    //     assert!(table::contains(&global.markets, market_id), ERR_INVALID_MARKET);

    //     let market = table::borrow(&global.markets, market_id);

    //     assert!( market.is_resolved == true, ERR_NOT_RESOLVED);

    //     let mut price_id_count = 0;

    //     while ( price_id_count < table::length(&market.winning_teams) ) {
    //         std::debug::print(&(price_id_count));

    //         winnings_count = winnings_count+1;
    //     };

    //     (1000)
    // }

    // ======== Test-related Functions =========

    #[test_only]
    /// Wrapper of module initializer for testing
    public fun test_init(ctx: &mut TxContext) {
        init(ctx)
    }

}
