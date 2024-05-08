# Title
**Implementation of Pre-generated Rounds in Game Setup**

# Status
Accepted

# Context
In developing our gaming platform, we required a reliable method to manage and randomize player interactions seamlessly and fairly throughout the game's duration. A significant challenge was ensuring that every player knew their turn order from the beginning to enhance gameplay flow and strategic planning. This consideration led us to explore various strategies for efficiently initializing game rounds while accommodating dynamic player interactions such as text inputs and drawings.

# Decision
We decided to implement a system where all game rounds are pre-generated at the start of each game session as soon as the admin initiates the game. This involves:
1. Generating and shuffling player IDs to create a randomized yet fixed sequence for each round using a custom shuffle algorithm.
2. Pre-populating the database with entries for each round that will store players' texts and drawings.
3. Ensuring that each player's turn for the current and subsequent rounds is known from the start, thereby streamlining the flow of game sessions.

The backend code uses JavaScript functions for array shuffling and round table filling, combined with API calls to fetch and store necessary data for each round.

# Consequences

## Benefits:
- **Predictable Turn Order**: Players can strategize better knowing their turn order ahead of time, enhancing the overall gaming experience.
- **Reduced Real-Time Processing**: By minimizing the need for on-the-fly data generation and storage during gameplay, system load is significantly reduced, which can lead to smoother and faster game sessions.
- **Enhanced Data Organization**: Pre-generating rounds and storing them in the database simplifies data management and reduces errors related to real-time data handling.

## Challenges:
- **Database Load**: Initially populating the database with all necessary entries for rounds can lead to higher loads and potentially slower response times during game setup.
- **Complexity in Modification**: Any changes to the game's structure or player sequence once a game has started are difficult to implement due to the pre-generated nature of the round data.
- **Overhead in Error Handling**: Errors in the pre-game setup phase can cascade, requiring comprehensive error handling strategies to manage failures effectively during the round generation and data storage processes.

This decision aligns with our goals to provide a seamless, engaging, and fair gaming experience by effectively managing how rounds are created and sequenced right from the start of the game.

**References**
- https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions
