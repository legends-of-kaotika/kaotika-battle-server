# Kaotika Battle Server

This document provides an in-depth explanation of the Kaotika Battle Server's core logic, architecture, and internal mechanics. It is intended for experienced developers who need to understand how the game server operates, how game flow is managed, and how combat is resolved.

## 1. Core Architecture

The server is built using **Node.js** with **TypeScript**, leveraging the **Express** framework for basic HTTP server functionalities and **Socket.IO** for real-time bidirectional communication with mobile clients and web monitor.

-   **Main Entry Point**: [`index.ts`](index.ts) initializes the Express app, sets up Socket.IO, and listens for incoming connections.
-   **Socket Handling**: Centralized in [`src/sockets/handlers.ts`](src/sockets/handlers.ts), which then delegates events to specific handlers based on client type (Mobile or Web).
    -   [`src/sockets/listeners/globalHandlers.ts`](src/sockets/listeners/globalHandlers.ts): Common events like disconnections.
    -   [`src/sockets/listeners/mobileHandlers/`](src/sockets/listeners/mobileHandlers/): Events originating from mobile clients (players).
    -   [`src/sockets/listeners/webHandlers/`](src/sockets/listeners/webHandlers/): Events originating from web clients (battle monitor).
-   **Client Types**:
    -   **Mobile Clients**: Represent active players in the game. They send commands like attacking, joining battles, etc.
    -   **Web Client**: Act as the battle monitor, displaying the battle. Must be connected a single web client.

## 2. Game State Management ([`src/game.ts`](src/game.ts))

Global game state is primarily managed within [`src/game.ts`](src/game.ts). Key state variables include:

-   `GAME_USERS: Player[]`: Array of all players (including NPCs) currently in a game session. The player data will be updated in this array (HP, attributes, etc.)
-   `CONNECTED_USERS: Player[]`: Array of all players currently connected to the server via Socket.IO (this array is not directly related to the battle data).
-   `NPCS: Player[]`: Array of Non-Player Characters participating in the battle. They are fetched from the Kaotika's server. Each battle type has its own NPCs.
-   `BATTLES: Battle[]`: Array holding data defined battle scenarios. They are fetched from Kaotika's server.
-   `turn: number`: Current turn number in the round.
-   `round: number`: Current round number in the game.
-   `currentPlayer: Player | null`: The player whose turn it currently is.
-   `target: Player | null`: The player currently targeted for an action (currently only attack).
-   `gameCreated: boolean`, `gameStarted: boolean`: Flags indicating the game's status.
-   `idPlayerFirstTurn: string | null`: Stores the ID of a player who, through a luck effect, will start the next round first.

Functions in this file allow for modification of these state variables (e.g., `setCurrentPlayer()`, `setTarget()`, `increaseTurn()`, `increaseRound()`, `resetInitialGameValues()`).

## 3. Player Entity & Data Flow

The player's data and its transformation are central to the game.

-   **Interfaces**: [`src/interfaces/PlayerPopulated.ts`](src/interfaces/PlayerPopulated.ts) defines the raw player data structure from Kaotika's API. [`src/interfaces/Player.ts`](src/interfaces/Player.ts) defines the in-game player object used during battles. [`src/interfaces/Attribute.ts`](src/interfaces/Attribute.ts) defines player statistics.
-   **Data Parsing ([`src/helpers/player.ts`](src/helpers/player.ts) -> `parsePlayerData()`):**
    1.  Takes `PlayerPopulated` data as input.
    2.  **Base Attributes Calculation**: `calculateBaseAttributes()` sums the player's inherent stats with modifiers from all equipped items (weapon, armor, shield, etc.) to get the *base combat attributes*.
    3.  **Derived Combat Stats Calculation**: Based on these summed base attributes, further combat-critical stats are calculated:
        -   `hit_points`: `Constitution + Dexterity - Insanity / 2`
        -   `attack`: `Strength - Insanity / 2`
        -   `defense`: `Dexterity + Constitution + Intelligence / 2`
        -   `magic_resistance`: `Intelligence + Charisma`
        -   `CFP` _(Critical/Fumble Percentage)_: `Insanity`
        -   `BCFA`: `Strength + Insanity`
    4.  The result is a `Player` object with both `base_attributes` (post-equipment sum) and `attributes` (the final combat-ready stats including derived ones).
-   **Role Assignment ([`src/helpers/player.ts`](src/helpers/player.ts) -> `assignRole()`):** Players are assigned roles "acolyte", "mortimer", "villain", or "istvan" based on their email address (configured via environment variables). The "mortimer" and "villain" roles are assigned to game administrators, who have elevated permissions to manage the game session, such as selecting the battle type and starting the game.

