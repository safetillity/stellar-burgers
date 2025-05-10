import { useState, ChangeEvent } from 'react';

export function useValue<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = <K extends keyof T>(
    key: K,
    value: T[K] | ((prevValue: T[K]) => T[K])
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]:
        typeof value === 'function'
          ? (value as (prevValue: T[K]) => T[K])(prevValues[key])
          : value
    }));
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    handleChange(name as keyof T, value as T[keyof T]);
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return { values, handleChange, handleInputChange, resetForm };
}
