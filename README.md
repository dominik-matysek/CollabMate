
# CollaboMate

Aplikacja internetowa, której celem jest wspomaganie procesu pracy zespołowej nad projektami. Aplikacja umożliwia rejestrację nowych użytkowników, którzy będą członkami zespołu. Każdy użytkownik posiada różne uprawnienia, zależne od pełnionej przez niego funkcji w zespole. Użytkownicy pełniący funkcję menadżera zespołu bądź administratora są odpowiedzialni m.in. za dodanie użytkowników do swoich zespołów bądź przypisanie im odpowiednich funkcji. Aplikacja umożliwia tworzenie zadań i przypisywanie ich do konkretnych członków zespołu. Członkowie zespołu mają możliwość dodawania komentarzy, przypisywania priorytetów bądź zmiany terminu wykonania.
Ponadto aplikacja zawiera kalendarz umożliwiający planowanie i przeglądanie zadań, spotkań i innych istotnych dla zespołu terminów. Członkowie zespołu mogą oznaczyć dostępność, zaplanowane zadania bądź spotkania, a także otrzymywać powiadomienia o nadchodzących terminach, zmianach w zadaniach bądź otrzymanych wiadomościach.


## Cechy

Pracownik w systemie może pełnić jedną z czterech ról:
- Użytkownik nieprzypisany do zespołu
- Administrator - rola ustalana odgórnie
- Lider zespołu - rola ustalana przez administratora w trakcie dodawania użytkownika do danego zespołu
- Pracownik zespołu - rola ustalana przez administratora w trakcie dodawania użytkownika do danego zespołu

Administrator, oprócz posiadania zakresu funkcjonalności zwykłego użytkownika, jest odpowiedzialny za zarządzanie zespołami i resztą istniejących w serwisie użytkowników. Ma więc dostęp do podglądu i usuwania z systemu użytkowników nieprzypisanych do żadnego zespołu, może też tworzyć zespoły lub modyfikować te już istniejące, dodając, usuwając i ustawiając rolę ich członków. Korzystając z dziennika zdarzeń, może nadzorować obecnośc w systemie takich akcji jak:
- próba zalogowania do serwisu (zakończona sukcesem bądź porażką)
- wylogowanie z serwisu
- utworzenie nowego konta w serwisie

Użytkownik dodany do zespołu automatycznie dostaje dostęp do podglądu większości jego zasobów, takich jak wydarzenia dostępne w kalendarzu, projekty i zadania wewnątrz projektów. Może dodatkowo tworzyć własne wydarzenia, modyfikować je i dodawać do nich pozostałych członków zespołu.

Jego możliwości zwiększają się wraz z dodaniem do projektu przez lidera. Użytkownik jest w stanie tworzyć nowe zadania oraz usuwać i modyfikować zadania których jest twórcą. W zakres edycji zadania wchodzi przede wszystkim możliwość modyfikacji jego właściwości takich jak tytuł, opis, status zadania, a także dodanie lub usunięcie komentarza, załączenie plików oraz dodanie bądź usunięcie pozostałych członków zadania.

Członek zadania nie musi być jego twórcą żeby również mieć dostęp do wykonania
podstawowych czynności w jego obszarze. Użytkownik dodany do zadania przez lidera lub innego członka projektu może dodać i usunąć komentarz lub udostępnić wybrany przez siebie plik w zadaniu. Użytkownicy którzy są członkami zespołu, ale nie konkretnego projektu lub zadania, są w stanie zobaczyć komentarze zostawione w danym zadaniu, ale nie udostępnione pliki.

Za nieograniczone zarządzanie wszystkim, co dzieje się w zespole odpowiadają liderzy zespołu. Mają oni dostęp do wszystkich funkcjonalności charakterystycznych dla członków projektów i członków zadań, bez konieczności bycia dodanym do konkretnego zasobu. Mogą więc wpływać na istnienie i właściwości zadań lub wydarzeń nawet jeżeli nie są ich twórcami. Dodatkowo od ich decyzji zależy, czy zadanie zakończone przez pozostałych użytkowników zostanie zaakceptowane. Liderzy mogą również tworzyć nowe projekty, modyfikować ich właściwości oraz dodawać lub usuwać użytkowników z projektów.

## Konfiguracja i uruchomienie aplikacji (localhost)

Aby uruchomić projekt lokalnie, po jego pobraniu i rozpakowaniu w odpowiednim miejscu, użyj polecenia do instalacji potrzebnych modułów i bibliotek

