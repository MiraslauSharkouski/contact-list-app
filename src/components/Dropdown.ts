type DropdownEvent = "change" | "open" | "close";

export class CustomDropdown {
  private element: HTMLElement;
  private items!: { value: string; label: string }[];
  private selectedValue: string | null = null;
  private listeners: Record<DropdownEvent, (() => void)[]> = {
    change: [],
    open: [],
    close: [],
  };

  constructor(selector: string) {
    this.element = document.querySelector(selector)!;
    this.init();
  }

  // Публичный метод подписки на события
  bind(event: DropdownEvent, handler: () => void): void {
    this.listeners[event].push(handler);
  }

  // Публичное свойство: текущее значение
  get value(): string | null {
    return this.selectedValue;
  }

  // Установка элементов дропдауна
  set dataItems(items: { value: string; label: string }[]) {
    this.items = items;
    this.renderOptions();
  }

  // Публичный метод: установка значения
  setValue(value: string): void {
    this.selectedValue = value;
    const label =
      this.items.find((item) => item.value === value)?.label || value;
    this.element.querySelector(".dropdown-trigger")!.textContent = label;
  }

  // Публичный метод: закрытие дропдауна
  close(): void {
    this.element.classList.remove("dropdown--open");
    this.trigger("close");
  }

  private init(): void {
    this.element.innerHTML = `
      <div class="dropdown-trigger">${
        this.selectedValue || "Выберите группу"
      }</div>
      <ul class="dropdown-options"></ul>
    `;
    this.element.classList.add("dropdown");

    this.element
      .querySelector(".dropdown-trigger")
      ?.addEventListener("click", () => {
        this.toggle();
      });
  }

  private renderOptions(): void {
    const optionsEl = this.element.querySelector(".dropdown-options")!;
    optionsEl.innerHTML = "";
    this.items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "dropdown-option";
      li.dataset.value = item.value;
      li.textContent = item.label;
      li.addEventListener("click", () => {
        this.selectedValue = item.value;
        this.element.querySelector(".dropdown-trigger")!.textContent =
          item.label;
        this.trigger("change");
        this.close();
      });
      optionsEl.appendChild(li);
    });
  }

  private toggle(): void {
    this.element.classList.toggle("dropdown--open");
    const isOpen = this.element.classList.contains("dropdown--open");
    this.trigger(isOpen ? "open" : "close");
  }

  private trigger(event: DropdownEvent): void {
    this.listeners[event].forEach((handler) => handler());
  }
}