## 4. Game Lifecycle & Flow

This section details the progression of a game session, reflecting the login and setup flow as implemented in the architecture:

1. **Authentication & Connection**
   - Players log in via Firebase on their mobile device.
   - The mobile client establishes a Socket.IO connection to the server.
   - Upon connection, the client emits `mobile-signIn` with the user's email.
   - The server inserts the user into the `CONNECTED_USERS` array and responds to the client with their player data so they can display it. 
   - When the web client connects, emits `WEB_CLIENT_SOCKET_ID` to the server to manage it different from the mobile clients.

2. **Fetching Available Battles (Missions)**
   - If the logged player is Mortimer or Villain, the mobile client emits `mobile-getBattles` to request the list of available missions (battles).
   - The server fetches battles from the Kaotika API (`GET /api/v1/mission/all`), stores them in a global variable, and emits `battles` with the array of available battles to mortimer or villain so they can select one.

3. **Mission Selection or Creation**
   - When a Mortimer or Villain selects a mission, the mobile client emits `mobile-selectedBattle` with the chosen battle ID.
   - The server emits `selectedBattle` to the web client (battle monitor) with the relevant battle data.
   - If the Mortimer or Villain emits `mobile-createGame`, the server:
     - Stores the selected mission ID.
     - Emits `isGameCreated` to all mobile clients.
     - Notifies the web client to create the battle and inserts bots/NPCs as needed.

4. **Joining a Game**
   - If a game is already configured, players can join by emitting `mobile-joinBattle` with their player ID.
   - The server responds with `joinedToBattle` and sends user data to the web client for display.

5. **Game Start**
   - Once the game is configured and all required players are present, a privileged user (Mortimer or Villain) initiates the game start.
   - The server emits `isGameStarted` to all clients, signaling the start of the battle.

6. **Turn Management & Combat**
   - The game proceeds in turns, managed by the server (see Section 5 for details).
   - The server tracks the current player, manages timers, and handles both player and NPC actions.

7. **Win/Loss & Reset**
   - After each turn or significant event, the server checks for win/loss conditions.
   - If a faction wins, the server emits `sendGameEnd` with the result.
   - The game state can be reset for a new session via the appropriate event.

## 5. Combat Mechanics

Combat is the core interaction, resolved primarily within `attackFlow()` in `src/helpers/game.ts`, which orchestrates calls to helper modules like [`attack.ts`](src/helpers/attack.ts), [`luck.ts`](src/helpers/luck.ts), and `fumble.ts`.

1.  **Attack Initiation**:
    -   A player (mobile client) sends a `PLAYER_ATTACK` event with the `targetId`.
    -   An NPC's turn triggers `npcAttack()`, which selects a target (usually a random Kaotika player) and then calls `attackFlow()`.
2.  **Attribute Adjustment**: `adjustAtributes()` ([`attack.ts`](src/helpers/attack.ts)) is called for both attacker and target to round attributes and enforce min/max values (e.g., Insanity 1-80).
3.  **Pre-computation & Rolls ([`attack.ts`](src/helpers/attack.ts))**: Essential values are calculated:
    -   `getAttackRoll()`: A d100 roll that primarily determines the attack's success.
    -   `getWeaponDieRoll()`: Simulates the attacker's weapon damage dice roll (e.g., 2d6+1).
    -   `getSuccessPercentage()`: `WeaponBasePercentage + (Dexterity / 2) + InsanityModifier + (Charisma / 6)`.
    -   `getCriticalPercentage()`: `AttackerCFP * SuccessPercentage / 100`.
    -   `getFumblePercentage()`: `(100 - SuccessPercentage) * AttackerCFP / 100`.
4.  **Initial Attack Outcome ([attack.ts](src/helpers/attack.ts) -> `getAttackType()`, then `attack()`)**: The `attackRoll` is compared against the calculated percentages:
    -   If `attackRoll <= criticalPercentage`: **Critical Hit**.
    -   Else if `attackRoll <= successPercentage`: **Normal Hit**.
    -   Else if `attackRoll <= (100 - fumblePercentage)`: **Failed Attack** (Miss, 0 damage).
    -   Else: **Fumble** (0 damage to target, potential self-effect). The `attack()` function then calculates a preliminary `dealedDamage` based on this type.
    
    > See [docs/Attack type.png](docs/Attack%20type.png) for graphic representation of the attack types.

5.  **Damage Calculation Formulas ([attack.ts](src/helpers/attack.ts))**: 
    -   `getNormalHitDamage()`: `ceil((WeaponRoll * AttackMod1 + AttackMod2) / DefenseMod)`. Ensures at least 1 damage.
    -   `getCriticalHitDamage()`: `ceil(AttackerBCFA / 5 + WeaponRoll * CritMod1 + CritMod2)`.
    *(AttackMod1/2, DefenseMod, CritMod1/2 are derived from [combatRules.ts](src/constants/combatRules.ts) based on attacker/defender stats.)*
