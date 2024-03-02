
import { FC, ReactNode, useEffect, useRef } from "react";
import "./Toast.scss";

export interface iToast {
  level: "success" | "info" | "error" | "warning";
  children: ReactNode;
  deltaDelay: number;
  className?: string;
  delay?: number;
  onRemove: () => void;
}

export const Toast: FC<iToast> = ({ deltaDelay, level = "success", children, delay = 5000, onRemove, className = "" }) => {
  const { setTime: animationTimer, clearTimeout: clearAnimationTimer } = buildTimer(100);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const fadeTimer = useRef<undefined | ReturnType<typeof setTimeout>>();

  useEffect(() => {
    animationTimer(() => setActive("add"));
    removeToast();

    return () => {
      clearAnimationTimer();
      clearTimeout(fadeTimer?.current);
    };
  }, []);

  const setActive = (method: "add" | "remove") => toastRef?.current?.classList[method]("active");
  const onMouseEnter = () => clearTimeout(fadeTimer?.current);
  const onMouseLeave = () => removeToast();

  function buildTimer(ms: number) {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const setTime = (callback: any) => (timer = setTimeout(callback, ms));

    return {
      clearTimeout: clearTimeout.bind(null, timer),
      setTime
    };
  }

  function removeToast(ms = delay + deltaDelay) {
    const { setTime } = buildTimer(ms);

    fadeTimer.current = setTime(() => {
      setActive("remove");
      setTimeout(onRemove, 300);
    });
  }

  if (!children) return null;

  return (
    <div
      className={`Toast ${className} ${level}`}
      ref={toastRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <p className="Toast-level">{level}</p>

      <button
        className="Toast-close"
        aria-label="close toaster"
        onClick={() => removeToast(100)}
      />

      {children}
    </div>
  );
};
