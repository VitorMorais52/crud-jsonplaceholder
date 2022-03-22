import { ItemModalProvider } from "./hooks/useItemModal";
import { SelectedUserProvider } from "./hooks/useSelectedUser";
import Home from "./components/pages/Home";

function App() {
  return (
    <div className="App">
      <SelectedUserProvider>
        <ItemModalProvider>
          <Home />
        </ItemModalProvider>
      </SelectedUserProvider>
    </div>
  );
}

export default App;
