import React from "react";
import { Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getSimpleDateFormat } from "../utils/helpers";

function SingleTaskCard({ item }) {
	const navigate = useNavigate();

	return (
		<div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
			<div className="flex justify-between items-center mb-4">
				<div className="mr-20">
					<div className="font-bold text-xl mb-2">{item.name}</div>
					<p className="text-gray-700 text-base mb-2">
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
				<div className="flex items-center ">
					{item.members.slice(0, 5).map((member, index) => (
						<Avatar
							key={index}
							src={member.profilePic}
							className="mr-4"
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
