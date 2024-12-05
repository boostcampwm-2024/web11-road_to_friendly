export const getRemainingSeconds = (a: Date, b: Date) => Math.trunc((a.getTime() - b.getTime()) / 1000);

export const convertSecToHHMMSS = (sec: number, minParts: number = 2) => {
  const hour = Math.floor(sec / 3600);
  const minute = Math.floor((sec % 3600) / 60);
  const second = sec % 60;

  const HHMMSSArray = [hour, minute, second].map((val: number) => (val < 10 ? `0${val}` : `${val}`));

  let isPrevExist = false;
  const filteredParts = HHMMSSArray.filter((part: string, idx: number) => {
    if (isPrevExist || Number(part) > 0 || HHMMSSArray.length - idx <= minParts) {
      isPrevExist = true;
      return true;
    }
    return false;
  });

  return filteredParts.join(':');
};
