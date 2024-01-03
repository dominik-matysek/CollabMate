import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import { getSimpleDateFormat } from "../../utils/helpers";
import { SetNotifications, SetUser } from "../../redux/usersSlice";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  console.log(`User in Profile Page ${user}`);
  const userId = user._id;

  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditMode(false);
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      console.log("Received values:", values);

      // Update user profile with new data (e.g., using API call)
      // ...
      const response = await userService.updateProfile(userId, values);

      dispatch(SetButtonLoading(false));

      if (response.success) {
        dispatch(SetUser(response.data));
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
      setEditMode(false);
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div className="container mx-auto my-5 p-5">
      <div className="md:flex no-wrap md:-mx-2 ">
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="bg-white p-3 border-t-4 border-green-400">
            <div className="image overflow-hidden">
              <img
                className="h-auto w-full mx-auto"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
              {user.firstName} {user.lastName}
            </h1>
            <h3 className="text-gray-600 font-lg text-semibold leading-6">
              {user.role} w {user.teams[0]}
            </h3>

            <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
              <li className="flex items-center py-3">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                    Aktywny
                  </span>
                </span>
              </li>
              <li className="flex items-center py-3">
                <span>Data dołączenia</span>
                <span className="ml-auto">
                  {getSimpleDateFormat(user.createdAt)}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-9/12 mx-2 h-64">
          <div className="bg-white p-3 shadow-sm rounded-sm">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
              <span clas="text-green-500">
                <svg
                  className="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="tracking-wide">Profil użytkownika</span>
            </div>
            <div className="text-gray-700">
              {editMode ? (
                <Form
                  form={form}
                  name="editProfileForm"
                  initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    // bio: "siema",
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="firstName"
                    label="Imię"
                    rules={getAntdFormInputRules}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    label="Nazwisko"
                    rules={getAntdFormInputRules}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Adres email"
                    rules={getAntdFormInputRules}
                  >
                    <Input />
                  </Form.Item>
                  {/* <Form.Item
                    name="bio"
                    label="Bio"
                    rules={getAntdFormInputRules}
                  >
                    <Input.TextArea />
                  </Form.Item> */}
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Zapisz
                    </Button>
                    <Button onClick={handleCancel} className="ml-2">
                      Anuluj
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <div>
                  {/* Display user information in view mode */}
                  <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Imię</div>
                      <div className="px-4 py-2">{user.firstName}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Nazwisko</div>
                      <div className="px-4 py-2">{user.lastName}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Adres email</div>
                      <div className="px-4 py-2">
                        <a className="text-blue-800">{user.email}</a>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Rola</div>
                      <div className="px-4 py-2">{user.role}</div>
                    </div>
                  </div>
                  {/* ... (rest of your view mode code) */}
                  <Button onClick={handleEdit}>Edytuj</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
