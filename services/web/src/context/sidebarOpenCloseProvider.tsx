import React, { useState, createContext, useContext } from "react";

type SidebarOpenCloseContextType = {
  toggleSidebar: () => void;
  toggleAdminSidebar: () => void;
  isSidebarOpen: boolean;
  isAdminSidebarOpen: boolean;
};

const getInitalSidebarState = () => {
  if (typeof window !== "undefined") {
    const sidebarOpen = localStorage.getItem("sidebarOpen");

    if (sidebarOpen) {
      return JSON.parse(sidebarOpen);
    }

    return false;
  }
};

const getInitalAdminSidebarState = () => {
  if (typeof window !== "undefined") {
    const sidebarOpen = localStorage.getItem("adminSidebarOpen");

    if (sidebarOpen) {
      return JSON.parse(sidebarOpen);
    }

    return false;
  }
};

export const SidebarOpenCloseContext =
  createContext<SidebarOpenCloseContextType>({} as SidebarOpenCloseContextType);

export const SidebarOpenCloseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setSidebarIsOpen] = useState(getInitalSidebarState);
  const [isAdminSidebarOpen, setAdminSidebarIsOpen] = useState(
    getInitalAdminSidebarState
  );

  const toggleSidebar = () => {
    setSidebarIsOpen((prev: boolean) => {
      localStorage.setItem("sidebarOpen", JSON.stringify(!prev));

      return !prev;
    });
  };

  const toggleAdminSidebar = () => {
    setAdminSidebarIsOpen((prev: boolean) => {
      localStorage.setItem("adminSidebarOpen", JSON.stringify(!prev));

      return !prev;
    });
  };

  return (
    <SidebarOpenCloseContext.Provider
      value={{
        toggleSidebar,
        toggleAdminSidebar,
        isAdminSidebarOpen,
        isSidebarOpen,
      }}
    >
      {children}
    </SidebarOpenCloseContext.Provider>
  );
};

export const useSidebarOpenClose = () => useContext(SidebarOpenCloseContext);

export default SidebarOpenCloseProvider;
