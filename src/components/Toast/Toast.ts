type ToastType = "success" | "error" | "info";

export class Toast {
  private static container: HTMLElement;

  private static init(): void {
    if (!Toast.container) {
      Toast.container = document.createElement("div");
      Toast.container.className = "toast-container";
      document.body.appendChild(Toast.container);
    }
  }

  public static show(message: string, type: ToastType = "info"): void {
    Toast.init();

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;

    Toast.container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
