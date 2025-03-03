import type { Options } from "../providers/kustom-checkout/service";
import { KlarnaAPICreateOrderInput, KlarnaAPICreateOrderResponse } from "../types/klarna-api";

class KlarnaClient {
  private options: Options;

  constructor(props: Options) {
    this.options = props;
  }

  public async createOrder(order: KlarnaAPICreateOrderInput) {
    const createdOrder = await this.post<KlarnaAPICreateOrderResponse>('/checkout/v3/orders', order);
    return createdOrder;
  };

  public async getOrderById(orderId: string) {
    const order = await this.get<KlarnaAPICreateOrderResponse>(`/checkout/v3/orders/${orderId}`);
    return order;
  };

  private async get<T>(route: string) {
    const response = await fetch(this.options.apiUrl + route, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.getEncodedCredentials()}`
      },
    });

    return await (response.json() as Promise<T>);
  };

  private async post<T>(route: string, data?: any) {
    const response = await fetch(this.options.apiUrl + route, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.getEncodedCredentials()}`
      },
    });

    return await (response.json() as Promise<T>);
  };

  private getEncodedCredentials(): string {
    return btoa(this.options.username + ':' + this.options.password);
  };
};

export default KlarnaClient;