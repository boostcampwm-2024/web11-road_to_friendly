import { Routes, Route } from 'react-router-dom';
import Room from './pages/room/room';
import RoomCreateButton from './components/RoomCreateButton';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RoomCreateButton />} />
        <Route path="/rooms/:roomId" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
