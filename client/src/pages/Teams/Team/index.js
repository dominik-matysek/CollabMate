import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Table } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import teamService from "../../../services/team";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import {
  getAntdFormInputRules,
  getSimpleDateFormat,
} from "../../../utils/helpers";
import { SetNotifications, SetUser } from "..//../../redux/usersSlice";
import CustomTable from "../../../components/CustomTable";
import { IoTrashBin } from "react-icons/io5";

function Team() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const fetchTeamData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await teamService.getTeamById(teamId);
      dispatch(SetLoading(false));
      if (response.success) {
        setTeam(response.data);
        console.log("Zespół:", team);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigate(`/profile/${record._id}`);
      },
    };
  };

  const columns = [
    // Tu by mogło być jeszcze małe zdjecie profilowe kwadratowe albo okrągłe, jak juz ogarniesz zdjecia
    {
      title: "Imię",
      dataIndex: "firstName",
    },
    {
      title: "Nazwisko",
      dataIndex: "lastName",
    },
    {
      title: "Data dołączenia",
      dataIndex: "createdAt",
      render: (text) => getSimpleDateFormat(text),
    },
    {
      title: "Akcja",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-4">
            {/* Niżej możesz wrzucić onClick={() => onDelete(record._id)}  jak sie zdecydujesz na usuwanie usera */}
            <IoTrashBin />
          </div>
        );
      },
    },
  ];

  return (
    team && (
      <div className="container mx-auto my-5 p-5">
        {/* Team Name and Creation Date */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
          <p className="text-gray-600">
            Data utworzenia: {getSimpleDateFormat(team.createdAt)}
          </p>
        </div>
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
                {team.teamLead.firstName} {team.teamLead.lastName}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                Team Leader
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
                    {getSimpleDateFormat(team.teamLead.createdAt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center justify-between font-semibold text-gray-900 leading-8">
                <div className="flex items-center space-x-2">
                  <span>
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
                  <span className="tracking-wide">Lista członków</span>
                </div>
                <Button>Dodaj użytkownika</Button>
              </div>
              {team.members && (
                <Table
                  dataSource={team.members}
                  columns={columns}
                  onRow={onRowClick}
                  className="mt-4"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Team;
