import React, { useEffect, useState } from "react";

function getStorageValue<T>(key: string, defaultValue: T) {
  // getting stored value
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const saved = window?.localStorage.getItem(key);
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
      window?.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};

export default useStorageState;
