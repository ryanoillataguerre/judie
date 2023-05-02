import { useState } from "react";

function useStateWithCallback<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);

  const setValueAndCallback = (
    newValue: T,
    callback?: (prevVal?: T, newVal?: T) => void
  ) => {
    setValue((prevValue) => {
      if (callback) {
        callback(prevValue, newValue);
      }
      return newValue;
    });
  };

  return [value, setValueAndCallback];
}

export default useStateWithCallback;
