import { useContext, createContext } from "react";

export const UserContext = createContext(undefined);

export const useUser = () => {
  const user = useContext(UserContext);
  
  if (user === undefined) {
    throw new Error("useUser must be used within a UserContext.Provider");
  }
  
  return user;
}