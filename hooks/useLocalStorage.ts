import { useState, useEffect, useRef } from 'react';

const useLocalStorage = <Type>(
  key: string,
  defaultValue: Type | (() => Type)
) => {
  const [value, setValue] = useState<Type>(
    defaultValue instanceof Function ? defaultValue() : defaultValue
  );
  const initialRender = useRef(true);

  useEffect(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null) {
      setValue(JSON.parse(jsonValue));
    }
  }, [key]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

export default useLocalStorage;
