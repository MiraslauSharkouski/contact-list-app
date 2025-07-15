export class Contact {
  id: string;
  name: string;
  phone: string;
  groupId: string;

  constructor(name: string, phone: string, groupId: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.phone = phone;
    this.groupId = groupId;
  }
}
