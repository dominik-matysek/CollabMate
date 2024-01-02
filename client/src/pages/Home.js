// https://ant.design/components/layout - for navbar + sidebar desing
// https://ant.design/components/calendar - for calendar

// Sidebar, ekran główny (ten który widać dla gosci bez zalogowania się)
// Potem możesz już lecieć każdy page - a na bieżąco się najwyżej będzie dodawać rzeczy typu redux albo składowe komponenty
// Musisz zmienić rejestracje bo jak narazie nie mam tam opcji np. na dodanie zdjęcia
// dodawanie zdjęcia trzeba dokonczyc bo nie działa póki co
// nie wiem nie mam siły
// masz zrobiony design w folderze na pulpicie
// musisz siasc jeszcze nad request payload bo ci wysyla dane niezaszyfrowane - masz haslo normalnie widoczne w konsoli webowej
// musisz zrobić protected page żeby ci obejmować ustawianie usera w reduxie itp, i dopiero brać się za navbary i inne
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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}

export default Home;
