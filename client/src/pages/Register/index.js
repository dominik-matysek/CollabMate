import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
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

	const onFinish = async (values) => {
		try {
			dispatch(SetButtonLoading(true));

			const payload = {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				password: values.password,
			};

			const registrationResponse = await userService.register(payload);

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
			navigate("/login");
		} catch (error) {
			dispatch(SetButtonLoading(false));
			message.error(error.message);
		}
	};

	useEffect(() => {
		if (user) {
			navigate("/teams");
			message.warning({
				content:
					"Jeżeli pragniesz zmienić konto, musisz się najpierw wylogować.",
				duration: 3,
			});
		}
	}, [user]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2">
			<div className="bg-primary min-h-screen flex flex-col justify-center items-center px-4 py-8">
				<div>
					<h1 className="text-3xl md:text-7xl text-white text-center">
						CollaboMate
					</h1>
					<span className="text-white mt-5 block text-center">
						Współpraca bez granic - dla twojego sukcesu
					</span>
				</div>
			</div>
			<div className="flex justify-center items-center px-4 py-8">
				<div className="w-full max-w-md">
					<h1 className="text-2xl text-gray-700 text-center">Zaczynajmy!</h1>
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
