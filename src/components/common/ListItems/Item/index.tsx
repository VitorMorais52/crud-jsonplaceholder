//types
import { UserProps } from "../../../../types/user";
import { ToDoProps } from "../../../../types/todo";

//@mui components
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

//styles
import { ContainerItem } from "./styles";

type ItemProps = UserProps & ToDoProps;

type ItemComponentProps = {
  children: React.ReactNode;
  item: ItemProps;
  isSelectableList?: boolean;
  selected: boolean;
  click?: () => void;
};

function Item({
  children,
  item,
  isSelectableList,
  selected,
  click,
}: ItemComponentProps) {
  return (
    <ContainerItem>
      {isSelectableList ? (
        <ListItemButton selected={selected} onClick={click}>
          {children}
        </ListItemButton>
      ) : (
        <ListItem onClick={click}>{children}</ListItem>
      )}
    </ContainerItem>
  );
}

export default Item;
