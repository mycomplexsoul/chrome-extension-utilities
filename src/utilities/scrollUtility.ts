import { scrollDown } from './utility';

type Selectors = {
  SCROLL_TOGGLE_BTN: string;
  SCROLL_SPEED_INPUT: string;
};

export type ScrollControls = {
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  setSpeed: (speed: number) => void;
  syncState: () => void;
};

export const attachScrollControls = (opts: { selectors: Selectors; initialSpeed?: number }): ScrollControls => {
  const { selectors } = opts;
  let scrollSpeed = opts.initialSpeed || 25;
  let isScrollPaused = false;

  const updateBtn = () => {
    const scrollBtn = document.getElementById(selectors.SCROLL_TOGGLE_BTN);
    if (scrollBtn) {
      scrollBtn.textContent = isScrollPaused ? '▶️' : '⏸️';
      scrollBtn.title = isScrollPaused ? 'Reanudar scroll' : 'Pausar scroll';
    }
  };

  const pause = () => {
    if ((window as any).SH) {
      if ((window as any).SH.interval) {
        window.clearInterval((window as any).SH.interval);
        (window as any).SH.interval = 0;
      }
      (window as any).SH.active = false;
    }
    isScrollPaused = true;
    updateBtn();
  };

  const resume = () => {
    if (!(window as any).SH?.speed) {
      return;
    }
    if (!isScrollPaused) {
      return;
    }
    scrollDown(scrollSpeed);
    isScrollPaused = false;
    updateBtn();
  };

  const toggle = () => {
    if (isScrollPaused) {
      resume();
    } else {
      pause();
    }
  };

  const setSpeed = (speed: number) => {
    if (!Number.isFinite(speed) || speed <= 0) {
      return;
    }
    scrollSpeed = speed;
    const speedInput = document.getElementById(selectors.SCROLL_SPEED_INPUT) as HTMLInputElement | null;
    if (speedInput) {
      speedInput.value = String(speed);
    }
    if (!isScrollPaused && (window as any).SH?.active) {
      scrollDown(scrollSpeed);
    }
  };

  const syncState = () => {
    isScrollPaused = false;
    scrollSpeed = (window as any).SH?.speed || scrollSpeed;
    const speedInput = document.getElementById(selectors.SCROLL_SPEED_INPUT) as HTMLInputElement | null;
    if (speedInput) {
      speedInput.value = String(scrollSpeed);
    }
    updateBtn();
  };

  // attach listeners
  try {
    const scrollBtn = document.getElementById(selectors.SCROLL_TOGGLE_BTN);
    if (scrollBtn) {
      scrollBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
      });
    }

    const speedInput = document.getElementById(selectors.SCROLL_SPEED_INPUT) as HTMLInputElement | null;
    if (speedInput) {
      speedInput.addEventListener('click', (e) => e.stopPropagation());
      speedInput.addEventListener('mousedown', (e) => e.stopPropagation());
      speedInput.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const newSpeed = parseInt(target.value, 10);
        if (Number.isFinite(newSpeed) && newSpeed > 0) {
          setSpeed(newSpeed);
        }
      });
    }
  } catch (err) {
    // defensive: DOM might not be ready when called
  }

  return { pause, resume, toggle, setSpeed, syncState };
};
