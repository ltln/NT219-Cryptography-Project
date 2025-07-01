// models/order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  user: {
    userId: string;
    username: string;
  };
  orderDetails: {
    product: {
      productId: string;
      name: string;
      price: number;
      discount: number;
    },
    quantity: number;
    subtotal: number;
  }[];
  total: number;
  status: string;
  orderDate: Date;
}
