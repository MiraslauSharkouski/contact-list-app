import { Contact } from "../models/Contact";

const CONTACTS_STORAGE_KEY = "contacts-app-contacts";
const GROUPS_STORAGE_KEY = "contacts-app-groups";

export class StorageService {
  static getContacts(): Contact[] {
    const data = localStorage.getItem(CONTACTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveContacts(contacts: Contact[]): void {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  }

  static getGroups(): string[] {
    const data = localStorage.getItem(GROUPS_STORAGE_KEY);
    return data ? JSON.parse(data) : ["Work", "Family", "Friends"];
  }

  static saveGroups(groups: string[]): void {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  }
}
