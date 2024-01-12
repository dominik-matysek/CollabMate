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
import Project from "./pages/Projects/Project";
import Tasks from "./pages/Tasks";
function App() {
	const { loading } = useSelector((state) => state.loaders);
	return (
		<div>
			{loading && <Spinner />}
			<BrowserRouter>
				<Routes>
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
						path="/teams/:teamId"
						element={
							<ProtectedPage>
								<Team />
							</ProtectedPage>
						}
					/>
					<Route // W takim roucie jak ten, powineineś sprawdzać czy user należy do teamId - inaczej nie może wejść i go przekierowuje np. do 404 not found albo strony głównej
						path="/teams/:teamId/projects"
						element={
							<ProtectedPage>
								<Projects />
							</ProtectedPage>
						}
					/>
					{/* <Route // W takim roucie jak ten, powineineś sprawdzać czy user należy do teamId - inaczej nie może wejść i go przekierowuje np. do 404 not found albo strony głównej
						path="/teams/:teamId/calendar"
						element={
							<ProtectedPage>
								<Calendar />
							</ProtectedPage>
						}
					/> */}
					<Route // W takim roucie jak ten, powineineś sprawdzać czy user należy do teamId - inaczej nie może wejść i go przekierowuje np. do 404 not found albo strony głównej
						path="/projects/:projectId"
						element={
							<ProtectedPage>
								<Project />
							</ProtectedPage>
						}
					/>
					{/* <Route
						path="/projects"
						element={
							<ProtectedPage>
								<Projects />
							</ProtectedPage>
						}
					/> */}
					{/* <Route
						path="/tasks"
						element={
							<ProtectedPage>
								<Tasks />
							</ProtectedPage>
						}
					/> */}
					<Route // W takim roucie jak ten, powineineś sprawdzać czy user jest adminem - inaczej nie może wejść i go przekierowuje np. do 404 not found albo strony głównej
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
					{/* <Route path="*" element={<NotFound />} /> */}
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

// WAŻNE!!!!!! - DO SAMEJ PRACY INŻYNIERSKIEJ/DOKUMENTACJI: WZORCE PROJEKTOWE JAKIE DE FACTO WYKORZSTUJESZ W PROJEKCIE TO NP. MVC, OBSERVER
