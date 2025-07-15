import { StorageService } from "../../services/StorageService";
import { Toast } from "../Toast/Toast";
import { Group } from "../../types";

export class GroupManager {
  private storage: StorageService;
  private groups: Group[] = [];

  constructor() {
    this.storage = StorageService.getInstance();
    this.load();
  }

  // Загружаем из localStorage
  private load(): void {
    this.groups = this.storage.loadGroups();
  }

  // Сохраняем в localStorage
  private save(): void {
    this.storage.saveGroups(this.groups);
  }

  // Получить все группы
  public getAll(): Group[] {
    return this.groups;
  }

  // Проверить существование группы по имени
  public exists(name: string): boolean {
    return this.groups.some(
      (group) => group.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Создать группу
  public create(name: string): Group | null {
    if (this.exists(name)) {
      Toast.show(`Группа "${name}" уже существует`, "error");
      return null;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name,
    };

    this.groups.push(newGroup);
    this.save();
    Toast.show(`Группа "${name}" создана`, "success");

    return newGroup;
  }

  // Обновить группу
  public update(id: string, newName: string): boolean {
    const group = this.groups.find((g) => g.id === id);

    if (!group) {
      Toast.show("Группа не найдена", "error");
      return false;
    }

    if (this.exists(newName)) {
      Toast.show(`Группа "${newName}" уже существует`, "error");
      return false;
    }

    group.name = newName;
    this.save();
    Toast.show(`Группа изменена на "${newName}"`, "success");

    return true;
  }

  // Удалить группу (и все контакты этой группы)
  public delete(id: string): boolean {
    const index = this.groups.findIndex((g) => g.id === id);

    if (index === -1) {
      Toast.show("Группа не найдена", "error");
      return false;
    }

    const deletedGroup = this.groups[index];
    this.groups.splice(index, 1);

    // Удаляем все контакты этой группы
    const contactManager = new ContactManager();
    contactManager.deleteByGroupId(id);

    this.save();
    Toast.show(`Группа "${deletedGroup.name}" удалена`, "success");

    return true;
  }
}
