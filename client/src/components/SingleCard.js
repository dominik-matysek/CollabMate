import React from "react";
import { Avatar, Badge, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSimpleDateFormat } from "../utils/helpers";

// Tu musisz dorzucić teamleada imie i nazwisko dla każdego carda, te zdjęcia ogarnąć i date utworzenia np.

function SingleCard({ item }) {
	const navigate = useNavigate();
	// console.log("Członkowie", team.members[0].firstName);
	console.log("Co jest w item: ", item);
	return (
		// <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center"></div>
		<div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
			<div className="flex justify-between items-center mb-4">
				<div className="mr-20">
					<div className="font-bold text-xl mb-2">{item.name}</div>
					<p className="text-gray-700 text-base mb-2">
						{item.teamLeaders.length === 1
							? `${item.teamLeaders.length} Lider`
							: `${item.teamLeaders.length} Liderów`}
						{" | "}
						{item.members.length === 1
							? `${item.members.length} Pracownik`
							: `${item.members.length} Pracowników`}
					</p>
					<p className="text-gray-600 text-sm">Utworzono:</p>
					<p>{getSimpleDateFormat(item.createdAt)}</p>
				</div>
				<div className="flex items-center ">
					{item.members.slice(0, 5).map((member, index) => (
						<Avatar
							key={index}
							src={member.profilePic}
							className="mr-4"
							size={52}
						/>
					))}
					{/* <Avatar className="mr-4" src={item.teamLeaders[0].profilePic} /> */}
					{/* <Avatar.Group>
						{item.teamLeaders.map((member, index) => {
							// <Badge key={index} className="mr-4">
							// 	<a href="#" className="example-link">
							// 		<Avatar
							// 			style={{ backgroundColor: "#f56a00" }}
							// 			src={member.profilePic}
							// 		/>
							// 	</a>
							// </Badge>;

							// // <Avatar>member</Avatar>;
							<Avatar
								className="mr-4"
								style={{ backgroundColor: "#f56a00" }}
								src={member.profilePic}
							/>;
						})} */}
					{/* <Avatar className="mr-4" src="path-to-image1.jpg" />
						<Avatar className="mr-4" src="path-to-image2.jpg" />
						<Avatar className="mr-4" src="path-to-image3.jpg" /> */}
					{/* Add more Avatar components */}
					{/* </Avatar.Group> */}
					{/* <EllipsisOutlined className="text-gray-600 ml-4" /> */}
				</div>
			</div>
			{/* Instead of comment, we add a button */}
			<Button type="primary" onClick={() => navigate(`/teams/${item._id}`)}>
				Zobacz szczegóły
			</Button>
		</div>
	);
}

export default SingleCard;

// import React from "react";
// import { Avatar, Badge, Button } from "antd";
// import { EllipsisOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// // Tu musisz dorzucić teamleada imie i nazwisko dla każdego carda, te zdjęcia ogarnąć i date utworzenia np.

// function TeamCard({ team }) {
// 	const navigate = useNavigate();
// 	// console.log("Członkowie", team.members[0].firstName);
// 	return (
// 		// <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center"></div>
// 		<div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
// 			<div className="flex justify-between items-center mb-4">
// 				<div className="mr-20">
// 					<div className="font-bold text-xl mb-2">{team.name}</div>
// 					<p className="text-gray-700 text-base">
// 						1 Lider,{" "}
// 						{team.members.length === 1
// 							? `${team.members.length} Pracownik`
// 							: `${team.members.length} Pracowników`}
// 					</p>
// 				</div>
// 				<div className="flex items-center ">
// 					<Avatar.Group>
// 						<Avatar>D</Avatar>
// 						{/* {team.members.map((member, index) => {
// 							// <Badge className="mr-4">
// 							// 	<a href="#" className="example-link">
// 							// 		<Avatar style={{ backgroundColor: "#f56a00" }}>
// 							// 			{member.firstName}
// 							// 		</Avatar>
// 							// 	</a>
// 							// </Badge>;

// 							<Avatar>member</Avatar>;
// 						})} */}
// 						{/* <Avatar className="mr-4" src="path-to-image1.jpg" />
// 						<Avatar className="mr-4" src="path-to-image2.jpg" />
// 						<Avatar className="mr-4" src="path-to-image3.jpg" /> */}
// 						{/* Add more Avatar components */}
// 					</Avatar.Group>
// 					{/* <EllipsisOutlined className="text-gray-600 ml-4" /> */}
// 				</div>
// 			</div>
// 			{/* Instead of comment, we add a button */}
// 			<Button type="primary" onClick={() => navigate(`/team/${team._id}`)}>
// 				Zobacz szczegóły
// 			</Button>
// 		</div>
// 	);
// }

// export default TeamCard;
