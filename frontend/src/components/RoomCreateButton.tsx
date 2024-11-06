import { useNavigate } from 'react-router-dom';

const RoomCreateButton = () => {
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const response = await fetch('http://localhost:8080/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const roomUrl = new URL(response.url);
        if (roomUrl) navigate(roomUrl.pathname);
      } else {
        console.error('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div>
      <button onClick={createRoom}>방 개설</button>
    </div>
  );
};

export default RoomCreateButton;
