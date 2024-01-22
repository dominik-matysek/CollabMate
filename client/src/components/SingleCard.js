import React from "react";
import { Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getSimpleDateFormat } from "../utils/helpers";

function SingleCard({ item }) {
	const navigate = useNavigate();

	return (
		item && (
			<div className="bg-white p-4 rounded-lg shadow mb-6 md:flex md:justify-between md:items-center">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
					<div className="flex-1">
						<div className="font-bold text-xl mb-2">{item.name}</div>
						<p className="text-gray-700 text-base">
							{item.teamLeaders?.length === 1
								? `${item.teamLeaders.length} Lider`
								: `${item.teamLeaders.length} Liderów`}
							{" | "}
							{item.members?.length === 1
								? `${item.members.length} Pracownik`
								: `${item.members.length} Pracowników`}
						</p>
						<p className="text-gray-600 text-sm">Utworzono:</p>
						<p>{getSimpleDateFormat(item.createdAt)}</p>
					</div>
					<div className="flex justify-center md:justify-end items-center flex-wrap mt-4 md:mt-0 md:flex-nowrap">
						{item.members?.slice(0, 5).map((member, index) => (
							<Avatar
								key={index}
								src={member.profilePic}
								className=" ml-6 mr-2 mb-2 md:mb-0"
								size={52}
							/>
						))}
					</div>
				</div>
				<Button
					type="primary"
					className="w-full sm:w-auto text-sm sm:text-base"
					onClick={() => navigate(`/teams/${item._id}`)}
				>
					Zobacz szczegóły
				</Button>
			</div>
		)
	);
}

export default SingleCard;
