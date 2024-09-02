import Routes from "./routes/Routes";
import AuthProvider from "./context/AuthContext";
import LoadingProvider from "./context/LoadingContext";
function App() {
  return (
    <>
      <LoadingProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </LoadingProvider>
    </>
  );
}

export default App;
