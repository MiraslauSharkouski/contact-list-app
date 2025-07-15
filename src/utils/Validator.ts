import { Contact } from "../models/Contact";

export class Validator {
  static validateUniquePhone(contacts: Contact[], newContact: Contact): void {
    const exists = contacts.some(
      (contact) => contact.phone === newContact.phone
    );
    if (exists) {
      throw new Error("A contact with this phone number already exists.");
    }
  }

  static validateUniqueGroupName(groups: string[], groupName: string): void {
    if (groups.includes(groupName)) {
      throw new Error("A group with this name already exists.");
    }
  }
}
