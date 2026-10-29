export interface InvoiceItemTopping {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  toppings: InvoiceItemTopping[];
}

export interface InvoiceHistory {
  id: string;
  code: string;
  createdAt: string;
  staffName: string;
  customerName: string;
  customerPhone?: string;
  paymentMethod: 'CASH' | 'TRANSFER' | 'CARD' | 'E_WALLET';
  totalAmount: number;
  subtotal: number;
  vat: number;
  items: InvoiceItem[];
}

export interface MonthlyInvoices {
  monthYear: string; // e.g. "Tháng 06/2026"
  totalCount: number;
  invoices: InvoiceHistory[];
}

