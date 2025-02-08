import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import Profile from "./pages/Profile/index";
import Teams from "./pages/Teams";
import Users from "./pages/Users";
import Logs from "./pages/Logs";
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import Team from "./pages/Teams/Team";
import Projects from "./pages/Projects";
import Project from "./pages/Projects/Project";
import Tasks from "./pages/Tasks";
import Task from "./pages/Tasks/Task";
import Calendar from "./pages/Calendar";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	const { loading } = useSelector((state) => state.loaders);

	return (
		<div>
			{loading && <Spinner />}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Navigate to="/login" />}></Route>
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
					<Route
						path="/teams/:teamId/projects"
						element={
							<ProtectedPage>
								<Projects />
							</ProtectedPage>
						}
					/>
					<Route
						path="/teams/:teamId/events"
						element={
							<ProtectedPage>
								<Calendar />
							</ProtectedPage>
						}
					/>
					<Route
						path="/projects/:projectId"
						element={
							<ProtectedPage>
								<Project />
							</ProtectedPage>
						}
					/>
					<Route
						path="/projects/:projectId/tasks"
						element={
							<ProtectedPage>
								<Tasks />
							</ProtectedPage>
						}
					/>
					<Route
						path="/tasks/:taskId"
						element={
							<ProtectedPage>
								<Task />
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
						path="/logs"
						element={
							<ProtectedPage>
								<Logs />
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
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
