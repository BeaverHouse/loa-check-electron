import { createContext, useState } from "react";

const LoaContext = createContext({
    isDark: false,
    toggleDark: () => {},
})

interface Props {
    children: JSX.Element | JSX.Element[];
  }
  
  const LoaProvider = ({ children }: Props): JSX.Element => {

    const [isDark, setIsDark] = useState(window.localStorage.getItem("dark_mode") === "true")

    const toggleDark = () => {
      const newVal = !isDark
      setIsDark(newVal) 
      window.localStorage.setItem("dark_mode", newVal.toString())
    }
      return (
        <LoaContext.Provider
          value={{
            isDark,
            toggleDark,
          }}>
          {children}
        </LoaContext.Provider>
      );
  };
    
  export { LoaContext, LoaProvider }