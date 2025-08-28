import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

export function useSecureStorage() {
  const setItem = (key: string, value: any) => {
    ls.set(key, value);
  };

  const getItem = (key: string) => {
    return ls.get(key);
  };

  const removeItem = (key: string) => {
    ls.remove(key);
  };

  const clear = () => {
    ls.removeAll();
  };

  return {
    setItem,
    getItem,
    removeItem,
    clear,
  };
}
