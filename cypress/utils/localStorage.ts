export const addLocalStorageItem = (key: string, value: any) => {
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      timeToLive: Date.now() / 1000 + 3600,
    })
  );
};
