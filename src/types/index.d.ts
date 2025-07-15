export interface Group {
  id: string;
  name: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  groupId: string;
}
