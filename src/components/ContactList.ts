import { Contact } from "../models/Contact";
import { StorageService } from "../services/StorageService";
import { ToastService } from "../services/ToastService";

export class ContactList {
  private listElement: HTMLElement;
  private toastService: ToastService;
  private onEditCallback: (contact: Contact) => void;
  private contacts: Contact[] = [];

  constructor(
    selector: string,
    toastService: ToastService,
    onEdit: (contact: Contact) => void
  ) {
    this.listElement = document.querySelector(selector)!;
    this.toastService = toastService;
    this.onEditCallback = onEdit;
  }

  setContacts(contacts: Contact[]) {
    this.contacts = contacts;
    this.render();
  }

  private render() {
    this.listElement.innerHTML = "";

    this.contacts.forEach((contact) => {
      const div = document.createElement("div");
      div.className = "contact-card";
      div.innerHTML = `
        <div>
          <strong>${contact.name}</strong>
          <small>${contact.phone}</small>
          <em>${contact.groupId}</em>
        </div>
        <div class="contact-card__actions">
          <button class="btn btn--secondary btn--edit">Редактировать</button>
          <button class="btn btn--danger btn--delete">Удалить</button>
        </div>
      `;

      div.querySelector(".btn--edit")?.addEventListener("click", () => {
        this.onEditCallback(contact);
      });

      div.querySelector(".btn--delete")?.addEventListener("click", () => {
        this.contacts = this.contacts.filter((c) => c.id !== contact.id);
        StorageService.saveContacts(this.contacts);
        this.toastService.show("Контакт удалён!", "success");
        this.render();
      });

      this.listElement.appendChild(div);
    });
  }
}
