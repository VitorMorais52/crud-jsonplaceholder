import { useState } from "react";
import { useQueryClient } from "react-query";
import Modal from "react-modal";

//services
import API from "../../../services/api";

//types
import { UserProps } from "../../../types/user";
import { ToDoProps } from "../../../types/todo";

//components
import Item from "./Item";
import CreateItemModal from "../CreateUpdateItemModal";

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

type ListItemsProps = ToDoProps &
  UserProps & {
    data: ItemProps[] | undefined;
    changeData?: (v: ItemProps[] | undefined) => void;
    keyData: string;
    isSelectableList?: boolean;
    selected?: ItemProps;
    onSelection?: (value: ItemProps | undefined) => void;
  };

Modal.setAppElement("#root");

function ListItems({
  data,
  changeData,
  keyData,
  isSelectableList,
  selected,
  onSelection,
}: ListItemsProps) {
  const [createItemModalOpen, setCreateItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ItemProps>();

  const queryClient = useQueryClient();
  const isDataCached = !!queryClient.getQueryData(keyData);

  function openEditItem(item: ItemProps) {
    setEditItem(item);
    handleOpenCreateItemModal();
  }

  function handleOpenCreateItemModal() {
    setCreateItemModalOpen(true);
  }

  function handleCloseCreateItemModal() {
    setCreateItemModalOpen(false);
  }

  function handleChangeData(data: ItemProps[]) {
    if (changeData) changeData(data);
  }

  function handleSelectItem(item: UserProps | undefined) {
    const oldSelectedId = queryClient.getQueryData("selectedUserId");
    const newSelected = item?.id === oldSelectedId ? undefined : item;

    if (onSelection) onSelection(newSelected);
    queryClient.setQueryData("selectedUserId", newSelected);
  }

  async function handleChangeStatusItem(item: ToDoProps) {
    if (!data) return;

    const changedItem = { ...item, completed: !item.completed };

    try {
      await API.put(`/todos/${item.id}`, {
        ...changedItem,
      });
    } catch (error) {
      console.error(
        "O item não existe na API, mas seu status foi alterado no app"
      );
    } finally {
      const newItems = data.map((oldItem) => {
        if (oldItem.id === item.id) return changedItem;
        return oldItem;
      });
      handleChangeData(newItems);
    }
  }

  async function handleRemoveItem(index: number) {
    try {
      if (!data) return;

      await API.delete(`/${keyData}/${data[index].id}`);

      if (data[index].id === selected?.id) {
        handleSelectItem(undefined);
      }

      const newItems = data.filter((item) => item.id !== data[index].id);

      if (isDataCached) queryClient.setQueryData(keyData, newItems);
      else handleChangeData(newItems);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      {data && (
        <>
          <List dense={false}>
            {data.map((item, index) => (
              <Content key={index}>
                <Item
                  isSelectableList={isSelectableList}
                  item={item}
                  selected={item.id === selected?.id}
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
                  {isSelectableList ? (
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
          {createItemModalOpen && (
            <CreateItemModal
              isOpen={createItemModalOpen}
              onRequestClose={handleCloseCreateItemModal}
              keyData={keyData}
              editItem={editItem}
              listItems={data}
              setEditListItems={(newList) => {
                if (changeData) changeData(newList);
              }}
            />
          )}
        </>
      )}
      {data?.length === 0 && (
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
