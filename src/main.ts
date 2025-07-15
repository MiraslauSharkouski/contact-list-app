import { StorageService } from "./services/StorageService";
import { ToastService } from "./services/ToastService";
import { ContactForm } from "./components/ContactForm";
import { ContactList } from "./components/ContactList";
import { initGroupManager } from "./components/GroupManager";
import type { Contact } from "./models/Contact";
import IMask from "imask";

// Инициализация тостера
const toastService = new ToastService("toast-container");

// Загрузка данных из localStorage
let contacts = StorageService.getContacts();
let groups = StorageService.getGroups();

// Инициализация формы контакта
const contactForm = new ContactForm(
  "#contact-form",
  "#contact-group",
  toastService,
  updateApp
);

// Инициализация списка контактов
const contactList = new ContactList("#contacts-list", toastService, handleEdit);

// Инициализация менеджера групп
initGroupManager(
  groups,
  updateGroupsInFormAndList,
  showConfirmModal,
  toastService
);

// Обновление состояния приложения
updateApp();

// Функция обновления данных
function updateApp() {
  contacts = StorageService.getContacts();
  groups = StorageService.getGroups();

  contactForm.setContacts(contacts);
  contactForm.setGroups(groups);
  contactList.setContacts(contacts);
  updateGroupSelect(groups);
}

// Обновление UI групп
function updateGroupsInFormAndList() {
  const updatedGroups = StorageService.getGroups();
  contactForm.setGroups(updatedGroups);
}

// Редактирование контакта
function handleEdit(contact: Contact) {
  contactForm.editContact(contact);
}

// Модальное окно подтверждения удаления
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

// Обновление селекта групп
// const groupSelect = document.getElementById(
//   "contact-group"
// ) as HTMLSelectElement;

export function updateGroupSelect(groups: string[]) {
  const groupSelect = document.getElementById(
    "contact-group"
  ) as HTMLSelectElement | null;

  if (!groupSelect) {
    console.warn("Селект групп не найден");
    return;
  }

  groupSelect.innerHTML = ""; // очищаем старые опции

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    groupSelect.appendChild(option);
  });
}

// Загружаем группы из localStorage
const initialGroups = StorageService.getGroups();

// Обновляем селект только после инициализации
updateGroupSelect(initialGroups);

// Инициализация маски телефона
const phoneInput = document.getElementById("contact-phone") as HTMLInputElement;
if (phoneInput) {
  IMask(phoneInput, {
    mask: "+{7}(000)000-00-00",
  });
}
