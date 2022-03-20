import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import GameIslandsApp from "./GameIslandsApp";
import GameApp from "./GameApp";
import HighscoreApp from "./HighscoreApp";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-sky-200">
        <BrowserRouter>
          <Routes>
            <Route
              path="/islands"
              element={
                <GameIslandsApp
                  w={22}
                  h={22}
                  nIslands={14}
                  clusterSpread={4}
                  nBombs={32}
                  name="islands2232"
                />
              }
            />
            <Route path="/" element={<GameApp w={10} h={10} nBombs={10} />} />
            <Route path="highscores" element={<HighscoreApp />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
