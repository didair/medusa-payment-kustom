import type { Options } from "../modules/kustom-checkout/service";

class KlarnaClient {
  private options: Options;

  constructor(props: Options) {
    this.options = props;
  }

  private get(route: string) {
    return fetch(this.options.apiUrl + route, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${this.getEncodedCredentials()}`
      },
    })
    .then((response) => response.json());
  }

  private post(route: string) {
    return fetch(this.options.apiUrl + route, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.getEncodedCredentials()}`
      },
    })
    .then((response) => response.json());
  }

  private getEncodedCredentials(): string {
    return btoa(this.options.username + ':' + this.options.password);
  }
};