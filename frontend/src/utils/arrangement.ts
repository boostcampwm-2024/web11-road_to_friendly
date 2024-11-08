// 참여자 수에 따른 위치를 계산하는 함수
export const calculatePosition = (count: number, radius: number): [number, number][] => {
  const positions: [number, number][] = [];
  const centerX = 0;
  const centerY = 0;
  const angleDiff = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const angle = angleDiff * i;
    const x = centerX + radius * Math.sin(angle);
    const y = centerY + radius * Math.cos(angle);
    positions.push([x, y]);
  }

  return positions;
};
