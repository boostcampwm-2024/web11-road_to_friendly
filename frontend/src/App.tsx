import { Routes, Route } from 'react-router-dom';

import LandingPage from '@/pages/LandingPage';

import Room from '@/pages/room/room';
import { GlobalStyle } from '@/styles/GlobalStyle';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rooms/:roomId" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
