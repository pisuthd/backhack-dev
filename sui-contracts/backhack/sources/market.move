
// Market prediction on hackathon results enables users to bet  
// on teams using SUI, while an AI agent dynamically updates odds  
// and verifies results for payouts.  

module backhack::market {
 
    use sui::sui::SUI; 
    use sui::transfer; 
    use sui::event::emit;
    use sui::coin::{Self, Coin};
    use sui::tx_context::{ Self, TxContext};
    use sui::table::{ Self, Table};
    use sui::balance::{ Self, Supply, Balance};

    use backhack::fixed_point64::{Self, FixedPoint64};

    // ======== Constants ========

    const SCALE: u64 = 10000; // Scaling factor for fixed-point calculations
    const DEFAULT_WINNING_FEE: u64 = 1000; // Default commission fee
    const DEFAULT_MAX_BET_AMOUNT: u64 = 1_000000000; // 1 SUI 

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
    const ERR_INVALID_TEAM: u64 = 16;
    const ERR_NO_PAYOUT: u64 = 17;
    const ERR_NOT_HOLDER: u64 = 18;
    const ERR_ALREADY_CLAIMED: u64 = 19;
    const ERR_MARKET_NOT_CLOSED: u64 = 20;

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
        end_time: u64, // Hackathon end timestamp in epoch (Not Deadline Submission)
        total_bets: Table<u64, u64>, // Mapping: Team ID -> Total bet amount
        total_bets_amount: u64,
        team_ids: vector<u64>,
        prize_odds: vector<u64>, // Mapping: Prize ID -> Odds multiplier
        total_prize_odds: u64,
        winning_teams: vector<u64>, // Mapping of Prize ID -> Winning Team ID
        balance: Balance<SUI>, // SUI assets locked in the market
        is_resolved: bool, // Whether the market has been resolved 
        is_paused: bool // whether the market is currently paused
    }

    // The global state
    public struct MarketGlobal has key {
        id: UID, // Object ID
        manager_list: vector<address>, // List of addresses with management permissions
        markets: Table<u64, MarketStore>, // Mapping: Market ID -> MarketStore
        positions: Table<u64, Position>, // Mapping: Position ID -> User's betting position
        max_bet_amount: u64, // Maximum allowable bet per position 
        winning_fee: u64, // Commission fee taken from winnings 
    }

    public struct AddMarketEvent has copy, drop {
        global: ID,
        market_id: u64,
        start_time: u64,
        end_time: u64,
        epoch: u64,
        sender: address
    }

    public struct ResolveMarketEvent has copy, drop {
        global: ID,
        market_id: u64,
        winnings_list: vector<u64>,
        epoch: u64,
        sender: address
    }

    public struct PlaceBetEvent has copy, drop {
        global: ID,
        market_id: u64,
        predicted_team: u64,
        bet_amount: u64,
        position_id: u64,
        epoch: u64, 
        sender: address
    }

    public struct ClaimPrizeEvent has copy, drop {
        global: ID,
        position_id: u64,
        payout_amount: u64,
        epoch: u64, 
        sender: address
    }

    fun init(ctx: &mut TxContext) {

        transfer::transfer(
            ManagerCap {id: object::new(ctx)},
            tx_context::sender(ctx)
        );

        // Create a new list for adding to the global state
        let mut manager_list = vector::empty<address>();
        vector::push_back<address>(&mut manager_list, tx_context::sender(ctx));

        // Initialize the global state
        let global = MarketGlobal {
            id: object::new(ctx),
            manager_list,
            markets: table::new<u64, MarketStore>(ctx),
            positions: table::new<u64, Position>(ctx),
            max_bet_amount: DEFAULT_MAX_BET_AMOUNT,
            winning_fee: DEFAULT_WINNING_FEE
        };

        transfer::share_object(global)
    }

    // ======== Entry Functions =========

    // Allows a user to place a bet on the given market and team
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

        // Emit an event
        emit(
            PlaceBetEvent {
                global: object::id(global),
                market_id,
                predicted_team: team_id,
                bet_amount,
                position_id,
                epoch: tx_context::epoch(ctx),
                sender: tx_context::sender(ctx)
            }
        )

    }

    // Allows a user to claim their prize
    public entry fun claim_prize( global: &mut MarketGlobal, position_id: u64, ctx: &mut TxContext) {
        // Calculate the payout amount for the position
        let payout_amount = calculate_payout_amount(global, position_id);
        let current_position = table::borrow_mut( &mut global.positions, position_id );
        assert!( current_position.holder == tx_context::sender( ctx ) , ERR_NOT_HOLDER);
        assert!( current_position.is_open == true , ERR_ALREADY_CLAIMED);
        
        let market = table::borrow_mut( &mut global.markets , current_position.market_id );

        assert!( tx_context::epoch(ctx) >= market.end_time, ERR_MARKET_NOT_CLOSED );
        assert!( market.is_paused == false, ERR_PAUSED );

        // If there is a payout amount to be claimed
        if ( payout_amount > 0 ) {

            // takes a fee if there's a surplus            
            if ( payout_amount > current_position.amount) {
                // Apply a fee when the payout amount exceeds the original bet amount 
                let fee_ratio = fixed_point64::create_from_rational( (global.winning_fee as u128), 10000);
                let surplus_amount = payout_amount-current_position.amount;
                let fee_amount = (fixed_point64::multiply_u128( (surplus_amount as u128) , fee_ratio) as u64); 

                let payout_balance = balance::split<SUI>(&mut market.balance, payout_amount-fee_amount);
                transfer::public_transfer(coin::from_balance(payout_balance, ctx), tx_context::sender(ctx));
            } else {
                // If there is no surplus, transfer the full payout amount to the position holder
                let withdrawn_balance = balance::split<SUI>(&mut market.balance, payout_amount);
                transfer::public_transfer(coin::from_balance(withdrawn_balance, ctx), tx_context::sender(ctx));
            };
            
        };

        // Mark the position as claimed
        current_position.is_open = false;

        // Emit an event
        emit(
            ClaimPrizeEvent {
                global: object::id(global),
                position_id,
                payout_amount,
                epoch: tx_context::epoch(ctx),
                sender: tx_context::sender(ctx)
            }
        )
    }

    public entry fun get_bet_position(global: &MarketGlobal, position_id: u64): (u64, u64, u64, address, u64, bool ) {
        let entry = table::borrow( &global.positions, position_id );
        ( entry.market_id, entry.predicted_team, entry.amount, entry.holder, entry.epoch, entry.is_open )
    }

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

        let mut total_prize_odds = 0;
        let mut prize_count = 0;

        while (prize_count < vector::length(&prize_odds)) {
            total_prize_odds = total_prize_odds+*vector::borrow( &prize_odds, prize_count);
            prize_count = prize_count+1;
        };

        let new_market = MarketStore {
            start_time,
            end_time,
            total_bets: table::new<u64, u64>(ctx),
            total_bets_amount: 0,
            team_ids: vector::empty<u64>() ,
            prize_odds,
            total_prize_odds,
            winning_teams: vector::empty<u64>(),
            balance: balance::zero<SUI>(),
            is_resolved: false,
            is_paused: false
        };

        table::add( &mut global.markets, market_id, new_market );

        emit(
            AddMarketEvent {
                global: object::id(global),
                market_id,
                start_time,
                end_time,
                epoch: tx_context::epoch(ctx),
                sender: tx_context::sender(ctx)
            }
        )

    }

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

        let mut total_prize_odds = 0;
        let mut prize_count = 0;

        while (prize_count < vector::length(&odds_list)) {
            total_prize_odds = total_prize_odds+*vector::borrow( &odds_list, prize_count);
            prize_count = prize_count+1;
        };

        market.prize_odds = odds_list;
        market.total_prize_odds = total_prize_odds;
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
        winnings_list: vector<u64>,
        ctx: &mut TxContext
    ) {
        assert!( vector::length(&winnings_list) > 0 , ERR_EMPTY );
        
        // Ensure that the caller has permission
        verify_caller( global, tx_context::sender(ctx) ); 

        let market = get_mut_market(global, market_id);

        // Ensure the number of winners matches the number of prize tiers
        assert!( vector::length(&winnings_list) == vector::length(&market.prize_odds), ERR_INVALID_LENGTH );

        // Assign the winning teams from the provided list
        market.winning_teams = winnings_list;

        // Mark market as resolved 
        market.is_resolved = true;

        // Emit an event
        emit(
            ResolveMarketEvent {
                global: object::id(global),
                market_id,
                winnings_list,
                epoch: tx_context::epoch(ctx),
                sender: tx_context::sender(ctx)
            }
        )
    
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

    public fun check_payout_amount( global: &MarketGlobal, position_id: u64): (u64) {
        calculate_payout_amount(global, position_id)
    }

    // ======== Only Governance =========

    // Adds a given address to the whitelist.
    public entry fun add_address(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, caller_address: address) {
        let (found, _) = vector::index_of<address>(&global.manager_list, &caller_address);
        assert!( found == false , ERR_DUPLICATED);
        vector::push_back(&mut global.manager_list, caller_address );
    }

    // Removes a given address from the whitelist.
    public entry fun remove_address(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, caller_address: address) {
        let (found, index) = vector::index_of<address>(&global.manager_list, &caller_address);
        assert!( found == true , ERR_NOT_FOUND);
        vector::swap_remove<address>(&mut global.manager_list, index );
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

    // Allows to deposit additional SUI in case of emergency
    public entry fun emergency_topup(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, market_id: u64, sui: Coin<SUI>) {
        let sui_amount = coin::value(&sui);
        let market = get_mut_market(global, market_id);
        market.total_bets_amount = market.total_bets_amount+sui_amount;
        balance::join(&mut market.balance, coin::into_balance(sui));
    }

    // Allows the manager to withdraw funds including fees
    public entry fun emergency_withdraw(global: &mut MarketGlobal, _manager_cap: &mut ManagerCap, market_id: u64, withdraw_amount: u64, to_address: address, ctx: &mut TxContext ) {
        let market = get_mut_market(global, market_id);
        assert!( market.total_bets_amount >=  withdraw_amount, ERR_INSUFFICIENT_AMOUNT);
        market.total_bets_amount = market.total_bets_amount-withdraw_amount;

        let withdrawn_balance = balance::split<SUI>(&mut market.balance, withdraw_amount);
        transfer::public_transfer(coin::from_balance(withdrawn_balance, ctx), to_address);
    }

    // ======== Internal Functions =========

    fun verify_caller(global: &MarketGlobal , caller_address: address) {
        let (found, _) = vector::index_of<address>(&global.manager_list, &caller_address);
        assert!( found, ERR_UNAUTHORIZED );
    }

    fun calculate_payout_amount(global: &MarketGlobal, position_id: u64) : u64 {
        assert!(table::contains(&global.positions, position_id), ERR_INVALID_POSITION);

        let current_position = table::borrow( &global.positions, position_id );
        let market_id = current_position.market_id;
        let team_id = current_position.predicted_team;
        assert!(table::contains(&global.markets, market_id), ERR_INVALID_MARKET);
        
        let market = table::borrow(&global.markets, market_id);

        assert!( market.is_resolved == true, ERR_NOT_RESOLVED);
        let (found, _) = vector::index_of<u64>(&market.team_ids, &team_id); 
        assert!( found == true, ERR_INVALID_TEAM );

        let mut prize_count = 0; 
        let mut total_payout = 0;

        while ( prize_count < vector::length(&market.winning_teams) ) {
            
            let this_team = *vector::borrow( &market.winning_teams, prize_count);
            let this_odds = *vector::borrow( &market.prize_odds, prize_count);
            
            if ( this_team == team_id ) {
                
                let prize_share_ratio = fixed_point64::create_from_rational( (this_odds as u128), ( market.total_prize_odds as u128 ) );
                
                // Calculate the total amount allocated to this team's winners
                let prize_share_amount = (fixed_point64::multiply_u128( (market.total_bets_amount as u128) , prize_share_ratio) as u64); 
                
                // Get the total amount staked on this team
                let team_bet_total = *table::borrow( &market.total_bets, this_team );

                // Find this position's share in the team's total bets  
                let position_share = fixed_point64::create_from_rational( (current_position.amount as u128), ( team_bet_total  as u128 ) );

                // Calculate the final amount to be distributed to this position
                let position_payout = (fixed_point64::multiply_u128( (prize_share_amount as u128), position_share) as u64);

                total_payout = total_payout+position_payout;
            };

            prize_count = prize_count+1;
        };

        (total_payout)
    }

    // ======== Test-related Functions =========

    #[test_only]
    /// Wrapper of module initializer for testing
    public fun test_init(ctx: &mut TxContext) {
        init(ctx)
    }

}
