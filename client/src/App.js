import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import Profile from "./pages/Profile/index";
import Teams from "./pages/Teams";
import Users from "./pages/Users";
import ProtectedPage from "./components/ProtectedPage";
import Home from "./pages/Home";
import Spinner from "./components/Spinner";
import Team from "./pages/Teams/Team";
import Test from "./pages/Test";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
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
						path="/team/:teamId"
						element={
							<ProtectedPage>
								<Team />
							</ProtectedPage>
						}
					/>
					<Route
						path="/projects"
						element={
							<ProtectedPage>
								<Projects />
							</ProtectedPage>
						}
					/>
					<Route
						path="/tasks"
						element={
							<ProtectedPage>
								<Tasks />
							</ProtectedPage>
						}
					/>
					<Route
						path="/users"
						element={
							<ProtectedPage>
								<Users />
							</ProtectedPage>
						}
					/>
					<Route
						path="/profile/:userId"
						element={
							<ProtectedPage>
								<Profile />
							</ProtectedPage>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route path="/test" element={<Test />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

// WAŻNE!!!!!! - DO SAMEJ PRACY INŻYNIERSKIEJ/DOKUMENTACJI: WZORCE PROJEKTOWE JAKIE DE FACTO WYKORZSTUJESZ W PROJEKCIE TO NP. MVC, OBSERVER
