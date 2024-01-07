import React, { useState } from "react";
import { Link } from "react-router-dom";
function SubHeader() {
	return (
		<div className="bg-gray-200 py-6">
			<div className="flex justify-center space-x-10">
				<Link to="/"> Zespoły </Link>
				<Link to="/"> Projekty </Link>
				<Link to="/"> Zespoły </Link>
				<Link to="/"> Zespoły </Link>
			</div>
		</div>
	);
}

export default SubHeader;