6.  **Fumble Resolution ([fumble.ts](src/helpers/fumble.ts), if attackType is FUMBLE)**:
    -   The `target` is switched to the `attacker` (self-effect).
    -   `getCalculationFumblePercentile()`: Determines the severity of the fumble.
    -   `getFumbleEffect()`: Maps the percentile to a specific `FumbleType` (Slash, Fairytale, Hack, Smash) from `EFFECTS_FUMBLE` in `combatRules.ts`.
    -   `getFumble()`: Calculates the consequence:
        -   **Slash**: Self-inflicted HP damage: `ceil((BCFA + WeaponDieRoll) / 10)`.
        -   **Fairytale**: Attacker gets `eruditoGlasses: true`. (Note: Current code applies Slash damage instead; a comment indicates "change later on").
        -   **Hack**: Attacker's `dexterity` is halved for the battle.
        -   **Smash**: Self-inflicted HP damage: `ceil((BCFA + WeaponDieRoll) / 5)`.
    -   The outcome (e.g., `{hit_points: X}` or `{dexterity: Y}`) becomes `dealedObjectDamage`.
7.  **Luck System ([`luck.ts`](src/helpers/luck.ts), if not a Fumble)**:
### LUCK

Luck rolls are performed every turn, both when attacking and defending.

**Number of Luck Rolls:**  
`NUM LUCK ROLLS = CHA / 20` (rounded down).

**Luck Roll Process:**
1. For each luck roll, roll 1D100:
    - If any roll is **less than 20**, the player **has luck** for this turn.
    - If all rolls are **20 or higher**, the player **does not have luck** this turn.

> **Note:** "Having luck" means the player qualifies for a potential luck effect, but the actual impact ("luck having effect") depends on a second roll.

**Determining the Luck Effect:**  
If the player has luck (i.e., at least one luck roll < 20), roll 1D100 again to determine the effect:

| D100 Roll | LUCK Effect                                                                                         |
|-----------|----------------------------------------------------------------------------------------------------|
| 81-100    | Next round, the player starts first. (Only one player per round may receive this; if a second player qualifies, the result is ignored.) |
| 60-80     | When attacking, a normal attack is upgraded to critical damage.                                    |
| 50-59     | Attacking: Normal attack, `ATT mod 2` is increased by 80%.<br>Defending: No magic damage received. |
| 36-49     | Attacking: Normal attack, `ATT mod 2` is increased by 40%.<br>Defending: No magic damage received. |
| 16-35     | Attacking: Normal attack, `ATT mod 2` is increased by 20%.<br>Defending: No magic damage received. |
| 1-15      | When defending, the player receives no damage.                                                     |

**Clarification:**  
A player can "have luck" by passing the initial luck roll, but the luck may "have no effect" if the subsequent effect roll results in an outcome that does not influence the current situation. For example, if the attack type is already critical, and the user has 60-80 luck, the luck roll won't have any additional effect since the attack is already critical.

8.  **Damage Application ([`src/helpers/player.ts`](src/helpers/player.ts) -> `applyDamage()`)**: The final `dealedObjectDamage` (HP loss or attribute change from fumble) is applied to the target player's `attributes` in the `GAME_USERS` array.
9.  **Death Check & Handling ([`src/helpers/player.ts`](src/helpers/player.ts))**: After damage application, implicitly, the game checks if `target.attributes.hit_points <= 0`.
    -   `findPlayerDeadId()` can identify such players.
    -   `handlePlayerDeath()` is called: emits `KILLED_PLAYER`, removes player from `GAME_USERS`, and checks if `isGameEnded()` results in game end.
10. **Reporting ([`attack.ts`](src/helpers/attack.ts) -> `parseAttackData()`)**: All details of the attack (rolls, percentages, damage, luck outcomes, fumble info) are compiled into an `AttackJson` object.
11. **Broadcasting**: `sendAttackInformationToWeb()` emits this `AttackJson` to all web clients.

## 6. Socket Communication (`src/sockets/`)

All Socket.IO events are defined in [[`src/constants/sockets.ts`](src/constants/sockets.ts)](src/constants/sockets.ts) and handled in the `src/sockets/` directory. Below is a comprehensive, list of all socket events, grouped by EMITS (server-to-client) and LISTENERS (client-to-server), and by context (Mobile, Web, Shared).

