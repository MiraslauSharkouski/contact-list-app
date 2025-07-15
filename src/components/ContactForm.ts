// ContactForm.ts
import { Contact } from "../models/Contact";
import { StorageService } from "../services/StorageService";
import { ToastService } from "../services/ToastService";
import { Validator } from "../utils/Validator";
import { CustomDropdown } from "./Dropdown";
import IMask from "imask";

export class ContactForm {
  private form: HTMLFormElement;
  private nameInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private groupDropdown: CustomDropdown;
  private toastService: ToastService;

  private contacts: Contact[] = [];
  private editingContactId: string | null = null;

  constructor(
    formSelector: string,
    dropdownSelector: string,
    toastService: ToastService,
    onUpdate: () => void
  ) {
    this.form = document.querySelector(formSelector)!;
    this.nameInput = this.form.querySelector("#name")!;
    this.phoneInput = this.form.querySelector("#phone")!;
    this.toastService = toastService;

    // Инициализация дропдауна
    this.groupDropdown = new CustomDropdown(dropdownSelector);

    // Подписываемся на событие изменения группы
    this.groupDropdown.bind("change", () => {
      console.log("Группа изменена:", this.groupDropdown.value);
    });

    // Маска телефона
    IMask(this.phoneInput, {
      mask: "+{7}(000)000-00-00",
    });

    // Обработчик формы
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(onUpdate);
    });
  }

  setGroups(groups: string[]) {
    this.groupDropdown.dataItems = groups.map((g) => ({ value: g, label: g }));
  }

  setContacts(contacts: Contact[]) {
    this.contacts = contacts;
  }

  private handleSubmit(onUpdate: () => void): void {
    const name = this.nameInput.value.trim();
    const phone = this.phoneInput.value.trim();
    const groupId = this.groupDropdown.value || "default";

    try {
      if (this.editingContactId) {
        const contactIndex = this.contacts.findIndex(
          (c) => c.id === this.editingContactId
        );
        const updatedContact = {
          ...this.contacts[contactIndex],
          name,
          phone,
          groupId,
        };
        const others = this.contacts.filter(
          (c) => c.id !== this.editingContactId
        );

        Validator.validateUniquePhone(others, updatedContact as Contact);
        this.contacts[contactIndex] = updatedContact as Contact;
        StorageService.saveContacts(this.contacts);
        this.toastService.show("Контакт успешно изменён!", "success");
      } else {
        const newContact = new Contact(name, phone, groupId);
        Validator.validateUniquePhone(this.contacts, newContact);
        this.contacts.push(newContact);
        StorageService.saveContacts(this.contacts);
        this.toastService.show("Контакт успешно добавлен!", "success");
      }

      this.form.reset();
      this.editingContactId = null;
      this.groupDropdown.close();
      onUpdate();
    } catch (error: any) {
      this.toastService.show(error.message, "error");
    }
  }

  editContact(contact: Contact): void {
    this.editingContactId = contact.id;
    this.nameInput.value = contact.name;
    this.phoneInput.value = contact.phone;
    this.groupDropdown.setValue(contact.groupId);
    // this.groupDropdown.element.querySelector(".dropdown-trigger")!.textContent =
    //   contact.groupId;
  }
}
