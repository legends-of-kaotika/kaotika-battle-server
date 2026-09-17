# Kaotika Battle — Socket Contract & Architecture

This document is the single source of truth for the real-time contract between the
three Kaotika battle applications. It maps every Socket.IO event to its producer,
consumer, and payload, and flags the known contract drifts that must be resolved.

## 1. Applications

| App | Repo (local path) | Stack | Role |
| --- | --- | --- | --- |
| Mobile | `~/Documentos/NextJSProjects/kaotika-battle-mobile` | Vite + React + TS + Zustand + Firebase | Login, admin selects battle |
| **Battle server** | `~/Documentos/NodeProjects/kaotika-battle-server` | Node + TS + Express + Socket.IO | Game brain / state machine |
| Web | `~/Documentos/ReactProjects/kaotika-battle-web` | Vite + React + TS + framer-motion | Animated battle visualization |
| Kaotika API | `~/Documentos/NodeProjects/kaotika-server` | Express + Mongoose | Source of players / missions (REST) |

```
 Mobile  ──(Socket.IO)──►  Battle server  ◄──(Socket.IO)──  Web
   │                            │
   │                            └──(REST)──► Kaotika API  (/missions, /players/email/:email, /battle)
   └──(Firebase auth)──► Firebase
```

The battle server is the contract owner: it defines the event names
(`src/constants/sockets.ts`) and payload shapes (`src/interfaces/*`).

## 2. Connection model

- A single **web client** connects and registers itself via `web-sendSocketId`.
  Its socket id is stored in `webSocketId`; all web-bound events are emitted to
  that socket (`io.to(webSocketId).emit(...)`).
- **Mobile clients** join the `mobile` room (`socket.join('mobile')`).
  Broadcast events to mobiles use `io.to('mobile').emit(...)`.
- `GAME_USERS` holds players + NPCs in the current battle; `CONNECTED_USERS`
  holds logged-in sockets.

## 3. Event reference

### 3.1 Server → client (EMITS)

| Event | Target | Payload | Source |
| --- | --- | --- | --- |
| `connectedUsers` | web + broadcast | `{ kaotika: Player[], dravokar: Player[] }` | `emits/user.ts` |
| `web-setSelectedPlayer` | web | `string` (player `_id`) | `emits/user.ts` |
| `web-sendUser` | web | `Player` | `emits/user.ts` |
| `web-playerDisconnected` | web | `string` (nickname) | `emits/user.ts` |
| `web-selectHeal` | web | — | `emits/user.ts` |
| `web-selectCurse` | web | — | `emits/user.ts` |
| `web-selectUsePotion` | web | — | `emits/user.ts` |
| `web-joinedBattle` | web | `string` (player `_id`) | `mobileHandlers/user.ts` |
| `web-createdBattle` | web | `WebBattle` | `emits/game.ts` |
| `web-battleConfig` | web | `WebBattle` | `emits/game.ts` |
| `web-battleRewards` | web | `BattleOutcome` | `emits/game.ts` |
| `web-selectedBattle` | web | `WebBattle` | `emits/game.ts` |
| `web-currentRound` | web | `number` | `emits/game.ts` |
| `web-turnFinished` | web | — | `emits/game.ts` |
| `web-attackInformation` | web | `AttackJson` | `emits/user.ts` |
| `send-timer` | web | `number` | `emits/user.ts` |
| `assign-turn` | broadcast | `string` (player `_id`) | `emits/user.ts` |
| `gameStart` | broadcast | — | `emits/user.ts` |
| `updatePlayer` | `mobile` room | `{ _id, attributes, isBetrayer }` | `emits/user.ts` |
| `removePlayer` | broadcast | `string` (player `_id`) | `emits/user.ts` |
| `send-killedPlayer` | broadcast | `string` (player `_id`) | `emits/user.ts` |
| `gameEnd` | broadcast | `string` (winner, capitalized) | `emits/user.ts` |
| `gameReset` | broadcast | — | `game.ts` |
| `mobile-insufficientPlayers` | specific socket | — | `emits/user.ts` |
| `isGameCreated` | broadcast / specific socket | `boolean` | `emits/game.ts` |
| `isGameStarted` | specific socket | `boolean` | `mobileHandlers/user.ts` |

### 3.2 Client → server (LISTENERS)

