import { Routes, Route } from 'react-router-dom';

import LandingPage from '@/pages/LandingPage';

import Room from '@/pages/room/Room';
import { GlobalStyle } from '@/styles/GlobalStyle';

import { ToastProvider } from './contexts';

function App() {
  return (
    <>
      <GlobalStyle />
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/rooms/:roomId" element={<Room />} />
        </Routes>
      </ToastProvider>
    </>
  );
}

export default App;
