import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import GameIslandsApp from "./GameIslandsApp";
import GameApp from "./GameApp";
import HighscoreApp from "./HighscoreApp";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/islands"
            element={
              <GameIslandsApp
                w={20}
                h={20}
                nIslands={12}
                clusterSpread={4}
                nBombs={24}
              />
            }
          />
          <Route path="/" element={<GameApp w={10} h={10} nBombs={10} />} />
          <Route path="highscores" element={<HighscoreApp />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
