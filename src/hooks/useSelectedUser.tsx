import { useState, createContext, useContext, useEffect } from "react";

//services
import API from "../services/api";

//types
import { UserProps } from "../types/user";
import { ToDoProps } from "../types/todo";

type SelectedUserProviderProps = {
  children: React.ReactNode;
};

type SelectedUserContextProps = {
  user?: UserProps;
  setUser: (user: UserProps | undefined) => void;
  toDos?: ToDoProps[];
  setToDos: (toDos: ToDoProps[]) => void;
};

const SelectedUserContext = createContext<SelectedUserContextProps>(
  {} as SelectedUserContextProps
);

export function SelectedUserProvider({ children }: SelectedUserProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const [toDos, setToDos] = useState<ToDoProps[]>();

  async function getToDos() {
    console.log("teste");
    const data = (await API.get(`/user/${user?.id}/todos`)).data;
    setToDos(data);
  }

  useEffect(() => {
    if (user) {
      getToDos();
    } else {
      setToDos(undefined);
    }
  }, [user]);

  return (
    <SelectedUserContext.Provider value={{ user, setUser, toDos, setToDos }}>
      {children}
    </SelectedUserContext.Provider>
  );
}

export function useSelectedUser() {
  const context = useContext(SelectedUserContext);
  return context;
}
