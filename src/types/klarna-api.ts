
export type KlarnaAPICreateOrderInput = {
  purchase_country: string; // ISO 3166 country code
  purchase_currency: string; // ISO 4217 currency code
  locale: string; // RFC 1766 locale code
  order_amount: number;
  order_tax_amount: number;
  order_lines: {
    type: string;
    reference: string;
    name: string;
    quantity: number;
    quantity_unit: string;
    unit_price: number;
    tax_rate: number;
    total_amount: number;
    total_discount_amount: number;
    total_tax_amount: number;
  }[];
  merchant_urls: {
    terms: string;
    checkout: string;
    confirmation: string;
    push: string;
  };
};

export type KlarnaAPICreateOrderResponse = {
  order_id: string;
  status: string;
  purchase_country: string; // ISO 3166 country code
  purchase_currency: string; // ISO 4217 currency code
  locale: string; // RFC 1766 locale code
  billing_address: {
    country: string;
  };
  customer: Record<string, unknown>; // Empty object, can be expanded based on actual customer structure
  shipping_address: {
    country: string;
  };
  order_amount: number;
  order_tax_amount: number;
  order_lines: {
    type: string;
    reference: string;
    name: string;
    quantity: number;
    quantity_unit: string;
    unit_price: number;
    tax_rate: number;
    total_amount: number;
    total_discount_amount: number;
    total_tax_amount: number;
  }[];
  merchant_urls: {
    terms: string;
    checkout: string;
    confirmation: string;
    push: string;
  };
  html_snippet: string;
  started_at: string;
  last_modified_at: string;
  options: {
    allow_separate_shipping_address: boolean;
    date_of_birth_mandatory: boolean;
    require_validate_callback_success: boolean;
  };
  external_payment_methods: any[]; // Assuming an empty array, update type if necessary
  external_checkouts: any[]; // Assuming an empty array, update type if necessary
};
