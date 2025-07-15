import { Contact } from "../models/Contact";

export class Validator {
  static validateUniquePhone(contacts: Contact[], newContact: Contact): void {
    const exists = contacts.some(
      (contact) => contact.phone === newContact.phone
    );
    if (exists) {
      throw new Error("Контакт с таким номером телефона уже существует.");
    }
  }

  static validateUniqueGroupName(groups: string[], groupName: string): void {
    if (groups.includes(groupName)) {
      throw new Error("Группа с таким именем уже существует.");
    }
  }
}
