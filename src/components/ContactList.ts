// ContactList.ts
import { Contact } from "../models/Contact";
import { StorageService } from "../services/StorageService";
import { ToastService } from "../services/ToastService";

export class ContactList {
  private listElement: HTMLElement;
  private contacts: Contact[] = [];
  private toastService: ToastService;
  private onEditCallback: (contact: Contact) => void;

  constructor(
    listSelector: string,
    toastService: ToastService,
    onEdit: (contact: Contact) => void
  ) {
    this.listElement = document.querySelector(listSelector)!;
    this.toastService = toastService;
    this.onEditCallback = onEdit;
  }

  setContacts(contacts: Contact[]): void {
    this.contacts = contacts;
    this.render();
  }

  private render(): void {
    this.listElement.innerHTML = "";
    this.contacts.forEach((contact) => {
      const li = document.createElement("li");
      li.className = "contact-card";
      li.innerHTML = `
        <strong>${contact.name}</strong><br>
        <small>${contact.phone}</small><br>
        <em>${contact.groupId}</em>
        <div class="contact-card__actions">
          <button class="btn btn--secondary btn--edit">Редактировать</button>
          <button class="btn btn--danger btn--delete">Удалить</button>
        </div>
      `;

      // Редактирование
      li.querySelector(".btn--edit")?.addEventListener("click", () => {
        this.onEditCallback(contact);
      });

      // Удаление
      li.querySelector(".btn--delete")?.addEventListener("click", () => {
        this.contacts = this.contacts.filter((c) => c.id !== contact.id);
        StorageService.saveContacts(this.contacts);
        this.toastService.show("Контакт удалён!", "success");
        this.render();
      });

      this.listElement.appendChild(li);
    });
  }
}
