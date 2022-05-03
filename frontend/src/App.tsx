import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

// components
import GameApp from "./components/Game";

import { gamemodes } from "./gamemodes";
import { GameStateProvider } from "./hooks/gameStateContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameStateProvider>
        <div className="bg-sky-200">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <GameApp name={gamemodes[0].name} gamemodes={gamemodes} />
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </GameStateProvider>
    </QueryClientProvider>
  );
}

export default App;
