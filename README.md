# Sea Sweeper

[Sea Sweeper live demo](https://seasweeper.lindman.dev)

A modern take on the classic Minesweeper. The game features new gameplay mechanics that translates the game from the old boring land minesweeping to the fresh new fun sea sweeping. It features multiple game modes, that simulate different types of sea layouts. From vast open sea with no islands, to maps littered with small islands and inlets. More land = higher difficulty. The islands are intentionally blocky to provide a better gameplay experience.

The islands can sometimes put you in a tricky situations, that you would not encounter playing on land. For these situations I introduce the lighthouse mechanic. Lighthouses can be placed on land to safely reveal the surrounding sea tiles (up to eight tiles).
Placing flags (buoys) is for slow players, but you can if you want to.

glhf

## Lessons learned

- don't postpone testing
- e2e testing is really cool
- use ORM

## Gameplay mechanics

- minesweeping
- randomly generated island maps
- lighthouses

## Technologies used

- typescript
- javascript

### MERN Stack

- mongodb
- express
- react
- node.js

### Libraries

- axios
- cypress
- jest
- redux
- react-query
- react-router
- react-hook-form
- react-icons
- react-spinners
- react-tooltip

### Testing

- unit testing with jest
- e2e testing with cypress

### Styling

- tailwindcss
- fully responsive design

### Potential improvments to the code

- ~~redux~~, nope-dux
- cache instead of all those .find() please
- fix the spaghetti code, gamemode/board
- paging or limiting the highscores should be necessary with more entries

#### Missing e2e tests

- highscores / submitting highscores
- starting new game / retry
