import { Form, Input, message, Modal, Select, Button, Card } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import teamService from "../../services/team";
import { getAntdFormInputRules } from "../../utils/helpers";
import notificationService from "../../services/notification";

const { Option } = Select;

// Nie wiem czy edycje zespołu nie lepiej zrobić tak, że po naciśnięciu na dany zespół przenosi cie do profilu zespołu (analogicznie jak masz profil uzytkownika) i tam jako admin możesz zmienić nazwę i np usunąć lub dodać userów do zespołu. Profil zespołu i tak by ci się przydał myślę, więc może warto
// to tak zrobić. A tworzenie zespolu zostaw jak jest jest git raczej.

function TeamForm({ reloadData, users }) {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const [availableUsers, setAvailableUsers] = useState(users); // for reseting users in select after creation of team

	const onFinish = async (values) => {
		try {
			dispatch(SetLoading(true));
			// create team
			const payload = {
				name: values.name,
				teamLeadIds: values.teamLeaders,
			};
			const response = await teamService.createTeam(payload);

			if (response.success) {
				message.success(response.message);

				// form.resetFields();

				//exclude the selected team leaders
				setAvailableUsers((prevUsers) =>
					prevUsers.filter((user) => !values.teamLeaders.includes(user._id))
				);

				form.resetFields();
				reloadData();

				// Send notification to added team leaders
				const notificationPayload = {
					users: values.teamLeaders, // Array of user IDs
					title: "Added to Team",
					description: `You have been added to the team ${values.name}.`,
					link: `/teams/${response.data._id}}`, // Adjust link to point to the team page or relevant resource
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	useEffect(() => {
		setAvailableUsers(users);
	}, [users]);

	return (
		<Card title="Nowy zespół" bordered={false} className="w-full shadow-lg">
			<Form form={form} onFinish={onFinish} layout="vertical">
				<Form.Item name="name" rules={getAntdFormInputRules}>
					<Input placeholder="Nazwa zespołu" />
				</Form.Item>
				<Form.Item name="teamLeaders" rules={getAntdFormInputRules}>
					<Select
						mode="multiple"
						placeholder="Wybierz lidera/liderów"
						filterOption={(input, option) =>
							option.children.toLowerCase().includes(input.toLowerCase())
						}
						showSearch // Enables the search functionality
					>
						{availableUsers
							.filter((user) => user.role === "EMPLOYEE" && !user.team)
							.map((user) => (
								<Select.Option key={user._id} value={user._id}>
									{user.firstName} {user.lastName}
								</Select.Option>
							))}
						{/* {users
							.filter((user) => user.role === "EMPLOYEE" && !user.team)
							.map((user) => (
								<Select.Option key={user._id} value={user._id}>
									{user.firstName} {user.lastName}
								</Select.Option>
							))} */}
					</Select>
				</Form.Item>
				{/* Similar conditional rendering can be applied for other specific fields */}
				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full">
						Utwórz zespół
					</Button>
				</Form.Item>
			</Form>
		</Card>
		// <Modal
		//   title={team ? "EDYTUJ ZESPÓŁ" : "UTWÓRZ ZESPÓŁ"}
		//   open={show}
		//   onCancel={() => setShow(false)}
		//   centered
		//   width={700}
		//   onOk={() => {
		//     formRef.current.submit();
		//   }}
		//   okText="Zapisz"
		// >
		//   <Form
		//     layout="vertical"
		//     ref={formRef}
		//     onFinish={onFinish}
		//     // initialValues={team ? { ...team, teamLead: team?.teamLead?._id } : null}
		//     // initialValues={team}
		//     initialValues={editInitialValues}
		//   >
		//     <Form.Item
		//       label="Nazwa zespołu"
		//       name="name"
		//       rules={getAntdFormInputRules}
		//     >
		//       <Input placeholder="Nazwa Zespołu" />
		//     </Form.Item>

		//     <Form.Item
		//       label="Team Leader"
		//       name="teamLead"
		//       rules={getAntdFormInputRules}
		//     >
		//       <Select
		//         placeholder="Wybierz lidera zespołu"
		//         disabled={team ? true : false}
		//         onChange={setTeamLeader}
		//         optionFilterProp="children"
		//         filterOption={(input, option) =>
		//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
		//         }
		//       >
		//         {users
		//           .filter((user) => user.role !== "ADMIN") // Exclude users with the 'ADMIN' role
		//           .map((user) => (
		//             <Option key={user._id} value={user._id}>
		//               {user.firstName} {user.lastName}
		//             </Option>
		//           ))}
		//       </Select>
		//     </Form.Item>

		//     {/* Niżej masz do zrobienia listę wszystkich użytkowników i ewentualnie jeszcze jakieś formy jakbyś coś potrzebował/wymyślił dodatkowo */}
		//     {/* Być może możesz do tej listy jakoś wykorzystać usersSlice i reduxa w ogóle? ale to musiałbyś sprawdzić jak to ugryźć */}
		//     {/* Chyba najlepiej jakbyś passował z index.js tych userów, bo tam też ich użyjesz żeby wpisać liczbę userów w danym zespole */}
		//     {/* New Form.Item for user selection */}
		//     <Form.Item label="Użytkownicy" name="users">
		//       <Select
		//         mode="multiple"
		//         placeholder="Wybierz użytkowników"
		//         optionFilterProp="children"
		//         filterOption={(input, option) =>
		//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
		//         }
		//       >
		//         {users
		//           .filter(
		//             (user) => user.role !== "ADMIN" && user._id !== teamLeader
		//           ) // Exclude users with the 'ADMIN' role
		//           .map((user) => (
		//             <Option key={user._id} value={user._id}>
		//               {user.firstName} {user.lastName}
		//             </Option>
		//           ))}
		//       </Select>
		//     </Form.Item>
		//   </Form>
		// </Modal>
	);
}

export default TeamForm;