### EMITS (Server-to-Client)
| Event Name                   | Context      | Description |
|------------------------------|-------------|-------------|
| `web-setSelectedPlayer`      | Web         | Notifies web client of a selected player. |
| `web-sendUser`               | Web         | Sends user data to the web client. |
| `web-playerDisconnected`     | Web         | Notifies web client that a player has disconnected. |
| `web-currentRound`           | Web         | Sends the current round to the web client. |
| `web-attackInformation`      | Web         | Sends detailed attack information to the web client. |
| `web-turnFinished`           | Web         | Notifies web client that a turn has finished. |
| `web-joinedBattle`           | Web         | Notifies web client that it has joined a battle. |
| `mobile-insufficientPlayers` | Mobile      | Notifies mobile clients there are not enough players. |
| `connectedUsers`             | Shared      | Sends the list of currently connected users. |
| `gameReset`                  | Shared      | Notifies clients that the game has been reset. |
| `send-timer`                 | Shared      | Sends the current timer value. |
| `turn-start`                 | Shared      | Signals the start of a turn. |
| `assign-turn`                | Shared      | Assigns turn to a player. |
| `gameStart`                  | Shared      | Signals the start of the game. |
| `updatePlayer`               | Shared      | Sends updated player data. |
| `removePlayer`               | Shared      | Notifies clients to remove a player. |
| `gameEnd`                    | Shared      | Announces the winner and ends the game. |
| `send-killedPlayer`          | Shared      | Notifies clients that a player has died. |
| `isGameCreated`              | Shared      | Notifies clients if a game has been created. |
| `battles`                    | Shared      | Sends available battles (missions) to clients. |
| `isGameStarted`              | Shared      | Notifies clients if the game has started. |

### LISTENERS (Client-to-Server)
| Event Name                   | Context      | Description |
|------------------------------|-------------|-------------|
| `web-sendUsers`              | Web         | Web client requests the list of users. |
| `web-sendSocketId`           | Web         | Web client sends its socket ID to the server. |
| `web-turnEnd`                | Web         | Web client notifies server that the turn has ended. |
| `web-attackAnimationEnd`     | Web         | Web client notifies server that attack animation has ended. |
| `web-stopTimer`              | Web         | Web client requests to stop the timer. |
| `web-createdBattle`          | Web         | Web client creates a new battle. |
| `web-selectedBattle`         | Web         | Web client selects a battle. |
| `mobile-signIn`              | Mobile      | Player attempts to log in (expects email and callback for response). |
| `mobile-gameStart`           | Mobile      | Initiates the game from a mobile client. |
| `mobile-setSelectedPlayer`   | Mobile      | Player selects a target player. |
| `mobile-selectHeal`          | Mobile      | Player selects to heal. |
| `mobile-selectCurse`         | Mobile      | Player selects to curse. |
| `mobile-selectUsePotion`     | Mobile      | Player selects to use a potion. |
| `mobile-attack`              | Mobile      | Player performs an attack (expects targetId and attack data). |
| `mobile-gameReset`           | Mobile      | Player requests to reset the game. |
| `mobile-createGame`          | Mobile      | Player requests to create a new game. |
| `mobile-getBattles`          | Mobile      | Player requests the list of available battles. |
| `mobile-isGameCreated`       | Mobile      | Player checks if a game is created. |
| `mobile-joinBattle`          | Mobile      | Player joins an existing battle. |
| `mobile-selectedBattle`      | Mobile      | Player selects a battle. |
| `mobile-isGameStarted`       | Mobile      | Player checks if the game has started. |
| `disconnect`                 | Shared      | Notifies server of client disconnection. |

## 7. Key Constants and Interfaces

-   **[`src/constants/combatRules.ts`](src/constants/combatRules.ts)**: Defines crucial lookup tables and rules for attack modifiers (e.g., `ATTACK_RULES_MOD1`, `INSANITY_RULES`), defense modifiers (`DEFENSE_RULES`), luck outcomes (`ATTACK_LUCK_RULES`, `DEFENSE_LUCK_RULES`), and fumble effects (`EFFECTS_FUMBLE`).
-   **[`src/constants/sockets.ts`](src/constants/sockets.ts)**: Centralized list of all Socket.IO event names.
-   **[`src/constants/messages.ts`](src/constants/messages.ts)**: User-facing messages for luck and fumble outcomes.
-   **[`src/constants/game.ts`](src/constants/game.ts)**: Game-specific constants like `TURN_TIMER`.
-   **[`src/interfaces/`](src/interfaces/)**: This directory contains all TypeScript interfaces defining the shape of data objects like `Player.ts`, `Attribute.ts`, `Equipment.ts`, `AttackJson.ts`, `Luck.ts`, `Fumble.ts`, `Battles.ts`, etc. Understanding these is key to understanding data flow.