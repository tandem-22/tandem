import { createContext, ReactNode, useContext } from "react";

const TimeContext = createContext<{ initialTime: Date }>({
  initialTime: new Date(),
});

export function useInitialTime() {
  return useContext(TimeContext);
}

interface ProviderProps {
  children: ReactNode;
}

export const TimeProvider = ({ children }: ProviderProps) => {
  const initialTime = new Date();
  const value = { initialTime };

  return (
    <>
      <TimeContext.Provider value={value}>{children}</TimeContext.Provider>
    </>
  );
};