```bash
  npm i
```
w folderze głównym projektu oraz w folderze /client.

Następnie utwórz plik środowiskowy '.env' w folderze głównym. Umieść w nim zawartość pliku '.env-example' i uzupełnij je o odpowiednie informacje.

Z uwagi na poufność powyższych informacji nie są one dostarczane do zawartości projektu. Każdy użytkownik pragnący uruchomić aplikację na własnym urządzeniu powinien dostarczyć własne dane do pliku ’.env’. W tym celu konieczne będzie utworzenie darmowego konta w serwisach MongoDB oraz Cloudinary. Do utworzenia kluczy tokenów można wykorzystać jeden z wielu ogólnodostępnych generatorów.

Na koniec należy użyć następujących komendy:
- w folderze głównym do uruchomienia serwera
```bash
  nodemon server/src/server.js
```
lub
```bash
  node server/src/server.js
```
- w folderze /client do uruchomienia serweru React
```bash
  npm start
```
Aplikacja otworzy się automatycznie pod adresem ’localhost:3000’.
## Instrukcja użytkowania
**Z uwagi na obszerność systemu, zaprezentowana zostanie jedynie większość funkcjonalności spośród wszystkich dostępnych dla różnych rodzajów użytkowników.**

Aby przejść do aplikacji, użyć adresu: https://collabmate.onrender.com/.

