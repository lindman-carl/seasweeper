import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Game from "./components/Game";
import HighScores from "./components/HighScores";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="highscores" element={<HighScores />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