| Event | Client | Payload | Ack callback |
| --- | --- | --- | --- |
| `mobile-signIn` | mobile | `email` | `{ status, player }` / `{ status, error }` |
| `mobile-getBattles` | mobile | — | `{ status, battles }` / `{ status, error }` |
| `mobile-joinBattle` | mobile | `playerId` | `{ status, joinBattle }` |
| `mobile-selectedBattle` | mobile | battle `_id` | — |
| `mobile-createGame` | mobile | battle `_id` | — |
| `mobile-gameStart` | mobile | — | — |
| `mobile-setSelectedPlayer` | mobile | player `_id` | — |
| `mobile-attack` | mobile | target `_id` | — |
| `mobile-selectHeal` | mobile | — | — |
| `mobile-selectCurse` | mobile | — | — |
| `mobile-selectUsePotion` | mobile | — | — |
| `mobile-gameReset` | mobile | — | — |
| `mobile-isGameCreated` | mobile | — | — |
| `mobile-isGameStarted` | mobile | — | — |
| `web-sendSocketId` | web | — | — |
| `web-sendUsers` | web | — | — |
| `web-attackAnimationEnd` | web | defender `_id` | — |
| `disconnect` | any | — | — |

### 3.3 Battle rewards (REST)

On game end (Kaotika wins), `kaotika-battle-server` calls the Kaotika API:

- `POST /battle` — body `{ battleID, players: [{ email, isAlive }] }`.
- kaotika-server (`services/battle/battleRewardsService.js`) resolves the mission
  by `battleID` and, for each winner: adds `exp` via the level-up algorithm
  (`checkIfLevelUpAndUpdatePlayer`), adds the full mission `gold`, and assigns a
  random item of `drop_item_level` **only to survivors** (`isAlive === true`).
- Response: `{ status: "OK", data: { gold, experience, playerRewards: [{ playerId, playerName, playerAvatar, item? }] } }`.
- The battle server wraps this into `BattleOutcome` (`{ winner, rewards }`) and
  emits `web-battleRewards` to the web client.

## 4. Known contract drifts

These must be decided and fixed. They are the reason the three apps can desync.

| # | Drift | Detail | Suggested owner |
| --- | --- | --- | --- |
| D1 | ~~Web expects `web-battleConfig`~~ | RESOLVED: backend now emits `web-battleConfig` on create/select, alongside `web-createdBattle`/`web-selectedBattle`. | Backend (done) |
| D2 | ~~`gameEnd` payload / rewards~~ | RESOLVED: kaotika-server `POST /battle` now applies gold (full per winner) + experience (level-up algorithm) + random item (survivors only) and returns rewards; battle-server emits `web-battleRewards` (`BattleOutcome`). | Backend + kaotika-server (done) |
| D3 | ~~`updatePlayer` payload~~ | RESOLVED: removed unused `totalDamage` from mobile `PlayerToUpdate`, mocks and listener type; server correctly sends `{ _id, attributes, isBetrayer }`. | Mobile (done) |
| D4 | ~~Dead mobile listeners~~ | RESOLVED: removed `listenToBattles`/`battles` and `PLAYER_DATA`/`playerData` dead listeners and constants from mobile. | Mobile (done) |
| D5 | ~~`web-turnTimeout` vs `web-turnFinished`~~ | RESOLVED: removed dead `web-turnTimeout` constant from web. | Web (done) |
| D6 | `web-selectHeal/Curse/UsePotion` | Server emits these; web has no constant or listener for them yet. | Web (implement) or Backend (remove) |
| D7 | ~~`turn-start` dead constant~~ | RESOLVED: removed from server `sockets.ts`. | Backend (done) |

## 5. Testing strategy

The battle server is the contract owner and the most important component to test.
Three layers:

1. **Unit tests** — pure game rules (dice, attack, luck, fumble, turn).
   Location: `src/__tests__/`.
2. **Contract / integration tests** — drive the server with mocked Socket.IO
   clients (`socket.io-client`), simulating a mobile client and the web client,
   and assert the exact sequence + payload of emitted events. This replaces
   cross-app E2E. Extend `src/__tests__/socket/emits.test.ts`.
3. **Protocol regression snapshot** — freeze event names + payload interfaces
   (`src/constants/sockets.ts`, `src/interfaces/*`) to catch accidental drift.

Long-term goal: extract `sockets.ts` + `interfaces/*` into a shared package
(`@kaotika/contract`) consumed by all three apps, eliminating duplicated
constants that drift (see section 4).
