// Strona dla nieistniejących adresów URL

import React from "react";

function NotFoundPage() {
	return (
		<div className="flex items-center justify-center h-screen">
			<div>
				<h1
					className="text-8xl font-bold text-center"
					style={{ color: "#138585" }}
				>
					404 - Not Found
				</h1>
				<p className="text-2xl text-center">
					Niestety, strona której szukasz nie istnieje
				</p>
			</div>
		</div>
	);
}

export default NotFoundPage;
