import { SyntheticEvent, useState } from "react";
import { useQuery } from "react-query";
import Modal from "react-modal";

//services
import API from "../../../services/api";

//hooks
import { useItemModal } from "../../../hooks/useItemModal";
import { useSelectedUser } from "../../../hooks/useSelectedUser";

//types
import { UserProps } from "../../../types/user";

//components
import TabPanel from "../../common/TabPanel";
import ListItems from "../../common/ListItems";
import ItemModal from "../../common/ItemModal";

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
  const { user } = useSelectedUser();
  const { handleOpenItemModal } = useItemModal();
  const [tabValue, setTabValue] = useState(0);

  useQuery<UserProps[]>(
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
          <Button
            variant="contained"
            onClick={() => handleOpenItemModal("users")}
            startIcon={<AddCircleOutlinedIcon />}
            style={{ margin: "1rem" }}
          >
            Add user
          </Button>
          <ListItems typeData={"users"} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {user && (
            <Button
              variant="contained"
              onClick={() => handleOpenItemModal("todos")}
              startIcon={<AddCircleOutlinedIcon />}
              style={{ margin: "1rem" }}
            >
              Add todo
            </Button>
          )}
          <ListItems typeData={"todos"} />
        </TabPanel>
      </div>
      <ItemModal />
    </Container>
  );
}

export default Home;
