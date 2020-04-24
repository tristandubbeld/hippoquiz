interface LocalStorageData<T> {
  data: T | undefined;
  hasError: boolean;
}

export const loadFromLocalStorage = <T>(key: string): LocalStorageData<T> => {
  try {
    const serialized = localStorage.getItem(key);

    if (serialized === null) {
      return {
        data: undefined,
        hasError: false,
      };
    }

    return {
      data: JSON.parse(serialized),
      hasError: false,
    };
  } catch (err) {
    console.log(err);

    return {
      data: undefined,
      hasError: true,
    };
  }
};

export const saveToLocalStorage = <T>(key: string, data: T) => {
  try {
    const serialized = JSON.stringify(data);

    localStorage.setItem(key, serialized);
  } catch (err) {
    console.log(err);

    return {
      hasError: true,
    };
  }
};

export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.log(err);

    return {
      hasError: true,
    };
  }
};
