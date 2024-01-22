import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Divider from "../../components/Divider";
import userService from "../../services/user";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function Login() {
	const navigate = useNavigate();
	const { buttonLoading, user } = useSelector((state) => state.loaders);
	const dispatch = useDispatch();

	const onFinish = async (values) => {
		try {
			dispatch(SetButtonLoading(true));
			const response = await userService.login(values);
			dispatch(SetButtonLoading(false));
			if (response.success) {
				message.success(response.message);
				navigate("/");
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetButtonLoading(false));
			message.error(error.message);
		}
	};

	useEffect(() => {
		if (user) {
			navigate("/");
			message.warning({
				content:
					"Jeżeli pragniesz zmienić konto, musisz się najpierw wylogować.",
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
					<h1 className="text-2xl text-gray-700">Zaloguj się</h1>
					<Divider />
					<Form layout="vertical" onFinish={onFinish}>
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

						<Button
							type="primary"
							htmlType="submit"
							block
							loading={buttonLoading}
						>
							{buttonLoading ? "Loading" : "Login"}
						</Button>

						<div className="flex justify-center mt-5">
							<span>
								Nie posiadasz konta? <Link to="/register">Zarejestruj się</Link>
							</span>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
}

export default Login;
