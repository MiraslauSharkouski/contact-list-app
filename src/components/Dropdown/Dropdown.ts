type DropdownEvent = "change" | "open" | "close";

export type DropdownItem = {
  id: string;
  label: string;
};

export class Dropdown {
  private container: HTMLElement;
  private trigger: HTMLElement;
  private menu: HTMLElement;

  private items: DropdownItem[] = [];
  private selectedId: string | null = null;
  private eventHandlers: { [key in DropdownEvent]?: Function[] } = {
    change: [],
    open: [],
    close: [],
  };

  private isOpen = false;

  constructor(container: HTMLElement, items: DropdownItem[]) {
    this.container = container;
    this.trigger = container.querySelector(".dropdown__trigger")!;
    this.menu = container.querySelector(".dropdown__menu")!;

    this.initEvents();
    this.setData(items);
  }

  public bind(event: DropdownEvent, handler: Function): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event]?.push(handler);
  }

  public setData(items: DropdownItem[]): void {
    this.items = items;
    this.renderMenu();
  }

  public setValue(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      this.selectedId = id;
      this.trigger.textContent = item.label;
      this.emit("change", id);
    }
  }

  public getValue(): string {
    return this.selectedId || "";
  }

  public reset(): void {
    this.selectedId = null;
    this.trigger.textContent = "Выберите группу";
  }

  private initEvents(): void {
    // Открытие/закрытие меню
    this.trigger.addEventListener("click", () => {
      this.isOpen ? this.close() : this.open();
    });

    // Закрытие по клику вне
    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target as Node)) {
        this.close();
      }
    });
  }

  private renderMenu(): void {
    this.menu.innerHTML = "";
    this.items.forEach((item) => {
      const el = document.createElement("div");
      el.className = "dropdown__item";
      el.textContent = item.label;
      el.dataset.id = item.id;

      el.addEventListener("click", () => {
        this.setValue(item.id);
        this.close();
      });

      this.menu.appendChild(el);
    });
  }

  private open(): void {
    if (this.isOpen) return;
    this.menu.classList.add("dropdown__menu--open");
    this.isOpen = true;
    this.emit("open");
  }

  private close(): void {
    if (!this.isOpen) return;
    this.menu.classList.remove("dropdown__menu--open");
    this.isOpen = false;
    this.emit("close");
  }

  private emit(event: DropdownEvent, payload?: any): void {
    this.eventHandlers[event]?.forEach((handler) => handler(payload));
  }
}
