import React, { useState } from "react";
import { useQueryClient } from "react-query";
import Modal from "react-modal";

//services
import API from "../../../services/api";

//types
import { UserProps, Address, Company } from "../../../types/user";
import { ToDoProps } from "../../../types/todo";

//@mui components
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

//icons and styles
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Container, Wrapper } from "./styles";

type CreateItemModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  keyData: string;
  editItem?: UserProps & ToDoProps;
  listItems?: ToDoProps[] | UserProps[];
  setEditListItems?: (newList: ToDoProps[] | UserProps[]) => void;
};

function CreateUpdateItemModal({
  isOpen,
  onRequestClose,
  keyData,
  editItem,
  listItems,
  setEditListItems,
}: CreateItemModalProps) {
  const initialStateUser = {
    name: "",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      email: "",
      city: "",
      zipcode: "",
    },
  };
  const [userFields, setUserFields] = useState(editItem || initialStateUser);
  const [toDoFields, setToDoFields] = useState<ToDoProps>({
    completed: false,
    title: "",
  });

  const queryClient = useQueryClient();
  const dataCached = queryClient.getQueryData<ToDoProps[] | UserProps[]>(
    keyData
  );

  const fields =
    keyData === "users"
      ? userFields
      : { ...toDoFields, userId: queryClient.getQueryData("selectedUserId") };

  const handleChangeUserFields =
    (fields: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const arrFields = fields.split(" ");

      if (arrFields.length === 1) {
        setUserFields({ ...userFields, [arrFields[0]]: value });
        return;
      }

      const keyField = arrFields[0];
      setUserFields({
        ...userFields,
        [keyField]: { ...userFields["address"], [arrFields[1]]: value },
      });
    };

  async function createItem() {
    try {
      const response = await API.post(`/${keyData}`, {
        ...fields,
      });

      if (dataCached) {
        queryClient.setQueryData(keyData, [response.data, ...dataCached]);
        return;
      }
      addItemToList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      onRequestClose();
    }
  }

  async function editExistingItem() {
    try {
      const currentList = dataCached || listItems;
      if (!currentList) return;

      const response = await API.put(`/${keyData}/${editItem?.id}`, {
        ...fields,
      });

      const indexOldItem = currentList.findIndex(
        (oldItem) => oldItem.id === editItem?.id
      );
      currentList[indexOldItem] = { ...response.data };

      if (dataCached) {
        queryClient.setQueryData(keyData, currentList);

        return;
      }

      if (setEditListItems) setEditListItems(currentList);
    } catch (error) {
      console.log(error);
    } finally {
      onRequestClose();
    }
  }

  function addItemToList(item: UserProps | ToDoProps) {
    if (setEditListItems && listItems) setEditListItems([item, ...listItems]);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <div className="react-modal-close">
        <IconButton aria-label="close modal" onClick={onRequestClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <Container>
        {keyData === "users" && (
          <>
            <Divider style={{ marginTop: "1rem" }}>Personal data</Divider>
            <Wrapper columns="repeat(2, 1fr)">
              <TextField
                id="standard-basic"
                label="Name"
                variant="standard"
                value={userFields.name}
                onChange={handleChangeUserFields("name")}
              />
              <TextField
                id="standard-basic"
                label="Username"
                variant="standard"
                value={userFields.username}
                onChange={handleChangeUserFields("username")}
              />
              <TextField
                id="standard-basic"
                label="Email"
                variant="standard"
                value={userFields.email}
                onChange={handleChangeUserFields("email")}
              />
            </Wrapper>
            <Divider>Address</Divider>
            <Wrapper columns="repeat(2, 1fr)">
              <TextField
                id="standard-basic"
                label="Street"
                variant="standard"
                value={userFields.address?.street}
                onChange={handleChangeUserFields("address street")}
              />
              <TextField
                id="standard-basic"
                label="Suite"
                variant="standard"
                value={userFields.address?.suite}
                onChange={handleChangeUserFields("address suite")}
              />
              <TextField
                id="standard-basic"
                label="City"
                variant="standard"
                value={userFields.address?.city}
                onChange={handleChangeUserFields("address city")}
              />
              <TextField
                id="standard-basic"
                label="Zipcode"
                variant="standard"
                value={userFields.address?.zipcode}
                onChange={handleChangeUserFields("address zipcode")}
              />
            </Wrapper>
          </>
        )}
        {keyData === "todos" && (
          <Wrapper columns="auto 1fr">
            <div className="buttons-add">
              <Checkbox
                onClick={() =>
                  setToDoFields({
                    ...toDoFields,
                    completed: !toDoFields.completed,
                  })
                }
                checked={toDoFields.completed}
                icon={<CheckCircleIcon />}
                checkedIcon={<CheckCircleIcon color="success" />}
              />
            </div>
            <TextField
              id="standard-basic"
              label="Title"
              variant="standard"
              value={toDoFields.title}
              onChange={({ target }) =>
                setToDoFields({ ...toDoFields, title: target.value })
              }
            />
          </Wrapper>
        )}
      </Container>
      <div className="react-modal-footer">
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={editItem ? editExistingItem : createItem}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onRequestClose}
          >
            Cancel
          </Button>
        </Stack>
      </div>
    </Modal>
  );
}

export default CreateUpdateItemModal;
