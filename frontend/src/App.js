import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import GameIslandsApp from "./GameIslandsApp";
import HighscoreApp from "./HighscoreApp";

// images
import IslandsGamemode from "./assets/gamemodes/islandsGamemode.png";
import OpenseaGamemode from "./assets/gamemodes/openseaGamemode.png";
import ArchipelagoGamemode from "./assets/gamemodes/archipelagoGamemode.png";
import PacificoceanGamemode from "./assets/gamemodes/pacificoceanGamemode.png";

const queryClient = new QueryClient();

const gamemodes = [
  {
    name: "islands2032",
    label: "Islands",
    link: "/islands",
    img: IslandsGamemode,
    w: 20,
    h: 20,
    nBombs: 32,
    nLighthouses: 2,
    nIslands: 12,
    clusterSpread: 4,
  },
  {
    name: "opensea2032",
    label: "Open sea",
    link: "/opensea",
    img: OpenseaGamemode,
    w: 20,
    h: 20,
    nBombs: 32,
    nLighthouses: 2,
    nIslands: 0,
    clusterSpread: 4,
  },
  {
    name: "archipelago2032",
    label: "Archipelago",
    link: "/archipelago",
    img: ArchipelagoGamemode,
    w: 20,
    h: 20,
    nBombs: 32,
    nLighthouses: 3,
    nIslands: 20,
    clusterSpread: 2,
  },
  {
    name: "pacificocean2032",
    label: "Pacific Ocean",
    link: "/pacificocean",
    img: PacificoceanGamemode,
    w: 20,
    h: 20,
    nBombs: 32,
    nLighthouses: 1,
    nIslands: 6,
    clusterSpread: 2,
  },
];

const gamemodeRoutes = gamemodes.map((el) => ({
  path: el.link,
  element: <GameIslandsApp name={el.name} gamemodes={gamemodes} />,
}));

function App() {
  // const element = useRoutes();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-sky-200">
        <BrowserRouter>
          <Routes>
            {gamemodes.map((gamemode) => (
              <Route
                path={gamemode.link}
                element={
                  <GameIslandsApp name={gamemode.name} gamemodes={gamemodes} />
                }
                key={gamemode.name}
              />
            ))}
            <Route
              path="/"
              element={
                <GameIslandsApp
                  name={gamemodes[0].name}
                  gamemodes={gamemodes}
                />
              }
            />
            <Route path="/highscores" element={<HighscoreApp />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
