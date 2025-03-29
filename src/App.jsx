import "./App.css";
import { ShowListProvider} from "./context/ShowListContext.jsx";
import ShowsList from "./Components/ShowsList.jsx";


function App() {


  return (
    <>
      <main>
        <ShowListProvider>
          <ShowsList/>
        </ShowListProvider>
      </main>
    </>
  );
}

export default App;
