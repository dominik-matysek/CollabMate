import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
