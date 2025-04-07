export class Option {
  key?: string;
  value?: string;

  constructor(data: Partial<Option>) {
    Object.assign(this, data);
  }
}
