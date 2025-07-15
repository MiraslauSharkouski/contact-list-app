import { StorageService } from "./services/StorageService";
import { ToastService } from "./services/ToastService";
import { ContactForm } from "./components/ContactForm";
import { ContactList } from "./components/ContactList";
import { initGroupManager } from "./components/GroupManager";
import type { Contact } from "./models/Contact";
import IMask from "imask";

const toastService = new ToastService("toast-container");

let contacts = StorageService.getContacts();
let groups = StorageService.getGroups();

const contactForm = new ContactForm(
  "#contact-form",
  "#contact-group",
  toastService,
  updateApp
);

const contactList = new ContactList("#contacts-list", toastService, handleEdit);

initGroupManager(
  groups,
  updateGroupsInFormAndList,
  showConfirmModal,
  toastService
);

updateApp();

function updateApp() {
  contacts = StorageService.getContacts();
  groups = StorageService.getGroups();

  contactForm.setContacts(contacts);
  contactForm.setGroups(groups);
  contactList.setContacts(contacts);
  updateGroupSelect(groups);
}

function updateGroupsInFormAndList() {
  const updatedGroups = StorageService.getGroups();
  contactForm.setGroups(updatedGroups);
}

function handleEdit(contact: Contact) {
  contactForm.editContact(contact);
}

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

export function updateGroupSelect(groups: string[]) {
  const groupSelect = document.getElementById(
    "contact-group"
  ) as HTMLSelectElement | null;

  if (!groupSelect) {
    console.warn("Select groups not found");
    return;
  }

  groupSelect.innerHTML = "";

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    groupSelect.appendChild(option);
  });
}

const initialGroups = StorageService.getGroups();

updateGroupSelect(initialGroups);

const phoneInput = document.getElementById("contact-phone") as HTMLInputElement;
if (phoneInput) {
  IMask(phoneInput, {
    mask: "+{7}(000)000-00-00",
  });
}
