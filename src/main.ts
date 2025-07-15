import { ContactForm } from "./components/ContactForm";

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
