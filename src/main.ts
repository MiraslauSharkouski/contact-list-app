import { ContactForm } from "./components/ContactForm/ContactForm";
import { ContactList } from "./components/ContactList/ContactList";

const formContainer = document.getElementById("contact-form-container");

fetchGroups().then((groups) => {
  new ContactForm(formContainer!, groups, (contact, isEdit, contactId) => {
    if (isEdit && contactId) {
      // Обновление контакта
      console.log("Обновляем контакт:", contactId, contact);
      Toast.show("Контакт обновлён!", "success");
    } else {
      // Создание нового контакта
      console.log("Создаём новый контакт:", contact);
      Toast.show("Контакт создан!", "success");
    }
  });
});

const contactListContainer = document.getElementById("contact-list-container")!;

// Пример данных
const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Иван Иванов",
    phone: "+7(999)123-45-67",
    groupId: "friends",
  },
  {
    id: "2",
    name: "Мария Смирнова",
    phone: "+7(999)987-65-43",
    groupId: "work",
  },
];

new ContactList(contactListContainer, {
  onEdit: (contact) => {
    console.log("Редактируем контакт:", contact);
    // Здесь можно передать контакт в форму
  },
  onDelete: (contactId) => {
    console.log("Удаляем контакт:", contactId);
    // Здесь можно удалить из StorageService
  },
}).setContacts(initialContacts);
