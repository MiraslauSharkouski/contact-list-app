import { Contact } from "../../types";
import { Group } from "../../types";

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Общий метод для сохранения данных
  public save<T>(key: string, T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Ошибка сохранения в localStorage (${key})`, e);
    }
  }

  // Общий метод для загрузки данных
  public load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Ошибка чтения из localStorage (${key})`, e);
      return null;
    }
  }

  // Методы для работы с контактами
  public saveContacts(contacts: Contact[]): void {
    this.save<Contact[]>("contacts", contacts);
  }

  public loadContacts(): Contact[] {
    return this.load<Contact[]>("contacts") || [];
  }

  // Методы для работы с группами
  public saveGroups(groups: Group[]): void {
    this.save<Group[]>("groups", groups);
  }

  public loadGroups(): Group[] {
    return this.load<Group[]>("groups") || [];
  }
}
