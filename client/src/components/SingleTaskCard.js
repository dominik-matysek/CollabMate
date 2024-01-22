import React from "react";
import { Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getSimpleDateFormat } from "../utils/helpers";

function SingleTaskCard({ item }) {
	const navigate = useNavigate();

	return (
		<div className="bg-white p-4 rounded-lg shadow mb-6 md:flex md:justify-between md:items-center">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
				<div className="flex-1">
					<div className="font-bold text-xl mb-2">{item.name}</div>
					<p className="text-gray-700 text-base">
						{item.members.length === 1
							? `${item.members.length} Pracownik`
							: `${item.members.length} Pracowników`}
					</p>
					<p className="text-gray-600 text-sm">Utworzono:</p>
					<p className="mb-2">{getSimpleDateFormat(item.createdAt)}</p>
					<p className="text-gray-600 text-sm">przez:</p>
					<p>
						{item.createdBy.firstName} {item.createdBy.lastName}
					</p>
				</div>
				<div className="flex justify-center   flex-wrap mt-4 md:mt-0 md:flex-nowrap">
					{item.members.slice(0, 5).map((member, index) => (
						<Avatar
							key={index}
							src={member.profilePic}
							className=" ml-2 mr-2 mb-2 md:mb-0"
							size={52}
						/>
					))}
				</div>
			</div>
			<div className="flex flex-col items-end">
				<Button
					type="primary"
					className="mb-2"
					onClick={() => navigate(`/tasks/${item._id}`)}
				>
					Zobacz szczegóły
				</Button>
				<p className="text-gray-600 text-sm mt-2">
					Estymowana data zakończenia:
				</p>
				<p className="text-gray-600 text-sm">
					{getSimpleDateFormat(item.dueDate)}
				</p>
			</div>
		</div>
	);
}

export default SingleTaskCard;
