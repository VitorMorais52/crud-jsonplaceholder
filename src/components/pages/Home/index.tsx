import { SyntheticEvent, useState, useEffect } from "react";
import { useQuery } from "react-query";

//services
import API from "../../../services/api";

//types
import { UserProps } from "../../../types/user";
import { ToDoProps } from "../../../types/todo";

//components
import TabPanel from "../../common/TabPanel";
import ListItems from "../../common/ListItems";

//@mui components
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

//icons and styles
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { Container } from "./styles";

function Home() {
  const [user, setUser] = useState<UserProps>();
  const [userToDos, setUserToDos] = useState<ToDoProps[]>();
  const [tabValue, setTabValue] = useState(0);

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

  const getToDoUser = async () => {
    const data = (await API.get(`/user/${user?.id}/todos`)).data;
    setUserToDos(data);
  };

  useEffect(() => {
    if (user) {
      getToDoUser();
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
          <Tab icon={<FormatListBulletedIcon />} label="todo" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <ListItems
            data={users}
            keyData={"users"}
            isSelectableList={true}
            selected={user}
            onSelection={(value) => setUser(value)}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
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
