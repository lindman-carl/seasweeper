import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import GameApp from "./components/Game";
import HighscoresApp from "./components/Highscore/HighscoresApp";

// images
import IslandsGamemode from "./assets/gamemodes/islandsGamemode.png";
import OpenseaGamemode from "./assets/gamemodes/openseaGamemode.png";
import ArchipelagoGamemode from "./assets/gamemodes/archipelagoGamemode.png";
import PacificoceanGamemode from "./assets/gamemodes/pacificoceanGamemode.webp";

const queryClient = new QueryClient();

const gamemodes = [
  {
    name: "islands2032",
    label: "Islands",
    link: "/islands",
    img: IslandsGamemode,
    w: 20,
    h: 20,
    numBombs: 32,
    nLighthouses: 2,
    nIslands: 12,
    clusterSpread: 4,
    id: 0,
  },
  {
    name: "kidspool1010",
    label: "Kiddie pool",
    link: "/kidspool",
    img: PacificoceanGamemode,
    w: 10,
    h: 10,
    numBombs: 10,
    nLighthouses: 0,
    nIslands: 0,
    clusterSpread: 2,
    id: 1,
  },
  {
    name: "archipelago2032",
    label: "Archipelago",
    link: "/archipelago",
    img: ArchipelagoGamemode,
    w: 20,
    h: 20,
    numBombs: 32,
    nLighthouses: 3,
    nIslands: 20,
    clusterSpread: 2,
    id: 2,
  },
  {
    name: "pacificocean2032",
    label: "Pacific Islands",
    link: "/pacificocean",
    img: PacificoceanGamemode,
    w: 20,
    h: 20,
    numBombs: 32,
    nLighthouses: 1,
    nIslands: 6,
    clusterSpread: 2,
    id: 3,
  },
  {
    name: "opensea2032",
    label: "Open sea",
    link: "/opensea",
    img: OpenseaGamemode,
    w: 20,
    h: 20,
    numBombs: 32,
    nLighthouses: 0,
    nIslands: 0,
    clusterSpread: 4,
    id: 4,
  },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-sky-200">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <GameApp name={gamemodes[0].name} gamemodes={gamemodes} />
              }
            />
            <Route
              path="/highscores"
              element={<HighscoresApp gamemodes={gamemodes} />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
