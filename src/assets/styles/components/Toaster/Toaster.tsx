import { FC, useState } from "react";
import { Toast, iToast } from "./components/Toast/Toast";
import "./Toaster.scss";

export interface iToaster {
  className?: string;
};

const TOAST_DELAY = 300;
type tToast = Omit<iToast, "deltaDelay" | "className" | "onRemove">;
type tStateToast = Map<string, tToast>;
type tAddToast = (params: iAddToastParams) => tAddToast;
type tOnceOptions = iAddToastParams & { id: string };

interface iAddToastParams {
  children: iToast["children"];
  delay?: number;
};

export const Toaster: FC<iToaster> = ({ className = "" }) => {
  const [toasts, setToasts] = useState<tStateToast>(new Map());
  const toastList = Array.from(toasts);

  const removeToast = (id: string) => setToasts(pv => {
    const clone = new Map(pv.entries());
    clone.delete(id);
    return clone;
  });

  const addToast = (level: iToast["level"], options: iAddToastParams): tAddToast => {
    const toast = { level, ...options };
    addToMap(toast);
    return addToast.bind(null, level);
  };

  const once = (level: iToast["level"], { children, id, delay }: tOnceOptions) => {
    if (toasts.has(id)) return;
    const toast = { level, children, delay };
    addToMap(toast, id);
    return once;
  };

  function addToMap(toast: tToast, id: string = String(Date.now() / Math.random())) {
    setToasts(pv => {
      const clone = new Map(pv.entries());
      clone.set(id, toast);
      return clone;
    });
  }

  const InfoToast = addToast.bind(null, "info");
  const errorToast = addToast.bind(null, "error");
  const warningToast = addToast.bind(null, "warning");
  const successToast = addToast.bind(null, "success");

  return (

    <>
      <div className="Toaster-btns">
        <button
          className="success"
          onClick={successToast.bind(null, { children: "Some success text. Good Job!" })}>
          Add Success
        </button>

        <button
          className="warning"
          onClick={warningToast.bind(null, { children: "Some Warning text. Be Careful!" })}>
          Add Warning
        </button>

        <button
          className="error"
          onClick={errorToast.bind(null, { children: "Some Error text. Oh No!" })}
        >
          Add Error
        </button>

        <button
          className="info"
          onClick={InfoToast.bind(null, { children: "Some Info text. Actually it's not that bad!" })}
        >
          Add Info
        </button>

        <button
          className="success html"
          onClick={successToast.bind(null,
            {
              children: <div>You can put here anything you want to
                <a href="https://google.com" target="_blank">Google link</a>
              </div>
            })}
        >Add with HTML</button>

        <button
          className="info html"
          onClick={() => once("info", { children: "Info Once message. Try to click more", id: "once-test" })}
        >
          Add Once
        </button>
      </div>

      <div className={`Toaster ${className}`}>
        {toastList.map(([key, toast], idx) => (
          <Toast
            {...toast}
            deltaDelay={idx * TOAST_DELAY}
            key={key}
            onRemove={removeToast.bind(null, key)}
          />
        ))}
      </div>
    </>

  );
};