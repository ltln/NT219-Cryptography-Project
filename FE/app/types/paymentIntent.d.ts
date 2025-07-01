export interface PaymentIntent {
    orderId: string;
    orderDetails: {
        productId: string;
        productName?: string;
        coverImage?: string;
        quantity: number;
        price: number;
    }[];
    billingDetails: {
        fullName: string;
        phone: string;
        email?: string;
        address: string;
    };
    amount: number;
    clientSecret: string;
}