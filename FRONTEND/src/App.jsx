import Routes from "./routes/Routes";
import LoadingProvider from "./context/LoadingContext";
import UserProvider from "./context/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <LoadingProvider>
            <Routes />
        </LoadingProvider>
      </UserProvider>
    </>
  );
}

export default App;
