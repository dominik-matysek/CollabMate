import React from "react";
import UserListItem from "./UserListItem";

const UserList = ({ users, title }) => {
	console.log("Userzy: ", users, " oraz tytuł: ", title);
	return (
		<div
			className="bg-white rounded-lg shadow mt-10"
			style={{ backgroundColor: "#138585" }}
		>
			<div className="px-4 py-2 border-b border-gray-200">
				<h3 className="text-lg font-semibold text-white">{title}</h3>
			</div>
			<div>
				{users.map((user) => (
					<UserListItem key={user.id} user={user} />
				))}
			</div>
		</div>
	);
};

export default UserList;
