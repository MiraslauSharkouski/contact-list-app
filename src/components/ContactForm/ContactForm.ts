import IMask from "imask";
import { Toast } from "../components/Toast";
import { Contact } from "../../types";
import { Dropdown } from "../components/Dropdown";

export class ContactForm {
  private formElement: HTMLFormElement;
  private nameInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private dropdownContainer: HTMLElement;
  private dropdown: Dropdown | null = null;

  private onSubmit: (
    contact: Omit<Contact, "id">,
    isEdit: boolean,
    contactId?: string
  ) => void;

  constructor(
    container: HTMLElement,
    groups: { id: string; label: string }[],
    submitCallback: (
      contact: Omit<Contact, "id">,
      isEdit: boolean,
      contactId?: string
    ) => void
  ) {
    this.formElement = container.querySelector("form")!;
    this.nameInput = container.querySelector(".contact-form__input--name")!;
    this.phoneInput = container.querySelector(".contact-form__input--phone")!;
    this.dropdownContainer = container.querySelector("[data-dropdown]")!;
    this.onSubmit = submitCallback;

    // Инициализируем дропдаун
    this.dropdown = new Dropdown(this.dropdownContainer, groups);

    // Маска телефона
    IMask(this.phoneInput, { mask: "+{7}(000)000-00-00" });

    // Обработчик формы
    this.formElement.addEventListener("submit", this.handleSubmit);
  }

  private handleSubmit = (e: Event): void => {
    e.preventDefault();

    const name = this.nameInput.value.trim();
    const phone = this.phoneInput.value.trim();
    const groupId = this.dropdown?.getValue() || "";

    if (!name || !phone || !groupId) {
      Toast.show("Все поля обязательны для заполнения", "error");
      return;
    }

    const contact = { name, phone, groupId };

    const isEdit = !!this.formElement.dataset.editing;
    const contactId = this.formElement.dataset.contactId || undefined;

    this.onSubmit(contact, isEdit, contactId);

    if (!isEdit) {
      this.resetForm();
    }
  };

  public setFormData(contact: Contact): void {
    this.nameInput.value = contact.name;
    this.phoneInput.value = contact.phone;
    this.dropdown?.setValue(contact.groupId);
    this.formElement.dataset.editing = "true";
    this.formElement.dataset.contactId = contact.id;
  }

  public resetForm(): void {
    this.formElement.reset();
    this.dropdown?.reset();
    delete this.formElement.dataset.editing;
    delete this.formElement.dataset.contactId;
  }
}
