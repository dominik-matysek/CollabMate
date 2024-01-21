import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function Register() {
	const navigate = useNavigate();
	const { buttonLoading, user } = useSelector((state) => state.loaders);
	const dispatch = useDispatch();
	const [profileImage, setProfileImage] = useState();

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		setProfileImage(file);
	};

	const clearProfileImage = () => {
		setProfileImage(null);
	};

	// const checkAuthentication = async () => {
	// 	try {
	// 		// Send a request to the server to check if the user is authenticated
	// 		const data = await userService.authenticate();

	// 		if (data.success) {
	// 			// User is authenticated, redirect to the main page
	// 			navigate("/");
	// 			message.warning({
	// 				content:
	// 					"Jeżeli pragniesz zmienić konto, proszę wyloguj się najpierw.",
	// 				duration: 3,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error("Error checking authentication:", error);
	// 	}
	// };

	const onFinish = async (values) => {
		try {
			dispatch(SetButtonLoading(true));

			const registrationResponse = await userService.register(values);

			if (!registrationResponse.success) {
				throw new Error(registrationResponse.message);
			}

			let imageUrl = null;
			if (profileImage) {
				const formData = new FormData();
				formData.append("file", profileImage);
				const uploadResponse = await userService.uploadImage(formData);

				if (uploadResponse.success) {
					imageUrl = uploadResponse.data;
				} else {
					throw new Error(uploadResponse.message);
				}
			}

			if (imageUrl) {
				const updateResponse = await userService.setInitialProfilePic(
					registrationResponse.userId,
					{ profilePic: imageUrl }
				);
				if (!updateResponse.success) {
					throw new Error(updateResponse.message);
				}
			}

			dispatch(SetButtonLoading(false));
			message.success("Rejestracja zakończyła się pomyślnie!");
			navigate("/login"); //navigate user to the login page even if the registration is ok
		} catch (error) {
			dispatch(SetButtonLoading(false));
			message.error(error.message);
		}
	};

	useEffect(() => {
		// If there's a user object, we assume the user is authenticated and redirect them
		if (user) {
			navigate("/");
			message.warning({
				content: "Jeżeli pragniesz zmienić konto, proszę wyloguj się najpierw.",
				duration: 3,
			});
		}
	}, [user]);

	return (
		<div className="grid grid-cols-2">
			<div className="bg-primary h-screen flex flex-col justify-center items-center">
				<div>
					<h1 className="text-7xl text-white">CollaboMate</h1>
					<span className="text-white mt-5">
						Współpraca bez granic - dla twojego sukcesu
					</span>
				</div>
			</div>
			<div className="flex justify-center items-center">
				<div className="w-[420px]">
					<h1 className="text-2xl text-gray-700">Zaczynajmy!</h1>
					<Divider />
					<Form layout="vertical" onFinish={onFinish}>
						<Form.Item
							label="Imię"
							name="firstName"
							rules={getAntdFormInputRules}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="Nazwisko"
							name="lastName"
							rules={getAntdFormInputRules}
						>
							<Input />
						</Form.Item>
						<Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
							<Input />
						</Form.Item>
						<Form.Item
							label="Hasło"
							name="password"
							rules={getAntdFormInputRules}
						>
							<Input type="password" />
						</Form.Item>
						<Form.Item label="Zdjęcie profilowe" name="file">
							<Input
								type="file"
								onChange={handleImageChange}
								accept="image/*"
							/>
							{/* {profileImage && <button onClick={clearProfileImage}>X</button>} */}
						</Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							block
							loading={buttonLoading}
						>
							{buttonLoading ? "Ładowanie" : "Utwórz konto"}
						</Button>
						<div className="flex justify-center mt-5">
							<span>
								Posiadasz konto? <Link to="/login">Zaloguj się</Link>
							</span>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
}

export default Register;
