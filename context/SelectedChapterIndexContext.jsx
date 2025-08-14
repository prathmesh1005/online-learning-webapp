import { createContext, useContext, useState } from "react";

const SelectedChapterIndexContext = createContext();

export const useSelectedChapterIndex = () => {
  const context = useContext(SelectedChapterIndexContext);
  if (!context) {
    throw new Error('useSelectedChapterIndex must be used within a SelectedChapterIndexProvider');
  }
  return context;
};

export const SelectedChapterIndexProvider = ({ children }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  return (
    <SelectedChapterIndexContext.Provider value={{ selectedChapterIndex, setSelectedChapterIndex }}>
      {children}
    </SelectedChapterIndexContext.Provider>
  );
};

export { SelectedChapterIndexContext };