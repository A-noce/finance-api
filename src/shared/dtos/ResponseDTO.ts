export class ResponseDTO<T> {
  status = '200';
  message = 'success';
  body: T | null = null;

  setBody(data: T) {
    this.body = data;
    return this;
  }

  seMessage(data: string) {
    this.message = data;

    return this;
  }

  setStatus(data: string) {
    this.status = data;
    return this;
  }
}
