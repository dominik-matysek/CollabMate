import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import { Divider } from "antd";

const navigation = [
  {
    name: "Zespoły",
    link: "/teams",
    current: false,
    displayForUser: ["ADMIN"],
  },
  {
    name: "Użytkownicy",
    link: "/users",
    current: false,
    displayForUser: ["ADMIN"],
  },
  {
    name: "Projekty",
    link: "/projects",
    current: false,
    displayForUser: ["EMPLOYEE", "TEAM LEADER"],
  },

  {
    name: "Członkowie",
    link: "/members",
    current: false,
    displayForUser: ["EMPLOYEE", "TEAM LEADER"],
  },
  {
    name: "Kalendarz",
    link: "/calendar",
    current: false,
    displayForUser: ["EMPLOYEE", "TEAM LEADER"],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const filterNavigation = (navigation, userRole) => {
  // Filter elements based on user authentication status and role
  return navigation.filter((item) => {
    return item.displayForUser.includes(userRole);
  });
};

function Sidebar({ user, isSidebarOpen }) {
  const navigate = useNavigate();
  const userRole = user?.role;

  const filteredNavigation = filterNavigation(navigation, userRole);

  return (
    <div>
      <aside
        id="default-sidebar"
        className={`fixed rounded-md top-40 bottom-40 left-0 z-40 w-64 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full rounded-r-lg px-3 py-4 overflow-y-auto bg-orange-50">
          <ul className="space-y-2 font-medium list-none">
            {filteredNavigation.map((item) => (
              <li
                key={item.name}
                onClick={() => navigate(item.link)}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white cursor-pointer"
                    : "text-gray-900 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </li>
            ))}
            {/* <li>
              <Link
                to="/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={{ textDecoration: "none" }}
              >
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/teams"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={{ textDecoration: "none" }}
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Zespoły</span>
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                style={{ textDecoration: "none" }}
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
