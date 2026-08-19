import { Accessor, createContext, createSignal, ParentComponent, useContext } from 'solid-js';
import { isDarkTheme } from './utils/isDarkTheme';

interface AppContextType {
  dark: Accessor<boolean>;
  toggleDark: () => void;
}

const AppContext = createContext<AppContextType>();

export const AppContextProvider: ParentComponent = (props) => {
  const [dark, setDark] = createSignal(isDarkTheme());
  document.body.classList.toggle('dark', dark());

  return (
    <AppContext.Provider
      value={{
        dark,
        toggleDark() {
          const next = !dark();
          document.body.classList.toggle('dark', next);
          setDark(next);
          localStorage.setItem('dark', String(next));
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
