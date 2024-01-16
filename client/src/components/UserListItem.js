// UserListItem.js
import React from "react";
import { Avatar, Button } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IoTrashBin } from "react-icons/io5";

const UserListItem = ({ user, showDelete, onDelete, creatorId }) => {
	const navigate = useNavigate();
	console.log("User: ", user);
	return (
		<div
			className="flex items-center justify-between p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer "
			onClick={() => navigate(`/profile/${user._id}`)}
		>
			<div className="flex items-center">
				{user.profilePic && (
					<Avatar src={user.profilePic} className="mr-4 ml-2 mt-2" />
				)}

				<div className="flex flex-col">
					<span className="font-bold text-blue-400">
						{user.firstName} {user.lastName}
					</span>
					<div className="flex items-center text-green-500 text-sm">
						<TeamOutlined className="mr-1" />
						{user.team ? (
							<span>{user.team?.name}</span>
						) : (
							<span>{user.role}</span>
						)}
					</div>
				</div>
			</div>
			{showDelete && user._id !== creatorId && (
				<Button
					className="p-1"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(user._id);
					}}
				>
					<IoTrashBin />
				</Button>
			)}
		</div>
	);
};

export default UserListItem;

// // UserListItem.js
// import React from "react";
// import { Avatar } from "antd";
// import { TeamOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// const UserListItem = ({ user }) => {
// 	const navigate = useNavigate();
// 	console.log("User: ", user);
// 	return (
// 		<div
// 			className="flex items-center justify-start p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer "
// 			onClick={() => navigate(`/profile/${user._id}`)}
// 		>
// 			{user.profilePic && (
// 				<Avatar src={user.profilePic} className="mr-4 ml-2 mt-2" />
// 			)}

// 			<div className="flex flex-col">
// 				<span className="font-bold text-blue-400">
// 					{user.firstName} {user.lastName}
// 				</span>
// 				<div className="flex items-center text-green-500 text-sm">
// 					<TeamOutlined className="mr-1" />
// 					{user.team ? (
// 						<span>{user.team?.name}</span>
// 					) : (
// 						<span>{user.role}</span>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default UserListItem;
