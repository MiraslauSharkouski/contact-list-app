import { StorageService } from '../../services/StorageService';
import { Toast } from '../Toast/Toast';
import { Contact } from '../../types';

export class ContactManager {
  private storage: StorageService;
  private contacts: Contact[] = [];

  constructor() {
    this.storage = StorageService.getInstance();
    this.load();
  }

  private load(): void {
    this.contacts = this.storage.loadContacts();
  }

  private save(): void {
    this.storage.saveContacts(this.contacts);
  }

  public getAll(): Contact[] {
    return this.contacts;
  }

  public getByGroupId(groupId: string): Contact[] {
    return this.contacts.filter(c => c.groupId === groupId);
  }

  public deleteByGroupId(groupId: string): void {
    this.contacts = this.contacts.filter(c => c.groupId !== groupId);
    this.save();
  }

  public create(contact: Omit<Contact, 'id'>): Contact | null {
    if (this.contacts.some(c => c.phone === contact.phone)) {
      Toast.show('Контакт с таким номером уже существует', 'error');
      return null;
    }

    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
    };

    this.contacts.push(newContact);
    this.save();
    Toast.show(`Контакт "${contact.name}" создан`, 'success');

    return newContact;
  }

  public update(id: string,  Partial<Contact>): boolean {
    const contactIndex = this.contacts.findIndex(c => c.id === id);

    if (contactIndex === -1) {
      Toast.show('Контакт не найден', 'error');
      return false;
    }

    const updatedContact = { ...this.contacts[contactIndex], ...data };
    this.contacts[contactIndex] = updatedContact;
    this.save();

    Toast.show(`Контакт "${updatedContact.name}" обновлён`, 'success');
    return true;
  }

  public delete(id: string): boolean {
    const contactIndex = this.contacts.findIndex(c => c.id === id);

    if (contactIndex === -1) {
      Toast.show('Контакт не найден', 'error');
      return false;
    }

    const contactName = this.contacts[contactIndex].name;
    this.contacts.splice(contactIndex, 1);
    this.save();

    Toast.show(`Контакт "${contactName}" удалён`, 'success');
    return true;
  }
}