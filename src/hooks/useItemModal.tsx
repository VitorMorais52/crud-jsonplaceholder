import { useState, createContext, useContext } from "react";
import { ToDoProps } from "../types/todo";
import { UserProps } from "../types/user";

// import { useItems } from "../hooks/useItems";

type ItemProps = UserProps & ToDoProps;

type ItemModalProviderProps = {
  children: React.ReactNode;
};

type ItemModalContextProps = {
  itemModalOpen: boolean;
  handleOpenItemModal: (keyData: string) => void;
  handleCloseItemModal: () => void;
  typeData: string;
  editItem?: ItemProps;
  setEditItem: (item: ItemProps) => void;
};

const ItemModalContext = createContext<ItemModalContextProps>(
  {} as ItemModalContextProps
);

export function ItemModalProvider({ children }: ItemModalProviderProps) {
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [typeData, setTypeData] = useState("");
  const [editItem, setEditItem] = useState<ItemProps>();

  function handleOpenItemModal(typeData: string) {
    setTypeData(typeData);
    setItemModalOpen(true);
  }

  function handleCloseItemModal() {
    setEditItem(undefined);
    setItemModalOpen(false);
  }

  return (
    <ItemModalContext.Provider
      value={{
        itemModalOpen,
        handleOpenItemModal,
        handleCloseItemModal,
        typeData,
        editItem,
        setEditItem,
      }}
    >
      {children}
    </ItemModalContext.Provider>
  );
}

export function useItemModal() {
  const context = useContext(ItemModalContext);
  return context;
}
