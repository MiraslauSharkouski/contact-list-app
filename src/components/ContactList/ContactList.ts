import { Toast } from "../components/Toast";
import { Contact } from "../../types";

export type ContactActions = {
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
};

export class ContactList {
  private container: HTMLElement;
  private contacts: Contact[] = [];
  private actions: ContactActions;

  constructor(container: HTMLElement, actions: ContactActions = {}) {
    this.container = container;
    this.actions = actions;
  }

  public setContacts(contacts: Contact[]): void {
    this.contacts = contacts;
    this.render();
  }

  public addContact(contact: Contact): void {
    this.contacts.push(contact);
    this.render();
  }

  public updateContact(contact: Contact): void {
    const index = this.contacts.findIndex((c) => c.id === contact.id);
    if (index !== -1) {
      this.contacts[index] = contact;
      this.render();
    }
  }

  public deleteContact(contactId: string): void {
    this.contacts = this.contacts.filter((c) => c.id !== contactId);
    this.render();
    Toast.show("Контакт удален", "success");
  }

  private render(): void {
    this.container.innerHTML = "";

    if (this.contacts.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Нет контактов";
      this.container.appendChild(empty);
      return;
    }

    this.contacts.forEach((contact) => {
      const item = document.createElement("div");
      item.className = "contact-list__item";

      const info = document.createElement("div");
      info.className = "contact-list__info";

      const name = document.createElement("div");
      name.className = "contact-list__name";
      name.textContent = contact.name;

      const phone = document.createElement("div");
      phone.className = "contact-list__phone";
      phone.textContent = contact.phone;

      const group = document.createElement("div");
      group.className = "contact-list__group";
      group.textContent = `Группа: ${contact.groupId}`;

      info.appendChild(name);
      info.appendChild(phone);
      info.appendChild(group);

      const actions = document.createElement("div");
      actions.className = "contact-list__actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Редактировать";
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => {
        if (this.actions.onEdit) {
          this.actions.onEdit(contact);
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Удалить";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        if (this.actions.onDelete) {
          this.actions.onDelete(contact.id);
        }
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(actions);

      this.container.appendChild(item);
    });
  }
}
