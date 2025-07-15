import { Contact } from "../models/Contact";
import { StorageService } from "../services/StorageService";
import { ToastService } from "../services/ToastService";
import { Validator } from "../utils/Validator";

export class ContactForm {
  private form: HTMLFormElement;
  private nameInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private groupSelect: HTMLSelectElement;
  private toastService: ToastService;
  private contacts: Contact[] = [];
  private editingContactId: string | null = null;

  constructor(
    formSelector: string,
    selectSelector: string,
    toastService: ToastService,
    private onUpdate: () => void
  ) {
    this.form = document.querySelector(formSelector)!;
    this.nameInput = this.form.querySelector("#contact-name")!;
    this.phoneInput = this.form.querySelector("#contact-phone")!;
    this.groupSelect = document.querySelector(
      selectSelector
    )! as HTMLSelectElement;
    this.toastService = toastService;

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  setContacts(contacts: Contact[]) {
    this.contacts = contacts;
  }

  setGroups(groups: string[]) {
    this.groupSelect.innerHTML = "";
    groups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = group;
      this.groupSelect.appendChild(option);
    });
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    const name = this.nameInput.value.trim();
    const phone = this.phoneInput.value.trim();
    const groupId = this.groupSelect.value;

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
        this.toastService.show("Contact successfully changed!", "success");
      } else {
        const newContact = new Contact(name, phone, groupId);
        Validator.validateUniquePhone(this.contacts, newContact);
        this.contacts.push(newContact);
        this.toastService.show("Contact added successfully!", "success");
      }

      StorageService.saveContacts(this.contacts);
      this.form.reset();
      this.editingContactId = null;
      this.onUpdate();
    } catch (error: any) {
      this.toastService.show(error.message, "error");
    }
  }

  editContact(contact: Contact) {
    this.editingContactId = contact.id;
    this.nameInput.value = contact.name;
    this.phoneInput.value = contact.phone;
    this.groupSelect.value = contact.groupId;
  }
}
