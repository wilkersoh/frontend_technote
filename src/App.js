import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/DashLayout";
import Login from "./features/auth/Login";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />

				{/*
						1. Remain the state after refresh
							eg: if not prefetch: /dash/users/:id -> refresh -> page showing loading
							- We don't call api on /dash/users/:id, we use selector to get the object in store
						2. prevent keepUnusedDataFor refresh after default second

				*/}
				<Route element={<PersistLogin />}>
					<Route element={<Prefetch />}>
						{/* protected route */}
						<Route path="dash" element={<DashLayout />}>
							<Route index element={<Welcome />} />

							<Route path="users">
								<Route index element={<UsersList />} />
								<Route path=":id" element={<EditUser />} />
								<Route path="new" element={<NewUserForm />} />
							</Route>

							<Route path="notes">
								<Route index element={<NotesList />} />
								<Route path=":id" element={<EditNote />} />
								<Route path="new" element={<NewNote />} />
							</Route>
						</Route>
					</Route>
					{/* end protected route */}
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
