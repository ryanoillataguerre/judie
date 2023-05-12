import { useEffect } from "react";

export default function useKeypress(key: any, action: (e: any) => void) {
  useEffect(() => {
    function onKeyup(e: any) {
      if (e.key === key) action(e);
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [action, key]);
}
