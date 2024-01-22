import React from "react";
import { useNavigate } from "react-router-dom";

function SidebarItem({ name, link, icon }) {
	const navigate = useNavigate();

	return (
		<div>
			<div
				className="flex items-center justify-between p-2 text-lg text-gray-600 hover:bg-gray-200 cursor-pointer"
				style={{ marginBottom: "10px" }}
				onClick={() => navigate(link)}
			>
				<div className="flex items-center">
					<div className="flex items-center justify-center w-10 m-4">
						{icon}
					</div>
					<span className="ml-2">{name}</span>
				</div>
			</div>
		</div>
	);
}

export default SidebarItem;
