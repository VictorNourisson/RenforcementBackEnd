import { createContext, useContext, useState } from "react";

type UserContextValue = {
    user: any
    setUser: any
}

export const UserContext = createContext<UserContextValue>({user: {}, setUser: () => {}});

export const UserProvider = ({children}: { children?: any }): any => {
    const [user, setUser] = useState(undefined);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useCurrentUser = () => useContext(UserContext)