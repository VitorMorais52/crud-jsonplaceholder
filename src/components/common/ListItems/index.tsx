import { useQueryClient } from "react-query";

//hooks
import { useItemModal } from "../../../hooks/useItemModal";
import { useSelectedUser } from "../../../hooks/useSelectedUser";

//services
import API from "../../../services/api";

//types
import { UserProps } from "../../../types/user";
import { ToDoProps } from "../../../types/todo";

//components
import Item from "./Item";

//@mui components
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

//icons and styles
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Container, Content, Status } from "./styles";

type ItemProps = UserProps & ToDoProps;

type ListItemsProps = {
  keyData: string;
};

function ListItems({ keyData }: ListItemsProps) {
  const { user: currentUser, setUser, toDos, setToDos } = useSelectedUser();
  const { handleOpenItemModal, setEditItem } = useItemModal();

  const queryClient = useQueryClient();
  const dataList: ItemProps[] | undefined =
    keyData === "users" ? queryClient.getQueryData("users") : toDos;

  function handleSelectItem(item: UserProps | undefined) {
    const newSelected = item?.id === currentUser?.id ? undefined : item;
    setUser(newSelected);
  }

  async function handleChangeStatusItem(item: ToDoProps) {
    if (!dataList) return;

    const changedItem = { ...item, completed: !item.completed };

    try {
      await API.put(`/todos/${item.id}`, {
        ...changedItem,
      });
    } catch (error) {
      console.error(
        "The item does not exist in the API, but its status has been changed locally in the app"
      );
    } finally {
      const newItems = dataList.map((oldItem) => {
        if (oldItem.id === item.id) return changedItem;
        return oldItem;
      });
      UpdateDataList(newItems);
    }
  }

  async function handleRemoveItem(index: number) {
    try {
      if (!dataList) return;

      await API.delete(`/${keyData}/${dataList[index].id}`);

      if (dataList[index].id === currentUser?.id) {
        handleSelectItem(undefined);
      }

      const newItems = dataList.filter(
        (item) => item.id !== dataList[index].id
      );

      UpdateDataList(newItems);
    } catch (error) {
      console.log(error);
    }
  }

  function openEditItem(item: ItemProps) {
    setEditItem(item);
    handleOpenItemModal(keyData);
  }

  function UpdateDataList(data: ItemProps[]) {
    if (keyData === "users") {
      queryClient.setQueryData("users", data);
      return;
    }
    setToDos(data);
  }

  return (
    <Container>
      {dataList && (
        <>
          <List dense={false}>
            {dataList.map((item, index) => (
              <Content key={index}>
                <Item
                  isSelectableList={keyData === "users"}
                  selected={item.id === currentUser?.id}
                  click={() => handleSelectItem(item)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {keyData === "users" && <AccountCircleIcon />}
                      {keyData === "todos" && <AssignmentIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name || item.title}
                    secondary={
                      keyData === "todos" ? (
                        <Status completed={!!item.completed}>
                          {item.completed ? "completed" : "uncompleted"}
                        </Status>
                      ) : (
                        keyData === "users" && <span>{item.username}</span>
                      )
                    }
                  />
                </Item>
                <div className="buttons">
                  {keyData === "users" ? (
                    <IconButton
                      edge="end"
                      aria-label="edit item"
                      onClick={() => openEditItem(item)}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      edge="end"
                      aria-label="item status"
                      onClick={() => {
                        handleChangeStatusItem(item);
                      }}
                    >
                      <CheckCircleIcon
                        color={item.completed ? "success" : "inherit"}
                      />
                    </IconButton>
                  )}

                  <IconButton
                    edge="end"
                    aria-label="delete item"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Content>
            ))}
          </List>
        </>
      )}
      {!dataList && (
        <div className="not-results">
          <span>
            Apparently you have not selected a user or the selected user has no
            tasks
          </span>
        </div>
      )}
    </Container>
  );
}

export default ListItems;
