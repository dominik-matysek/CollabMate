
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


