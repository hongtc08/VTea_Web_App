import { MonthlyInvoices } from '@/types/invoice';

export const MOCK_MONTHLY_INVOICES: MonthlyInvoices[] = [
  {
    monthYear: 'Tháng 06/2026',
    totalCount: 34,
    invoices: [
      {
        id: 'inv-34',
        code: '#34',
        createdAt: '28/06/2026 15:30',
        staffName: 'Nguyễn Văn A',
        customerName: 'Khách vãng lai',
        paymentMethod: 'CASH',
        subtotal: 120000,
        vat: 12000,
        totalAmount: 132000,
        items: [
          {
            id: 'item-1',
            name: 'Trà Sữa Ô Long',
            quantity: 2,
            price: 38000,
            toppings: [
              { id: 'top-1', name: 'Trân châu đen', quantity: 1, price: 5000 },
              { id: 'top-2', name: 'Phô mai viên', quantity: 1, price: 8000 },
            ],
          },
          {
            id: 'item-2',
            name: 'Bạc xỉu',
            quantity: 1,
            price: 35000,
            toppings: [],
          },
        ],
      },
      {
        id: 'inv-33',
        code: '#33',
        createdAt: '26/06/2026 10:15',
        staffName: 'Trần Thị B',
        customerName: 'Minh Hoàng',
        customerPhone: '0987654321',
        paymentMethod: 'TRANSFER',
        subtotal: 75000,
        vat: 7500,
        totalAmount: 82500,
        items: [
          {
            id: 'item-3',
            name: 'Cà phê Sữa đá',
            quantity: 2,
            price: 29000,
            toppings: [],
          },
        ],
      },
    ],
  },
  {
    monthYear: 'Tháng 05/2026',
    totalCount: 26,
    invoices: [
      {
        id: 'inv-26',
        code: '#26',
        createdAt: '20/05/2026 14:00',
        staffName: 'Nguyễn Văn A',
        customerName: 'Khách vãng lai',
        paymentMethod: 'CASH',
        subtotal: 90000,
        vat: 9000,
        totalAmount: 99000,
        items: [
          {
            id: 'item-4',
            name: 'Trà Đào Cam Sả',
            quantity: 2,
            price: 45000,
            toppings: [],
          },
        ],
      },
    ],
  },
  {
    monthYear: 'Tháng 04/2026',
    totalCount: 4,
    invoices: [
      {
        id: 'inv-4',
        code: '#4',
        createdAt: '27/04/2026 19:45',
        staffName: 'Nguyễn Văn A',
        customerName: 'Khách vãng lai',
        paymentMethod: 'CASH',
        subtotal: 184000,
        vat: 18400,
        totalAmount: 202400,
        items: [
          {
            id: 'item-5',
            name: 'Trà Đào Cam Sả',
            quantity: 2,
            price: 45000,
            toppings: [
              { id: 't-1', name: 'Củ năng', quantity: 1, price: 6000 },
              { id: 't-2', name: 'Trân châu trắng', quantity: 1, price: 6000 },
            ],
          },
          {
            id: 'item-6',
            name: 'Chocolate đá xay',
            quantity: 2,
            price: 45000,
            toppings: [
              { id: 't-3', name: 'Phô mai viên', quantity: 1, price: 8000 },
            ],
          },
        ],
      },
      {
        id: 'inv-3',
        code: '#3',
        createdAt: '27/04/2026 11:20',
        staffName: 'Nguyễn Văn A',
        customerName: 'Khách vãng lai',
        paymentMethod: 'CASH',
        subtotal: 60000,
        vat: 6000,
        totalAmount: 66000,
        items: [
          {
            id: 'item-7',
            name: 'Cà phê Đen đá',
            quantity: 2,
            price: 25000,
            toppings: [
              { id: 't-4', name: 'Trân châu đen', quantity: 1, price: 5000 },
            ],
          },
        ],
      },
      {
        id: 'inv-2',
        code: '#2',
        createdAt: '25/04/2026 09:10',
        staffName: 'Trần Thị B',
        customerName: 'Jenny',
        customerPhone: '0901234567',
        paymentMethod: 'TRANSFER',
        subtotal: 72727,
        vat: 7273,
        totalAmount: 80000,
        items: [
          {
            id: 'item-8',
            name: 'Cappuccino',
            quantity: 2,
            price: 35000,
            toppings: [],
          },
        ],
      },
      {
        id: 'inv-1',
        code: '#1',
        createdAt: '05/04/2026 08:30',
        staffName: 'Nguyễn Văn A',
        customerName: 'Khách vãng lai',
        paymentMethod: 'CASH',
        subtotal: 45000,
        vat: 4500,
        totalAmount: 49500,
        items: [
          {
            id: 'item-9',
            name: 'Trà Sữa Ô Long',
            quantity: 1,
            price: 38000,
            toppings: [
              { id: 't-5', name: 'Trân châu đen', quantity: 1, price: 5000 },
            ],
          },
        ],
      },
    ],
  },
];

