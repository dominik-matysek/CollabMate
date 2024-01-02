import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../services/user";
import { SetNotifications, SetUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
// import { GetAllNotifications } from "../apicalls/notifications";
import { Avatar, Badge, Space } from "antd";
// import Notifications from "./Notifications";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

function ProtectedPage({ children }) {
  // const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.users);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await userService.authenticate();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      navigate("/login");
    }
  };

  // const getNotifications = async () => {
  // 	try {
  // 		dispatch(SetLoading(true));
  // 		const response = await GetAllNotifications();
  // 		dispatch(SetLoading(false));
  // 		if (response.success) {
  // 			dispatch(SetNotifications(response.data));
  // 		} else {
  // 			throw new Error(response.message);
  // 		}
  // 	} catch (error) {
  // 		dispatch(SetLoading(false));
  // 		message.error(error.message);
  // 	}
  // };

  useEffect(() => {
    getUser();
  }, []);

  // useEffect(() => {
  // 	if (user) {
  // 		getNotifications();
  // 	}
  // }, [user]);

  return (
    <>
      <Navbar user={user} toggleSidebar={toggleSidebar} />
      <Sidebar user={user} isSidebarOpen={isSidebarOpen} />
      <Footer />
      <Footer />
      <Footer />
      <Footer />
      <Footer />
      <Footer />
    </>

    //   <div>
    //     <div className="flex justify-between items-center bg-primary text-white px-5 py-4">
    //       <h1 className="text-2xl cursor-pointer" onClick={() => navigate("/")}>
    //         CollaboMate
    //       </h1>

    //       <div className="flex items-center bg-white px-5 py-2 rounded">
    //         <span
    //           className=" text-primary cursor-pointer underline mr-2"
    //           onClick={() => navigate("/profile")}
    //         >
    //           {user?.firstName}
    //         </span>
    //         <Badge
    //           // count={
    //           // 	notifications.filter((notification) => !notification.read)
    //           // 		.length
    //           // }
    //           className="cursor-pointer"
    //         >
    //           <Avatar
    //             shape="square"
    //             size="large"
    //             icon={
    //               <i className="ri-notification-line text-white rounded-full"></i>
    //             }
    //             // onClick={() => {
    //             // 	setShowNotifications(true);
    //             // }}
    //           />
    //         </Badge>

    //         <i
    //           className="ri-logout-box-r-line ml-10 text-primary"
    //           onClick={() => {
    //             localStorage.removeItem("token");
    //             navigate("/login");
    //           }}
    //         ></i>
    //       </div>
    //     </div>
    //     <div className="px-5 py-3">{children}</div>

    //     {/* {showNotifications && (
    // 				<Notifications
    // 					showNotifications={showNotifications}
    // 					setShowNotifications={setShowNotifications}
    // 					reloadNotifications={getNotifications}
    // 				/>
    // 			)} */}
    //   </div>
  );
}

export default ProtectedPage;
