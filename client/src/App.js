import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import Profile from "./pages/Profile/index";
import Teams from "./pages/Teams";
import ProtectedPage from "./components/ProtectedPage";
import Home from "./pages/Home";
import Spinner from "./components/Spinner";
function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedPage>
                <Teams />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// WAŻNE!!!!!! - DO SAMEJ PRACY INŻYNIERSKIEJ/DOKUMENTACJI: WZORCE PROJEKTOWE JAKIE DE FACTO WYKORZSTUJESZ W PROJEKCIE TO NP. MVC, OBSERVER