Po przejściu, w przeglądarce powinna pojawić się domyślna strona logowania.
![image](https://github.com/user-attachments/assets/3b9baa41-cde6-45e4-8753-e61cc18d97d2)

W tym miejscu użytkownik może zalogować się na swoje konto. Jeżeli użytkownik korzysta z serwisu po raz pierwszy, musi najpierw dokonać rejestracji
![image](https://github.com/user-attachments/assets/e24672a6-b0b6-45ff-b8e5-89da337d4c53)

Po poprawnym zalogowaniu się na swoje konto, użytkownik zostanie przekierowany do
strony głównej (tutaj widok dla administratora, z panelem wszystkich użytkowników i dziennikiem zdarzeń).
![image](https://github.com/user-attachments/assets/d9a92a5b-9b95-44ba-9fe5-39cf35e2e4e3)

Profil każdego użytkownika prezentuje się następujący sposób (dla użytkowników nieprzypisanych do zespołu nie będzie on widniał na profilu).
![image](https://github.com/user-attachments/assets/ab98e233-be4c-472f-a1eb-37bdbbf5230c)
Każdy użytkownik ma możliwość edycji podstawowych informacji związanych ze swoim
kontem, takich jak imię, nazwisko oraz adres email.

Na stronie głównej zespołów każdy użytkownik ma możliwosć podejrzenia bardziej
szczegółowych informacji o danym zespole po kliknięciu przycisku "Zobacz szczegóły" (na zdjęciu widok dla administratora).
![image](https://github.com/user-attachments/assets/c733b9b1-a31b-49a3-97e5-5e0aaf7aef56)
**Administrator** ma dodatkowo możliwość usunięcia zespołu (jeśli nie posiada on żadnych aktywnych projektów) lub dodania nowego członka do zespołu (zarówno lidera jak i pracownika).

W prawym rogu paska nawigacyjnego można zaobserwować ikonę powiadomienia
![image](https://github.com/user-attachments/assets/7bc651fd-71dd-4ab6-a77d-ebf16696b586)
Po naciśnięciu na powiadomienia związane z np. dodaniem pracownika do nowego projektu, zostanie on przeniesiony do zbioru wszystkich projektów w zespole.


1. **Administrator**
   
Ma dostęp do panelu prezentującego wszystkich użytkowników zarejestrowanych w systemie, po naciśnięciu odpowiedniego pola na panelu bocznym lub panelu
górnym
![image](https://github.com/user-attachments/assets/b4599b51-04aa-4f38-9a64-2a927a172488)

Może również podglądać dziennik zdarzeń związanych z dostępem do serwisu (adres IP nie uwzględniony na screenie z kwestii bezpieczeństwa)
<img width="1266" alt="image" src="https://github.com/user-attachments/assets/366ef60e-67c9-46d2-9a61-1aa6a0ba5283" />


2. **Członek zespołu**

Członek zespołu po wejściu na profil swojego zespołu ma dostęp do dodatkowej zawartości - projektów oraz kalendarza.

Panel prezentujący wszystkie projekty w zespole ma prawie identyczny układ strony
i korzysta z podobnych komponentów, aby zapewnić szybki dostęp do najistotniejszych
informacji.
![image](https://github.com/user-attachments/assets/80f7b6ef-e4ea-47d5-9d19-03eb62cf1f7c)
**Lider** może z poziomu wszytkich projektów utworzyć nowy projekt i przypisac do niego członków zespołu.

Po naciśnięciu przycisku ’Zobacz szczegóły’ na karcie wybranego projektu członek
zostanie przekierowany do bardziej szczegółowego podglądu projektu.
![image](https://github.com/user-attachments/assets/17154ff7-3513-4d87-ad7f-4d9d78c42155)
**Lider** może z tego poziomu dodatkowo edytować opis projektu, status projektu, usunąć lub dodać członków zespołu do projektu lub całkowicie usunąć projekt (o ile nie ma w nim zadań o statusie ’w trakcie’ lub ’zakończony’ - które czekają na zatwierdzenie lidera.).

Z panelu wybranego projektu można przenieść się do zestawienia wszystkich zadań
utworzonych w tym projekcie. W tym miejscu, oprócz statystyk dotyczących projektu
i listy wszystkich zadań, dostepny jest panel umożliwiający utworzenie nowego zadania.
Panel ten jest dostępny nie tylko dla lidera zespołu jak w przypadku tworzenia projektów,
ale dla wszystkich członków projektu.
![image](https://github.com/user-attachments/assets/963785bc-c308-49cc-be0c-730f679648f0)

Po użycia przycisku ’Zobacz szczegóły’ pojawia się panel prezentujący wszystkie kluczowe dane związane z zadaniem.
![image](https://github.com/user-attachments/assets/54d98c3a-872b-47ae-bccb-19158d2579f9)

Zarówno **lider**, jak i **twórca zadania** mają dostęp do wszystkich funkcjonalności związanych z zadaniem, takich jak edycja opisu, zmiana statusu (wyjątkiem jest zmiana statusu
z ’zakończony’ na ’zaakceptowany’ bądź ’anulowany’ - tą akcje może wykonać wyłącznie
lider), zmiana stopnia ważności oraz dodanie lub usunięcie członka projektu z zadania.

Usunięcie zadania może zostać wykonane tylko w sytuacji, w której zadanie ma status
inny niż ’w trakcie’ lub ’zakończony’.
![image](https://github.com/user-attachments/assets/c2d15a05-4f72-4f0c-afd3-643b50b6e98e)

Dodatkowo lider oraz każdy członek zadania może zamieścić w nim komentarz, usunąć swój komentarz, załączyć plik oraz usunąć znajdujące się w zadaniu pliki. Mogą oni
również podejrzeć zamieszczone pliki naciskając na nie. Zostaną przeniesieni do nowego
okna w przeglądarce, skąd będą mogli podejrzeć zawartość pliku lub pobrać go na swoje
urządzenie.

Ostatni zbiór funkcjonalności oddanych do użytku pracownikom to kalendarz i powiązane z nim wydarzenia. Jest on dostępny dla wszystkich członków zespołu i nie oferuje
zróżnicowanych funkcjonalności bazujących na dostępie do danego projektu lub zadania.
![image](https://github.com/user-attachments/assets/ecd13361-00b1-474f-813d-83c53d09a5b0)

Każdy członek zespołu może utworzyć wydarzenie bądź zostać zaproszony do wydarzenia przez innego członka zespołu. Podczas tworzenia należy wybrać tytuł, opis oraz
datę wydarzenia.
![image](https://github.com/user-attachments/assets/f8544eaf-700e-42fc-82a5-5a2596306cff)

Liderzy oraz twórcy poszczególnych wydarzeń mogą je dodatkowo edytować po utworzeniu. Oprócz edycji tytułu wydarzenia i jego opisu mogą swobodnie dodawać pozostałych członków projektu i usuwać już dodanych do wydarzenia użytkowników. Mogą
również usunąć wydarzenie 

Użytkownik zaproszony do wydarzenia dostaje stosowne powiadomienie
![image](https://github.com/user-attachments/assets/ee3293ff-5a08-49fa-a30e-db36f8e3efa8)

## Wykorzystane technologie
### Warstwa interfejsu
Warstwa użytkownika wykorzystuje przede wszystkim bibliotekę React.js która umożliwia tworzenie interaktywnych elementów interfejsu użytkownika.

W celu rozszerzenia możliwości oferowanych przez bibliotekę React, wykorzystano
dodatkowe, zewnętrzne moduły, takie jak:
- Ant Design - popularnie znany jako ’antd’. Jest to biblioteka interfejsu użytkownika oferująca zestaw estetycznych, responsywnych i gotowych do użycia komponentów. Obejmuje szeroką gamę elementów, takich jak formularze, przycisku, menu
i wiele innych.
- Tailwind CSS - framework CSS używany do szybkiego tworzenia interfejsów
użytkownika bez wychodzenia z konwencji HTML. Dzięki wykorzystaniu szeregu
istniejących klas nie ma konieczności rozdzielania plików odpowiedzialnych za styl
od plików odpowiedzialnych za funkcjonalność.
- Axios - popularna biblioteka JavaScript służąca do wykonywania żądań HTTP.
Wykorzystywana przez bibliotekę React do komunikacji z warstwą serwera i API.
Ceniona za łatwość użycia, możliwości kofniguracji żądań oraz obsługę obietnic.
- Moment.js - biblioteka wykorzystywana do parsowania, walidacji, manipulacji i formatowania dat, wpływając na znaczne ułatwienie pracy nad nimi.
- Redux - biblioteka służąca do zarządzania stanem aplikacji. Pozwala na centralne
przechowywanie całego stanu aplikacji w jednym miejscu zwanym jako "store", co
ułatwia zarządzaniem stanem w przypadku bardziej rozbudowanych aplikacji.
- Router - biblioteka będąca standardem w zarządzaniu nawigacją w aplikacjach opartych o React, umożliwiająca łatwe przełączanie się między różnymi widokami i zachowanie spójności struktury aplikacji poprzez wykorzystanie gotowych komponentów takich jak «BrowserRouter» bądź «Router».

### Warstwa serwera
Warstwa serwera opiera się przede wszystkim na dwóch narzędziach - Node.js oraz
Express.js. Node.js to środowisko uruchomieniowe JavaScript po stronie serwera, umożliwiające tworzenie szybkich i skalowalnych aplikacji siecowych.
Express.js to minimalistyczny i elastyczny framework dla aplikacji internetowych
bazujących na Node.js, który zapewnia imponujący zestaw funkcji ułatwiających zarządzanie trasami oraz obsługę żądąń i odpowiedzi HTTP.

Dodatkowe moduły które wykorzystano w celu usprawnienia pracy nad warstwą serwera to przede wszystkim:
- bcrypt - moduł Node.js wykorzystywany do haszowania haseł.
- Joi - biblioteka służąca do walidacji obiektów danych, zanim te zostaną przetworzone
bądź zapisane do bazy danych
- JWT - pełna nazwa to jsonwebtoken. Jest to moduł służący do tworzenia i weryfikacji tokenów, będących standardem do przekazywania informacji związanych z
uwierzytelnianiem i autoryzacją pomiędzy stronami.
- nodemon - narzędzie zwiększające komfort pracy poprzez automatyczne restartowanie serwera za każdym razem, gdy nastąpi zmiana w plikach kodu.
- socket.io - biblioteka umożliwiająca komunikację w czasie rzeczywistym między warstwą klienta a serwerem.

### Baza danych
Do zaprojektowania i implementacji aplikacji internetowej do wspomagania pracą zespołu wykorzystano nierelacyjną bazę danych MongoDB. Baza ta znana jest ze swojej
elastyczności i łatwości skalowania. W przeciwieństwie do tradycyjnych relacyjnych baz
danych, MongoDB przechowuje dane w formacie dokumentów dzięki czemu jest ona
dobrze przystosowana do pracy z dużymi zbiorami i strukturami danych.

## Wykorzystane API zewnętrzne
### Cloudinary
Cloudinary to platforma do zarządzania obrazami i plikami w chmurze, oferująca
szeroki zakres interfejsów API RESTful i zestawów SDK, które umożliwiają aplikacjom interakcję z usługami przechowywania i przetwarzania plików (zwłaszcza multimedialnych) w chmurze. W projekcie aplikacji Cloudinary jest
wykorzystywane do przechowywania zdjęć profilowych użytkowników oraz plików obrazów
i dokumentów PDF udostępnianych w zadaniach. Wykorzystanie serwisu chmurowego w
projekcie zwalnia serwer aplikacji oraz pamięć lokalną użytkownika od obciążenia związanego z przetwarzaniem i przechowywaniem plików. Dodatkową zaletą Cloudinary jest
możliwość dynamicznego ujednolicania obrazów pod względem ich rozmiaru bądź jakości.
Darmowy pakiet oferowany przez serwis w całości spełnia wymagania projektu w jego
obecnej formie

## Kwestie bezpieczeństwa
W kontekście zapewnienia bezpieczeństwa w aplikacji, przyjęto szerego kluczowych
środków, mających na celu ochronę danych użytkowników oraz zapewnienie stabilności i
bezpieczeństwa systemu:

- W celu ochrony poufności haseł użytkowników stosowane jest hashowanie przy użyciu
biblioteki bcrypt.js. Jest to metoda kryptograficzna przekształcająca wprowadzone hasło
w unikalny ciąg znaków, znacznie utrudniających ich odszyfrowanie.
- Do uwierzytelniania i zarządzania sesjami użytkowników wykorzystywane są tokeny
JWT, które przechowywane są w w bezpiecznych HTTPOnly cookies. Ta metoda zapobiega dostępowi do tokenów przez skrypty po stronie klienta, co jest istotne w kontekście
ochrony przed atakami typu XSS.
- Dodatkową ochronę przed atakami typu XSS wprowadza wykorzystanie headerów zawartych w pakiecie 'helmet'
- Zastosowanie 'express-mongo-sanitize' - narzędzia, które chroni przed atakami typu 'NoSQL injection'. Blokuje możliwość edycji zapytań w bazie MongoDB poprzez usuwanie znaków specjalnych takich jak '$' lub '.' w polach wejściowych.
- W celu ochrony przed atakami typu DoS zaimplementowano ograniczenie liczby zapytań
do API. Dzięki temu zapobiega się nadmiernemu obciążeniu serwera przez zbyt dużą
liczbę żądań w krótkim czasie.
- Wykorzystano politykę CORS do zarządzania dostępem do zasobów na różnych domenach.

Każda trasa zaimplementowana po stronie serwera, z nielicznymi wyjątkami takimi
jak logowanie czy rejestracja, została wyposażona w mechanizmy zabezpieczające uniemożliwiające nieuprawniony dostęp. W tym kontekście, ochrona przed nieuprawnionym
dostępem nie ogranicza się jedynie do weryfikacji posiadania ważnego tokena, co jest
równoznaczne z uwierzytelnieniem użytkownika, ale również obejmuje bardziej szczegółowe kontrole uprawnień. Do tych celów wykorzystywane są dodatkowe warstwy pośrednie
(middleware), które w zależności od konkretnej trasy mogą sprawdzać dodatkowe wymagania, takie jak rola użytkownika, jego przynależność do zespołu lub bycie twórcą zadania.

Dodatkowe środki ochrony zostały także zaimplementowane w warstwie interfejsu
użytkownika, aby zapewnić zabezpieczenie przed nieuprawnionym dostępem do różnych
zasobów aplikacji. System ten został zaprojektowany w taki sposób, aby uniemożliwić
dostęp do stron przeznaczonych dla określonych użytkowników, takich jak członkowie
konkretnego zespołu, osoby o specyficznych rolach lub uprawnieniach, jeśli dany użytkownik nie posiada odpowiednich kwalifikacji. W przypadkach, gdy użytkownik próbuje
uzyskać dostęp do nieistniejących adresów URL lub stron, dla których nie posiada odpowiednich uprawnień, aplikacja reaguje wyświetleniem odpowiedniej informacji o błędzie
lub ograniczeniu dostępu. Ponadto, system automatycznie przekierowuje niezalogowanych
użytkowników na stronę logowania, gdy próbują oni wejść na strony wymagające uwierzytelnienia.

## Wyzwania napotkane podczas pracy nad projektem
### JOI
Jednym z wyzwań napotkanych podczas pracy nad projektem była pierwsza implementacja walidacji przy użyciu biblioteki Joi. Pomimo jej potężnych możliwości w definiowaniu
szczegółowych schematów walidacyjnych, trudności wyniknęły z powodu początkowej nieuwagi przy ich projektowaniu. Z uwagi na rozpoczęcie pracy nad dodaniem walidacji po
zakończeniu pierwszego testowania warstwy serwera, nowe schematy nie wskazywały na
właściwe elementy zawarte w żądaniach HTTP co doprowadziło do problemów takich jak
odrzucanie prawidłowych danych wejściowych. Problem został zidentyfikowany już przy
pierwszej nieudanej próbie skorzystania z zintegrowanym z warstwą interfejsu punktem
kontrolnym, jednak jego naprawa wymagała poprawy każdego utworzonego już schematu
walidacyjnego.

### Dodawanie zdjęć
Większym wyzwaniem okazało się prawidłowe zaimplementowanie funkcjonalności dodawanie zdjęc profilowych użytkowników. Choć sama integracja z usługą Cloudinary
przebiegła pomyślnie i zdjęcia prawidłowo były umieszczane w serwisie, problem pojawił
się przy przypisywaniu adresu URL do właściwości profilePic w modelu użytkownika.
Błąd ten wymagał zmiany zarówno w metodzie rejestracji istniejącej w warstwie klienta,
jak i po stronie serwera. Rozwiązanie problemu wymagało segmentacji procesu na dwie
części - rejestrację użytkownika i osobne przypisanie adresu URL do modelu użytkownika.

### Powiadomienia
Kolejnym problemem okazało się niewłaściwe wyświetlanie powiadomień. Używając
gotowego komponentu Dropdown z biblioteki Ant Design, powiadomienia były wyświetlane w sposób wycentrowany i nie zajmowały całej przeznaczonej dla nich szerokości.
Problem ten wynikał z domyślnych ustawień stylistycznych dla podanego komponentu.
Wymagał jednak znacznie dokładniejszej analizy stylów widocznych w narzędziach deweloperskich przeglądarki i odpowiedniej ich modyfikacji niż przewidywano, z uwagi na dużą
ilość zależności pomiędzy poszczególnymi elementami.

### Hosting
Z uwagi na brak dotychczasowego doświadczenia z hostowaniem aplikacji internetowych, dostosowanie programu tak, aby poprawnie uruchamiał się zarówno lokalnie jak i w usłudze hostingowej wymagało sporo czasu i wykorzystania metody prób i błędów. Z uwagi na specyfikę przeglądarek internetowych, niektóre z funkcji poprawnie działających lokalnie wymagały poprawy - często były to drobne, ale trudne do wykrycia błędy takie jak np. niepoprawny zapis metod związanych z ciasteczkami (przykład: 'SameSite: "none"' zamiast 'sameSite: "None"').

## Perspektywy rozwoju
### Rozwinięcie bezpieczeństwa aplikacji
Wzmocnienie bezpieczeństwa poprzez dodanie funkcji weryfikacji adresu email przy
rejestracji oraz możliwości resetowania lub zmiany hasła poprzez email poprawiłoby zarządzanie dostępem do konta użytkownika i zwiększyłoby ochronę przed nieautoryzowanym
dostępem. 

### Wykorzystanie protokołu OAuth
OAuth (Open Authorization) to standard protokołu autoryzacji, który umożliwia aplikacjom dostęp do zasobów użytkownika w innych aplikacjach bez potrzeby udostępniania hasła. 
OAuth jest używany w wielu aplikacjach internetowych, takich jak Google, Facebook, czy Twitter, aby umożliwić logowanie za pomocą konta zewnętrznego bez konieczności tworzenia nowego konta w danej aplikacji.
Wykorzystanie tego protokołu w aplikacji ułatwiłoby użytkownikom uzyskanie dostępu do serwisu, jednocześnie zwiększając kwestie bezpieczeństwa.

### Podział na rolę w zespołach
Wprowadzenie zdefiniowanych ról dla pracowników zespołu, takich jak deweloper, analityk, stażysta, umożliwiłoby lepszą organizację pracy i zarządzanie uprawnieniami. Każda
rola wewnątrz zespołu mogłaby mieć dostęp do innych funkcji, co wpłynęłoby na zwiększenie bezpieczeństwa i przejrzystości.

###  Panel statystyk
Wprowadzenie dodatkowego, rozbudowanego panelu zaawansowanych statystyk dotyczących ostatnich zmian wprowadzonych w zespole, projektach i zadaniach umożliwiłaby
lepsze śledzenie postępów, analizowanie wydajności i podejmowanie decyzji na podstawie zebranych danych. Generowanie raportów z określonych przedziałów czasu jeszcze bardziej
podwyższyłoby wartość analityczną aplikacji.

### Integracja
Implementacja integracji z innymi popularnymi narzędziami i systemami pozwoliłaby
na zwiększenie funkcjonalności aplikacji oraz ułatwienie wymiany danych i synchronizacji
zasobów.
