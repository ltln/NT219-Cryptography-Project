import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  data: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    items: {
      productId: string;
      quantity: number;
    }[];
    paymentMethod: 'cod' | 'card';
  };
  signature: string;
}
