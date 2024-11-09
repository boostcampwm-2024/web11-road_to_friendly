import { GlobalStyle } from './styles/GlobalStyle';
import { Routes, Route } from 'react-router-dom';
import Room from './pages/room/room';
import LandingPage from './pages/LandingPage';

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
