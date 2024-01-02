import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Test from "./pages/Test";
import ProtectedPage from "./components/ProtectedPage";
import Home from "./pages/Home";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/test"
            element={
              <ProtectedPage>
                <Test />
              </ProtectedPage>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// WAŻNE!!!!!! - DO SAMEJ PRACY INŻYNIERSKIEJ/DOKUMENTACJI: WZORCE PROJEKTOWE JAKIE DE FACTO WYKORZSTUJESZ W PROJEKCIE TO NP. MVC, OBSERVER
