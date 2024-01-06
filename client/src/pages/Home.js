// https://ant.design/components/layout - for navbar + sidebar desing
// https://ant.design/components/calendar - for calendar

// ekran główny (ten który widać dla gosci bez zalogowania się)
// Potem możesz już lecieć każdy page - a na bieżąco się najwyżej będzie dodawać rzeczy typu redux albo składowe komponenty
// Musisz zmienić rejestracje bo jak narazie nie mam tam opcji np. na dodanie zdjęcia
// dodawanie zdjęcia trzeba dokonczyc bo nie działa póki co
// nie wiem nie mam siły
// masz zrobiony design w folderze na pulpicie
// musisz siasc jeszcze nad request payload bo ci wysyla dane niezaszyfrowane - masz haslo normalnie widoczne w konsoli webowej
// hurra! zrobiłeś po ponad 5 godzinach strone główną i profil użytkownika (obie rzeczy brzydkie że ja dupie)
// ale na szczescie jeszcze nie do konca działają tak jak powinny - np profil bo zrefreszowaniu strony wywala ci błąd że user jest null - ?

// Abstrachując od tego co masz tutaj - może zrezygnować z navbara/sidebara i zostać przy jednej rzeczy. I umozliwić użytkownikowi podgląd wszystkich projektów do jakich należy - niezależnie od teamu. W ogole przydałoby się jednak żeby można było należeć do kilku teamów i w różnych mieć różne role,
// ale to wymagałoby ze sobą dużo zmian w backendzie - do przemyślenia
// Chociaż w sumie to niekoniecznie - można zostać przy tym że jeden team, no nie wiem

// A może uderzyć w coś podobnego jak: https://dribbble.com/shots/2773385/attachments/2773385-Team-Ui?mode=media
// Czyli navbar to tylko logo, przycisk do otwierania/zamykania sidebara (ale niekoniecznie) i ikonka powiadomienia i profilu (może searchbar jak starczy czasu). Na sidebarze dashboard - czyli przenosi cie do strony głównej/home, niżej notyfikacje tak samo jak na navbarze, potem zespoły - zbiór wszystkich zespołów jakie istnieją, podsumowanie u góry liczby zespołów, pracowników , z boku gdzieś wszyscy leaderzy itp. Jakieś ograniczenia, np. może być kilku leadów w jednym zespole, ale dany lead może byc leadem i w ogóle członkiem tylko jednego zespołu. Zwykli userzy tak samo - mogą być członkami tylko jednego zespołu. ALE podgląd mają wszystkich zespołów jakie istnieją w systemie. Po naciśnięciu na jakiś pojawia im się panel tego zespołu - to co już masz mniej więcej czyli info ogólne, kto jest leadem, ilu i jacy członkowie. ALE jeśli nie jest cżłonkiem tego zespołu, to nic więcej typu projekty, zadania, kalendarz nie zobaczy. A jeżeli jest - no to widzi to i ma dostęp. Poniżej zespołów profil znowu (jak na tej stronce dribble) i tyle. ADMIN de facto widziałby to samo czyli zespoły wszystkie i info ALE on dodatkowo może zespół utworzyć, a jak wejdzie w konkretny zespół to może edytować nazwę, zmieniać członków itp. Do projektów i kalendarza nie ma dostępu, tak jakby nie był członkiem zespołu - co jest zgodne z prawdą. ADMIN dodatkowo miałby dodatkową rzecz na tym sidebarze tj. uzytkownicy - WSZYSCY użytkownicy systemu, podzieleni np. na leadów i zwykłych, może se wejść w ich profil (ale nie może go ofc edytować) albo np. usunąć kogoś całkowicie z serwisu.

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
import teamwork from "../assets/teamwork.jpg";
import onpoint from "../assets/on-point.jpg";
import { Carousel } from "antd";

function Home() {
  // const { user } = useSelector((state) => state.users);
  // console.log(`User in Profile Page ${user}`);

  const trustedBusinesses = [
    onpoint,
    onpoint,
    onpoint,
    onpoint,
    onpoint,
    onpoint,
    // ... Add all your images here
  ];

  return (
    <>
      <div className="pt-10 min-h-screen bg-gray-900 text-grey">
        {/* About Us Panel */}
        <section className="py-16 bg-gradient-to-b from-gray-200 via-gray-550 to-gray-600 text-grey">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">CollaboMate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src={teamwork}
                  alt="Company"
                  className="w-full h-128 object-cover"
                />
              </div>
              <div className="text-lg leading-relaxed">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus tempus ante eget tellus tincidunt, vel luctus orci
                  varius. Donec rutrum arcu id odio ullamcorper fermentum.
                </p>
                <p>
                  Nulla facilisi. Fusce venenatis neque eget fermentum feugiat.
                  Nullam vestibulum a orci nec hendrerit. Vivamus nec justo a
                  purus placerat consectetur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Panel */}
        <section
          id="main"
          className="py-16 bg-gradient-to-b from-gray-200 via-gray-550 to-gray-600 text-grey"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Zalety systemu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="text-lg leading-relaxed">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus tempus ante eget tellus tincidunt, vel luctus orci
                  varius. Donec rutrum arcu id odio ullamcorper fermentum.
                </p>
                <p>
                  Nulla facilisi. Fusce venenatis neque eget fermentum feugiat.
                  Nullam vestibulum a orci nec hendrerit. Vivamus nec justo a
                  purus placerat consectetur.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src={teamwork}
                  alt="Company"
                  className="w-full h-128 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Panel */}
        <section id="trusted" className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Zaufali nam</h2>
            <div className="flex justify-between">
              {trustedBusinesses.map((image, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img
                    src={image}
                    alt={`Trusted Business ${index + 1}`}
                    className="w-32 h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Panel */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8">Pozostań w kontakcie</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {/* Address */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl text-gray-600">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Adres</h3>
                  <p className="text-gray-700">123 Ulica, Miasto, Państwo</p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl text-gray-600">
                  <i className="fas fa-envelope"></i>
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-gray-700">dominik0matysek@gmail.com</p>
                </div>
              </div>
              {/* Phone Number */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl text-gray-600">
                  <i className="fas fa-phone-alt"></i>
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Telefon</h3>
                  <p className="text-gray-700">+123 456 7890</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
