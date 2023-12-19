import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

// WAŻNE!!!!!! - DO SAMEJ PRACY INŻYNIERSKIEJ/DOKUMENTACJI: WZORCE PROJEKTOWE JAKIE DE FACTO WYKORZSTUJESZ W PROJEKCIE TO NP. MVC, OBSERVER
