import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BottomBarVisibilityContextValue = {
  isBottomBarVisible: boolean;
  setBottomBarVisible: (visible: boolean) => void;
};

const BottomBarVisibilityContext =
  createContext<BottomBarVisibilityContextValue | null>(null);

export function BottomBarVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isBottomBarVisible, setBottomBarVisible] = useState(true);

  const value = useMemo(
    () => ({
      isBottomBarVisible,
      setBottomBarVisible,
    }),
    [isBottomBarVisible],
  );

  return (
    <BottomBarVisibilityContext.Provider value={value}>
      {children}
    </BottomBarVisibilityContext.Provider>
  );
}

export function useBottomBarVisibility() {
  const context = useContext(BottomBarVisibilityContext);

  if (!context) {
    throw new Error(
      "useBottomBarVisibility must be used inside BottomBarVisibilityProvider",
    );
  }

  return context;
}