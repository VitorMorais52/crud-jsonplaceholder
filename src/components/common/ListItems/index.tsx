import { useState } from "react";
import { useQueryClient } from "react-query";

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
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

//icons and styles
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { Container, Content, Status } from "./styles";

type ItemProps = UserProps & ToDoProps;

type ListItemsProps = ToDoProps &
  UserProps & {
    data: ItemProps[] | undefined;
    changeData?: (v: ItemProps[] | undefined) => void;
    keyData: string;
    isSelectableList?: boolean;
    selected?: ItemProps;
    onSelection?: (value: ItemProps) => void;
  };

function ListItems({
  data,
  changeData,
  keyData,
  isSelectableList,
  selected,
  onSelection,
}: ListItemsProps) {
  const [inputFields, setInputFields] = useState<ToDoProps>({
    completed: false,
    title: "",
  });

  const queryClient = useQueryClient();
  const isDataCached = !!queryClient.getQueryData(keyData);

  function handleChangeData(data: ItemProps[]) {
    if (changeData) changeData(data);
  }

  function handleSelectItem(item: UserProps) {
    if (onSelection) onSelection(item);
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

  async function handleAddItem() {
    try {
      if (!data) return;

      const response = await API.post(`/${keyData}`, {
        ...inputFields,
      });

      if (isDataCached)
        queryClient.setQueryData(keyData, [response.data, ...data]);
      else handleChangeData([response.data, ...data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemoveItem(index: number) {
    try {
      if (!data) return;

      await API.delete(`/${keyData}/${data[index].id}`);

      const newItems = data.filter((item) => item.id !== data[index].id);

      if (isDataCached) queryClient.setQueryData(keyData, newItems);
      else handleChangeData(newItems);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {data && (
        <Container>
          {!isSelectableList && (
            <div className="add-item">
              <div className="buttons-add">
                <Checkbox
                  onClick={() =>
                    setInputFields({
                      ...inputFields,
                      completed: !inputFields.completed,
                    })
                  }
                  checked={inputFields.completed}
                  icon={<CheckCircleIcon />}
                  checkedIcon={<CheckCircleIcon color="success" />}
                />
              </div>
              <TextField
                id="standard-basic"
                label="Title"
                variant="standard"
                value={inputFields.title}
                onChange={({ target }) =>
                  setInputFields({ ...inputFields, title: target.value })
                }
              />
              <div className="buttons-add">
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleAddItem}
                >
                  ADD
                </Button>
              </div>
            </div>
          )}

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
                      !isSelectableList && (
                        <Status completed={!!item.completed}>
                          {item.completed ? "completed" : "uncompleted"}
                        </Status>
                      )
                    }
                  />
                </Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {!isSelectableList && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
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
                    aria-label="delete"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Content>
            ))}
          </List>
        </Container>
      )}
    </>
  );
}

export default ListItems;
