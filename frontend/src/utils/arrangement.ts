// 참여자 수에 따른 위치를 계산하는 함수
export const calculatePosition = (count: number, shortRadius: number, longRadius: number): [number, number][] => {
  const positions: [number, number][] = [];
  const centerX = 0;
  const centerY = 0;
  const angleDiff = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const angle = angleDiff * i;
    const x = centerX + longRadius * Math.sin(angle);
    const y = centerY + shortRadius * Math.cos(angle);
    positions.push([x, y]);
  }

  return positions;
};

// 화면 크기가 변경될 때 반지름을 재계산하는 함수
export const calculateRadius = (): [number, number] => {
  const newShortRadius = Math.floor(window.innerHeight * 0.3);
  const newLongRadius = Math.floor((newShortRadius * 4) / 3);
  return [newShortRadius, newLongRadius];
};
