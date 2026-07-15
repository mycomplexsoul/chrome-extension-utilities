const getLocalStorageUsage = () => {
  let used = 0,
    item = null;
  let data: {
    details: { item: string; used: number; usedInKB: string }[];
    total: number;
    totalInKB: string;
  } = { details: [], total: 0, totalInKB: "0" };

  for (item in localStorage) {
    if (!localStorage.hasOwnProperty(item)) {
      continue;
    }
    used = (localStorage[item].length + item.length) * 2;
    data.total += used;

    data.details.push({
      item,
      used,
      usedInKB: (used / 1024).toFixed(2),
    });
  }

  data.totalInKB = (data.total / 1024).toFixed(2);
  return data;
};

declare global {
  interface Window {
    SH?: {
      speed: number;
      dir: number;
      interval: number;
    };
  }
}

const scrollDown = (speed?: number) => {
  if (!window.SH) {
    window.SH = { speed: 0, dir: 1, interval: 0 };
  }
  if (window.SH.interval) {
    clearInterval(window.SH.interval);
    window.SH.interval = 0;
  }
  if (speed !== undefined) {
    window.SH.speed = speed;
  } else {
    window.SH.speed = parseInt(prompt("speed?", "25") ?? "25");
  }
  if (window.SH.speed) {
    const dir = window.SH.speed > 0 ? 1 : -1;
    window.SH.interval = window.setInterval(function () {
      window.scrollBy(0, dir);
    }, window.SH.speed * dir);
  }
};

export {
  getLocalStorageUsage,
  scrollDown,
};
