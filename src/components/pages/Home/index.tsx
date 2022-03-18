import { SyntheticEvent, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import Modal from "react-modal";

//services
import API from "../../../services/api";

//types
import { UserProps } from "../../../types/user";
import { ToDoProps } from "../../../types/todo";

//components
import TabPanel from "../../common/TabPanel";
import ListItems from "../../common/ListItems";
import CreateItemModal from "../../common/CreateUpdateItemModal";

//@mui components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";

//icons and styles
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { Container } from "./styles";

Modal.setAppElement("#root");

function Home() {
  const [user, setUser] = useState<UserProps | undefined>();
  const [userToDos, setUserToDos] = useState<ToDoProps[]>();
  const [tabValue, setTabValue] = useState(0);
  const [createItemModalOpen, setCreateItemModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: users } = useQuery<UserProps[]>(
    "users",
    async () => {
      const response = await API.get("/users");
      return response.data;
    },
    {
      staleTime: 1000 * 60, // 1 minute
    }
  );

  const handleChangeTab = (__: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function handleOpenCreateItemModal() {
    setCreateItemModalOpen(true);
  }

  function handleCloseCreateItemModal() {
    setCreateItemModalOpen(false);
  }

  async function getToDoUser() {
    try {
      if (!user?.id) return;

      queryClient.setQueryData<number>("selectedUserId", user.id);

      const data = (await API.get(`/user/${user.id}/todos`)).data;

      setUserToDos(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getToDoUser();
    } else {
      setUserToDos([]);
    }
  }, [user]);

  return (
    <Container>
      <div className="content">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label="icon label tabs "
          variant="fullWidth"
        >
          <Tab icon={<PersonPinIcon />} label="users" />
          <Tab icon={<FormatListBulletedIcon />} label="todos" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <CreateItemModal
            isOpen={createItemModalOpen}
            onRequestClose={handleCloseCreateItemModal}
            keyData={"users"}
          />

          <Button
            variant="contained"
            onClick={handleOpenCreateItemModal}
            startIcon={<AddCircleOutlinedIcon />}
            style={{ margin: "1rem" }}
          >
            Add user
          </Button>
          <ListItems
            data={users}
            keyData={"users"}
            isSelectableList={true}
            selected={user}
            onSelection={(value) => setUser(value)}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CreateItemModal
            isOpen={createItemModalOpen}
            onRequestClose={handleCloseCreateItemModal}
            keyData={"todos"}
            listItems={userToDos}
            setEditListItems={(newList) => {
              if (userToDos) setUserToDos(newList);
            }}
          />

          <Button
            variant="contained"
            onClick={handleOpenCreateItemModal}
            startIcon={<AddCircleOutlinedIcon />}
            style={{ margin: "1rem" }}
          >
            Add todo
          </Button>
          <ListItems
            data={userToDos}
            keyData={"todos"}
            changeData={(v) => setUserToDos(v)}
          />
        </TabPanel>
      </div>
    </Container>
  );
}

export default Home;
