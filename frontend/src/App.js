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
                w={10}
                h={10}
                nIslands={4}
                clusterSpread={2}
                nBombs={8}
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
