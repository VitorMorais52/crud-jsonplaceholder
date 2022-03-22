//@mui components
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

//styles
import { ContainerItem } from "./styles";

type ItemComponentProps = {
  children: React.ReactNode;
  isSelectableList?: boolean;
  selected: boolean;
  click?: () => void;
};

function Item({
  children,
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
        <ListItem>{children}</ListItem>
      )}
    </ContainerItem>
  );
}

export default Item;
