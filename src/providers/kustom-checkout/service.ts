import { AbstractPaymentProvider, isString, MedusaError, MedusaErrorTypes, PaymentSessionStatus } from "@medusajs/framework/utils";
import { AuthorizePaymentInput, AuthorizePaymentOutput, CancelPaymentInput, CancelPaymentOutput, CapturePaymentInput, CapturePaymentOutput, DeletePaymentInput, DeletePaymentOutput, GetPaymentStatusInput, GetPaymentStatusOutput, PaymentActions, PaymentStatus, ProviderWebhookPayload, RefundPaymentInput, RefundPaymentOutput, RetrievePaymentInput, RetrievePaymentOutput, UpdatePaymentInput, UpdatePaymentOutput, WebhookActionResult } from "@medusajs/types";

import {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  Logger,
} from "@medusajs/framework/types";

import { createHmac } from "crypto";
import KlarnaClient from "../../lib/client";

export type Options = {
  apiUrl: string;
  username: string;
  password: string;
};

type InjectedDependencies = {
  logger: Logger;
};

class KustomCheckoutProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "kustom-checkout";
  protected logger_: Logger
  protected options_: Options
  protected client: KlarnaClient;

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options);
    this.logger_ = container.logger;
    this.options_ = options;

    // Init Klarna client
    this.client = new KlarnaClient(options);
  };

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

  async initiatePayment(
    input: InitiatePaymentInput,
  ): Promise<InitiatePaymentOutput> {
    // TODO: Run createOrder here, return the html snippet to frontend
    // Call this method in storefront via sdk.store.payment.initiatePaymentSession and display the returned iframe

    const {
      amount,
      currency_code,
      context
    } = input;

    console.log('### initiatePayment input', input);

    return {
      id: '0',
      data: {
        foo: 'bar',
      },
    };

    // Assuming the cart items are passed in the context
    // const cartItems = context.cart?.items || []

    // Use the cartItems in your payment provider's API call
    // const response = await this.client.initializePayment({
    //   amount,
    //   currency_code,
    //   items: cartItems.map(item => ({
    //     name: item.title,
    //     quantity: item.quantity,
    //     price: item.unit_price
    //   }))
    // });

    // return {
    //   id: response.id,
    //   data: response,
    // };
  };

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    // TODO: Figure out what this method should do. Could it cancelPayment (like this.cancelPayment)?
    return {}
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    // TODO: Figure out what this does.

    // const paymentSessionId = input.data?.session_id as string | undefined;
    // let data: PaymentSearchResult = {};
    // if (paymentSessionId) {
    // 	const payment = new Payment(this.client_);
    // 	const results = (await payment.search({ options: { external_reference: paymentSessionId } }))?.results ?? [];
    // 	data = results[0] ?? {}
    // }
    // // Returning PaymentSessionStatus.CAPTURED for auto capture, since for UY card method they are captured automatically
    // // Should make it conditionally in cases where a method could be not auto captured (maybe cash or another country)
    // return Promise.resolve({
    // 	data: data,
    // 	status: PaymentSessionStatus.CAPTURED,
    // })

    return Promise.resolve({
      data: {},
      status: PaymentSessionStatus.CAPTURED,
    });
  }

  capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    // TODO: Figure out what capturePayment is
    return Promise.resolve({ data: input.data })
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    // TODO: Should be pretty straight-forward. There is probably an api endpoint for this. (Or edit order endpoint)
    // const paymentId = input.data?.id
    // if (!paymentId || !isString(paymentId)) {
    // 	return { data: input.data ?? {} }
    // }
    // const payment = new Payment(this.client_)
    // const paymentData = await payment.cancel({ id: paymentId })
    // return { data: paymentData as unknown as Record<string, unknown> }
    return { data: {} };
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    // TODO: This should be really easy to implement. We make sure we store klarnas id when creating the payment above
    // Then re-use it here (and everywhere else) and just run the GET /order/id endpoint to fetch this data.

    const paymentId = input.data?.id
    // const payment = new Payment(this.client_)
    // const paymentData = await payment.get({ id: paymentId as string })
    const status = 'authorized';

    switch (status) {
      case 'authorized':
        return { status: 'authorized' }
      // @ts-ignore
      case 'approved':
      // @ts-ignore
      case 'in_mediation':
        return { status: 'captured' }

      // @ts-ignore
      case 'cancelled':
      // @ts-ignore
      case 'refunded':
        return { status: 'canceled' }
      default:
        return { status: 'pending' }
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    // TODO: Pretty clear what this does, figure out how to tell Klarna this order should be refunded.

    // const paymentId = this.getIdOrThrow(input.data)
    // const payment = new Payment(this.client_)
    // const paymentData = await payment.get({ id: paymentId })

    // const refundAmount = input.amount
    // const isPartial = (paymentData.transaction_amount ?? input.amount) > input.amount
    // const refund = new PaymentRefund(this.client_)
    // const refundData = await refund.create({
    // 	payment_id: paymentId, body: {
    // 		amount: isPartial ? Number(refundAmount) : undefined
    // 	}
    // })
    // return { data: refundData as unknown as Record<string, unknown> }
    return {};
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    // TODO: Is this just a GET from the Klarna API?

    // const paymentId = this.getIdOrThrow(input.data)
    // const payment = new Payment(this.client_)
    // const paymentData = await payment.get({ id: paymentId })
    return { data: {} as unknown as Record<string, unknown> };
  }

  updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    // TODO: Figure out what this method should be doing.
    return Promise.resolve({ data: input.data })
  }

  async getWebhookActionAndData(payload: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    // TODO: Not sure if webhooks has to be handled?

    this.validateWebhookSignature(payload);
    const eventType = payload.data.action;

    console.log('### webhook action', payload);

    try {
      switch (eventType) {
        case 'payment.created':
        case 'payment.updated':
          // const payment = new Payment(this.client_)
          // const paymentData = await payment.get({ id: mercadopagoData.data.id as string })
          // const paymentSessionId = paymentData.external_reference;

          // if (!paymentSessionId) {
          //   throw new Error('No external_reference found in mercadopago payload, unable to match against Medusa payment session')
          // }

          // if (['authorized', 'approved'].includes(paymentData.status ?? '')) {
          //   return {
          //     action: paymentData.status === 'approved' ? 'captured' : paymentData.status as PaymentActions,
          //     data: {
          //       session_id: paymentSessionId,
          //       amount: paymentData.transaction_amount!
          //     }
          //   }
          // }
          return { action: 'not_supported' }
        default:
          return { action: 'not_supported' }
      }
    } catch (error) {
      return { action: 'failed' }
    }
  }

  protected validateWebhookSignature(data: ProviderWebhookPayload['payload']) {
    const secret = null;
    // If no webhookSecret is set, the assumption is this protection is not required
    if (!secret) {
      return
    }

    const headers = data.headers;

    const xSignature = (headers['x-signature'] ?? 'noop') as string
    const xRequestId = (headers['x-request-id'] ?? 'noop') as string
    const body = (data?.data as any)
    const dataId = (body.data?.id ?? 'noop') as string

    const parts = xSignature.split(',')
    let timestamp: string | undefined;
    let hash: string | undefined;

    parts.forEach(part => {
      const [key, val] = part.split('=')
      if (key && val) {
        const [trimmedKey, trimmedVal] = [key.trim(), val.trim()]
        if (trimmedKey === 'ts') {
          timestamp = trimmedVal
        } else if (trimmedKey === 'v1') {
          hash = trimmedVal
        }
      }
    })
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${timestamp};`
    const hmac = createHmac('sha256', secret)
    hmac.update(manifest)
    const sha = hmac.digest('hex')
    if (sha !== hash) {
      this.logger_.warn(`Unable to verify authenticity of request with headers:\n
                ${headers}
            `)
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        'Invalid signature'
      )
    }
  }

  private getIdOrThrow(data?: Record<string, unknown>) {
    const id = data?.id
    if (!id || !isString(id)) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        'No valid string stored against \'id\' key of data object'
      )
    }
    return id as string
  }
};

export default KustomCheckoutProviderService;