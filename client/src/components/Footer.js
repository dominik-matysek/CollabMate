import React from "react";
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
const { Footer } = Layout;

function FooterComponent() {
	const navigate = useNavigate();

	return (
		<Footer
			style={{ backgroundImage: "linear-gradient(to top, #138585, #58d1c9)" }}
		>
			<div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-white">
					<div
						onClick={() => navigate("/")}
						className="flex items-center mb-4 lg:mb-0 space-x-3 cursor-pointer"
					>
						<img src={logo} className="h-8" alt="CollaboMate Logo" />
						<span className="self-center text-2xl font-bold mx-4">
							CollaboMate
						</span>
					</div>
					<ul className="flex flex-col lg:flex-row items-center mb-6 text-sm font-medium lg:mb-0">
						{[
							"O nas",
							"Kontakt",
							"Licencjonowanie",
							"Polityka prywatności",
						].map((item, index) => (
							<li key={index} className="mb-2 lg:mb-0 lg:mr-10">
								<span
									className="cursor-pointer hover:underline"
									onClick={() => navigate("/")}
								>
									{item}
								</span>
							</li>
						))}
					</ul>
				</div>
				<hr className="my-6 border-gray-200 lg:mx-auto lg:my-8" />
				<span className="block text-sm text-center text-white">
					© 2023{" "}
					<span
						onClick={() => navigate("/")}
						className="hover:underline cursor-pointer"
					>
						CollaboMate™
					</span>
					. All Rights Reserved.
				</span>
			</div>
		</Footer>
	);
}

export default FooterComponent;
