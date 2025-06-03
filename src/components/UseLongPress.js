import { useRef } from "react";

export function useLongPress(callback = () => {}, ms = 500) {
  const timerRef = useRef();

  const start = (e) => {
    e.persist?.();
    timerRef.current = setTimeout(() => callback(e), ms);
  };

  const clear = () => clearTimeout(timerRef.current);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
    onTouchMove: clear,
  };
}
