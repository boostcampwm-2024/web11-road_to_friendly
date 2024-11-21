import { useEffect, useState } from 'react';

export function useTimeout(duration: number): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [timeover, setTimeover] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeover(true);
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return [timeover, setTimeover];
}
