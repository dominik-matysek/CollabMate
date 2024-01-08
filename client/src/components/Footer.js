import React from "react";
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
const { Footer } = Layout;

function FooterComponent() {
	const navigate = useNavigate();

	return (
		// <footer className="bg-white rounded-lg shadow bg-gray-200 m-4 flex flex-col">
		// 	<div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 flex-grow">
		// 		<div className="sm:flex sm:items-center sm:justify-between">
		// 			<div
		// 				onClick={() => navigate("/")}
		// 				className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse cursor-pointer"
		// 			>
		// 				<img src={logo} className="h-8" alt="CollaboMate Logo" />
		// 				<span className="self-center text-2xl  whitespace-nowrap text-xl font-bold mx-4">
		// 					CollaboMate
		// 				</span>
		// 			</div>
		// 			<ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 ">
		// 				<li>
		// 					<span
		// 						className="pr-10 cursor-pointer hover:underline"
		// 						onClick={() => navigate("/")}
		// 					>
		// 						O nas
		// 					</span>
		// 				</li>
		// 				<li>
		// 					<span
		// 						className="pr-10 cursor-pointer hover:underline"
		// 						onClick={() => navigate("/")}
		// 					>
		// 						Kontakt
		// 					</span>
		// 				</li>
		// 				<li>
		// 					<span
		// 						className="pr-10 cursor-pointer hover:underline"
		// 						onClick={() => navigate("/")}
		// 					>
		// 						Licencjonowanie
		// 					</span>
		// 				</li>
		// 				<li>
		// 					<span
		// 						className="pr-10 cursor-pointer hover:underline"
		// 						onClick={() => navigate("/")}
		// 					>
		// 						Polityka prywatności
		// 					</span>
		// 				</li>
		// 			</ul>
		// 		</div>
		// 		<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		// 		<span className="block text-sm  sm:text-center ">
		// 			© 2023{" "}
		// 			<span
		// 				onClick={() => navigate("https://flowbite.com/")}
		// 				className="hover:underline cursor-pointer"
		// 			>
		// 				CollaboMate™
		// 			</span>
		// 			. All Rights Reserved.
		// 		</span>
		// 	</div>
		// </footer>
		<Footer
			style={{ backgroundImage: "linear-gradient(to top, #138585, #58d1c9)" }}
		>
			<div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 flex-grow ">
				<div className="sm:flex sm:items-center sm:justify-between text-white">
					<div
						onClick={() => navigate("/")}
						className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse cursor-pointer"
					>
						<img src={logo} className="h-8" alt="CollaboMate Logo" />
						<span className="self-center text-2xl  whitespace-nowrap text-xl font-bold mx-4">
							CollaboMate
						</span>
					</div>
					<ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 ">
						<li>
							<span
								className="pr-10 cursor-pointer hover:underline"
								onClick={() => navigate("/")}
							>
								O nas
							</span>
						</li>
						<li>
							<span
								className="pr-10 cursor-pointer hover:underline"
								onClick={() => navigate("/")}
							>
								Kontakt
							</span>
						</li>
						<li>
							<span
								className="pr-10 cursor-pointer hover:underline"
								onClick={() => navigate("/")}
							>
								Licencjonowanie
							</span>
						</li>
						<li>
							<span
								className="pr-10 cursor-pointer hover:underline"
								onClick={() => navigate("/")}
							>
								Polityka prywatności
							</span>
						</li>
					</ul>
				</div>
				<hr className="my-6 border-white-200 sm:mx-auto lg:my-8 " />
				<span className="block text-sm  sm:text-center text-white">
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
