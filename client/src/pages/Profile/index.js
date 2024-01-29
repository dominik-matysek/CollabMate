import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useParams } from "react-router-dom";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import { getSimpleDateFormat } from "../../utils/helpers";
import { SetUser } from "../../redux/usersSlice";
import SingleCard from "../../components/SingleCard";

function Profile() {
  const { userId } = useParams();
  const { user: loggedInUser } = useSelector((state) => state.users);
  const [userProfile, setUserProfile] = useState(null);

  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const isOwnProfile = userProfile && userProfile._id === loggedInUser._id;

  const fetchUserData = async () => {
    if (userId === loggedInUser._id) {
      setUserProfile(loggedInUser);
    } else {
      try {
        dispatch(SetLoading(true));
        const response = await userService.getUserInfo(userId);
        dispatch(SetLoading(false));
        if (response.success) {
          setUserProfile(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(SetLoading(false));
        message.error(error.message);
      }
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await userService.updateProfile(userId, values);

      dispatch(SetLoading(false));
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

  const handleEdit = () => {
    if (isOwnProfile) {
      setEditMode(true);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditMode(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [userId, loggedInUser]);

  return (
    <div className="container mx-auto my-5 p-5">
      <div className="md:flex no-wrap md:-mx-2 ">
        {userProfile ? (
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto"
                  src={userProfile.profilePic}
                  alt="Zdjęcie profilowe"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                {userProfile.role === "ADMIN"
                  ? "ADMINISTRATOR"
                  : userProfile.role === "TEAM LEADER"
                  ? `LIDER w zespole: ${
                      userProfile.team ? userProfile.team.name : ""
                    }`
                  : userProfile.team
                  ? `PRACOWNIK w zespole: ${userProfile.team.name}`
                  : "PRACOWNIK"}
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
                    {getSimpleDateFormat(userProfile.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p>Ładowanie danych użytkownika...</p>
        )}

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
            {userProfile ? (
              <div className="text-gray-700">
                {editMode ? (
                  <Form
                    form={form}
                    name="editProfileForm"
                    initialValues={{
                      firstName: userProfile.firstName,
                      lastName: userProfile.lastName,
                      email: userProfile.email,
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
                    <div className="grid md:grid-cols-2 text-sm">
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Imię</div>
                        <div className="px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          {userProfile.firstName}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Nazwisko</div>
                        <div className="px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          {userProfile.lastName}
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                          Adres email
                        </div>
                        <div className="px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          <a className="text-blue-800">{userProfile.email}</a>
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">Rola</div>
                        <div className="px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          {userProfile.role}
                        </div>
                      </div>
                    </div>

                    {isOwnProfile && (
                      <Button
                        type="primary"
                        onClick={handleEdit}
                        className="mt-4"
                      >
                        Edytuj
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p>Ładowanie danych użytkownika...</p>
            )}
          </div>
          {userProfile && userProfile.team ? (
            <div className="mt-6">
              <SingleCard item={userProfile.team} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Profile;
