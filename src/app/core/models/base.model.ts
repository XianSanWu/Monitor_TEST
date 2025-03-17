export class ResponseModel<T> {
  code!: string;
  message!: string;
  result!: T;
}
