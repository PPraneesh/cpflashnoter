import Routes from "./routes/Routes";
import AuthProvider from "./context/AuthContext";
import LoadingProvider from "./context/LoadingContext";
import UserProvider from "./context/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <LoadingProvider>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </LoadingProvider>
      </UserProvider>
    </>
  );
}

export default App;
