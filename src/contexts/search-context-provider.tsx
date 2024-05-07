"use client";

import { createContext, useState } from "react";

export const SearchContext = createContext<null | TSearchContext>(null);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

type TSearchContext = {
  searchText: string;
  handleChangeSearchQuery: (newValue: string) => void;
};

export default function SearchContextProvider({ children }: SearchContextProviderProps) {
  // state
  const [searchText, setSearchText] = useState("");

  // derived state

  // event handlers
  const handleChangeSearchQuery = (newValue: string) => {
    setSearchText(newValue);
  };

  return (
    <SearchContext.Provider
      value={{
        searchText,
        handleChangeSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
