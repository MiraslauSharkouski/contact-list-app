import IMask from "imask";
import { Contact } from "./models/Contact";
import { StorageService } from "./services/StorageService";
import { ToastService } from "./services/ToastService";
import { Validator } from "./utils/Validator";
import { CustomDropdown } from "./components/Dropdown";

// Инициализация
const form = document.getElementById("contact-form") as HTMLFormElement;
const contactsList = document.getElementById("contacts-list")!;
const dropdownContainer = document.getElementById("group-select")!;
const toastService = new ToastService("toast-container");

let contacts = StorageService.getContacts();
let groups = StorageService.getGroups();

// Инициализируем дропдаун
const groupDropdown = new CustomDropdown("#group-select");
groupDropdown.dataItems = groups.map((g) => ({ value: g, label: g }));

// Подписываемся на событие изменения группы
groupDropdown.bind("change", () => {
  console.log("Группа изменена:", groupDropdown.value);
});

// Обработка формы
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("name") as HTMLInputElement;
  const phoneInput = document.getElementById("phone") as HTMLInputElement;

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const groupId = groupDropdown.value || "default";

  try {
    const newContact = new Contact(name, phone, groupId);
    Validator.validateUniquePhone(contacts, newContact);
    contacts.push(newContact);
    StorageService.saveContacts(contacts);
    toastService.show("Контакт успешно добавлен!", "success");
    renderContacts();
    form.reset();
  } catch (error: any) {
    toastService.show(error.message, "error");
  }
});

// Рендеринг контактов
function renderContacts() {
  contactsList.innerHTML = "";
  contacts.forEach((contact) => {
    const li = document.createElement("li");
    li.className = "contact-card";
    li.innerHTML = `
      <strong>${contact.name}</strong><br>
      <small>${contact.phone}</small><br>
      <em>${contact.groupId}</em>
    `;
    contactsList.appendChild(li);
  });

  // Маска для телефона
  const phoneInput = document.getElementById("phone") as HTMLInputElement;
  if (phoneInput) {
    IMask(phoneInput, {
      mask: "+{7}(000)000-00-00",
    });
  }
}

renderContacts();
