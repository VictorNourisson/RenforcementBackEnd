import { createContext, useContext, useState } from "react";

type UserContextValue = {
  username: string | null;
  firstname: string | null;
  lastnamme: string | null;
  email: string | null;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children?: any }): any => {
  const [user, setUser] = useState(undefined);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useCurrentUser = () => useContext(UserContext);