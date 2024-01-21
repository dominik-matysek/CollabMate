import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../services/user";
import { SetNotifications, SetUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
import { Avatar, Badge, Space } from "antd";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import teamwork from "../assets/teamwork.jpg";
import onpoint from "../assets/on-point.jpg";
import { Carousel } from "antd";

function Home() {
	const trustedBusinesses = [
		onpoint,
		onpoint,
		onpoint,
		onpoint,
		onpoint,
		onpoint,
		// ... Add all your images here
	];

	return (
		<>
			<div className="pt-10 min-h-screen bg-gray-900 text-grey">
				{/* About Us Panel */}
				<section className="py-16 bg-gradient-to-b from-gray-200 via-gray-550 to-gray-600 text-grey">
					<div className="container mx-auto px-4">
						<h2 className="text-4xl font-bold mb-8">CollaboMate</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
							<div className="rounded-lg overflow-hidden shadow-xl">
								<img
									src={teamwork}
									alt="Company"
									className="w-full h-128 object-cover"
								/>
							</div>
							<div className="text-lg leading-relaxed">
								<p className="mb-4">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Phasellus tempus ante eget tellus tincidunt, vel luctus orci
									varius. Donec rutrum arcu id odio ullamcorper fermentum.
								</p>
								<p>
									Nulla facilisi. Fusce venenatis neque eget fermentum feugiat.
									Nullam vestibulum a orci nec hendrerit. Vivamus nec justo a
									purus placerat consectetur.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* About Us Panel */}
				<section
					id="main"
					className="py-16 bg-gradient-to-b from-gray-200 via-gray-550 to-gray-600 text-grey"
				>
					<div className="container mx-auto px-4">
						<h2 className="text-4xl font-bold mb-8">Zalety systemu</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
							<div className="text-lg leading-relaxed">
								<p className="mb-4">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Phasellus tempus ante eget tellus tincidunt, vel luctus orci
									varius. Donec rutrum arcu id odio ullamcorper fermentum.
								</p>
								<p>
									Nulla facilisi. Fusce venenatis neque eget fermentum feugiat.
									Nullam vestibulum a orci nec hendrerit. Vivamus nec justo a
									purus placerat consectetur.
								</p>
							</div>
							<div className="rounded-lg overflow-hidden shadow-xl">
								<img
									src={teamwork}
									alt="Company"
									className="w-full h-128 object-cover"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Trusted By Panel */}
				<section id="trusted" className="py-16 bg-gray-800 text-white">
					<div className="container mx-auto px-4">
						<h2 className="text-4xl font-bold mb-8">Zaufali nam</h2>
						<div className="flex justify-between">
							{trustedBusinesses.map((image, index) => (
								<div key={index} className="flex items-center justify-center">
									<img
										src={image}
										alt={`Trusted Business ${index + 1}`}
										className="w-32 h-32 object-cover"
									/>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Contact Panel */}
				<section id="contact" className="py-16 bg-white">
					<div className="container mx-auto px-4">
						<h2 className="text-4xl font-bold mb-8">Pozostań w kontakcie</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-16">
							{/* Address */}
							<div className="flex items-center space-x-4">
								<span className="text-2xl text-gray-600">
									<i className="fas fa-map-marker-alt"></i>
								</span>
								<div>
									<h3 className="text-xl font-semibold mb-2">Adres</h3>
									<p className="text-gray-700">
										123 Ulica, Kod pocztowy, Miasto, Państwo
									</p>
								</div>
							</div>
							{/* Email */}
							<div className="flex items-center space-x-4">
								<span className="text-2xl text-gray-600">
									<i className="fas fa-envelope"></i>
								</span>
								<div>
									<h3 className="text-xl font-semibold mb-2">Email</h3>
									<p className="text-gray-700">collabomate@gmail.com</p>
								</div>
							</div>
							{/* Phone Number */}
							<div className="flex items-center space-x-4">
								<span className="text-2xl text-gray-600">
									<i className="fas fa-phone-alt"></i>
								</span>
								<div>
									<h3 className="text-xl font-semibold mb-2">Telefon</h3>
									<p className="text-gray-700">+123 456 7890</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}

export default Home;
