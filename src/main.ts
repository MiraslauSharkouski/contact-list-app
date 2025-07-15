// main.ts
import { StorageService } from "./services/StorageService";
import { ToastService } from "./services/ToastService";
import { ContactForm } from "./components/ContactForm";
import { ContactList } from "./components/ContactList";
import { renderGroups, initGroupManager } from "./components/GroupManager";
import type { Contact } from "./models/Contact";

// Тостер
const toastService = new ToastService("toast-container");

// Загрузка данных
let contacts = StorageService.getContacts();
let groups = StorageService.getGroups();

// Форма
const contactForm = new ContactForm(
  "#contact-form",
  "#group-select",
  toastService,
  updateApp
);

// Список
const contactList = new ContactList("#contacts-list", toastService, handleEdit);

// Группы
initGroupManager(
  groups,
  updateGroupsInFormAndList,
  showConfirmModal,
  toastService
);

// Обновляем данные
updateApp();

function updateApp() {
  contacts = StorageService.getContacts();
  contactForm.setContacts(contacts);
  contactList.setContacts(contacts);
}

function updateGroupsInFormAndList() {
  const updatedGroups = StorageService.getGroups();
  contactForm.setGroups(updatedGroups);
  renderGroups(); // если используется отдельная отрисовка
}

function handleEdit(contact: Contact) {
  contactForm.editContact(contact);
}

// Модальное окно подтверждения
const modal = document.getElementById("confirm-modal")!;
const confirmDeleteBtn = document.getElementById("confirm-delete")!;
const cancelDeleteBtn = document.getElementById("cancel-delete")!;

let confirmCallback: (() => void) | null = null;

function showConfirmModal(callback: () => void) {
  confirmCallback = callback;
  modal.style.display = "flex";
}

confirmDeleteBtn.addEventListener("click", () => {
  if (confirmCallback) confirmCallback();
  modal.style.display = "none";
});

cancelDeleteBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
