import {
  CapturePaymentInput,
  CapturePaymentOutput,
  PaymentProviderError,
} from "@medusajs/framework/types";

import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"

export type Options = {
  apiUrl: string;
  username: string;
  password: string;
};

class KustomCheckoutPaymentProviderService extends AbstractPaymentProvider<
  Options
> {
  static identifier = "kustom-checkout";

  static validateOptions(options: Record<any, any>) {
    if (!options.apiUrl) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Klarna API URL is required. See plugin readme"
      );
    }

    if (!options.username || !options.password) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Klarna username and password is required in the provider's options."
      );
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    const externalId = input.data?.id;

    // assuming you have a client that captures the payment
    const newData = await this.client.capturePayment(externalId)
    return { data: newData }
  };

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const externalId = input.data?.id

    // assuming you have a client that authorizes the payment
    const paymentData = await this.client.authorizePayment(externalId)

    return {
      data: paymentData,
      status: "authorized"
    }
  };

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    const externalId = input.data?.id

    // assuming you have a client that cancels the payment
    const paymentData = await this.client.cancelPayment(externalId)
    return { data: paymentData }
  }


};

export default KustomCheckoutPaymentProviderService;