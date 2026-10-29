export interface CreateInvoiceItemToppingRequest {
  toppingId: number;
  quantity: number;
}

export interface CreateInvoiceItemRequest {
  productId: number;
  quantity: number;
  toppings?: CreateInvoiceItemToppingRequest[];
}

export type PaymentMethodEnum = 'CASH' | 'TRANSFER';

export interface CreateInvoiceRequest {
  paymentMethod: PaymentMethodEnum;
  items: CreateInvoiceItemRequest[];
}

export interface InvoiceDetailToppingResponse {
  toppingId: number;
  toppingName: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDetailResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  toppings: InvoiceDetailToppingResponse[];
}

export interface InvoiceResponse {
  invoiceId: number;
  userId: number;
  staffName: string;
  paymentMethod: PaymentMethodEnum;
  totalAmount: number;
  createdAt: string;
  items: InvoiceDetailResponse[];
}

