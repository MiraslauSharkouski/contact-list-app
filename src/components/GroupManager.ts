import { StorageService } from "../services/StorageService";
import { ToastService } from "../services/ToastService";
import { Validator } from "../utils/Validator";

let groups: string[] = [];

export function initGroupManager(
  initialGroups: string[],
  onGroupChange: () => void,
  showModal: (callback: () => void) => void,
  toastService: ToastService
) {
  groups = initialGroups;

  const form = document.getElementById("group-form") as HTMLFormElement;
  const input = document.getElementById("group-name") as HTMLInputElement;
  const list = document.getElementById("group-list")!;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();

    try {
      Validator.validateUniqueGroupName(groups, name);
      groups.push(name);
      StorageService.saveGroups(groups);
      toastService.show(`Группа "${name}" добавлена`, "success");

      onGroupChange(); // обновляем UI контактов
      renderGroups();
      form.reset();
    } catch (error: any) {
      toastService.show(error.message, "error");
    }
  });

  renderGroups();

  function renderGroups() {
    list.innerHTML = "";
    groups.forEach((group) => {
      const li = document.createElement("li");
      li.className = "group-item";
      li.innerHTML = `
        <span class="group-item__name">${group}</span>
        <button class="group-item__remove" title="Удалить группу">&times;</button>
      `;

      li.querySelector(".group-item__remove")?.addEventListener("click", () => {
        showModal(() => {
          groups = groups.filter((g) => g !== group);
          StorageService.saveGroups(groups);
          StorageService.saveContacts([]);
          toastService.show(
            `Группа "${group}" и все контакты удалены`,
            "success"
          );

          onGroupChange();
          renderGroups();
        });
      });

      list.appendChild(li);
    });
  }
}

// Экспортируем для тестирования или расширения
export function renderGroups() {
  // Можно вызвать отдельно, если нужно
}
