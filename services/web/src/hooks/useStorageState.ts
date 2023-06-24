import React, { useEffect, useState } from "react";

function getStorageValue<T>(key: string, defaultValue: T) {
  // getting stored value
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const saved = window?.sessionStorage.getItem(key);
  if (!saved || saved === "undefined") {
    return defaultValue;
  }
  return JSON.parse(saved);
}

const useStorageState = <T>(
  defaultValue: T,
  key: string
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (value) {
      window?.sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      window?.sessionStorage.removeItem(key);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useStorageState;
