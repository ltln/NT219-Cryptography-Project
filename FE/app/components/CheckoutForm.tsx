// components/CheckoutForm.tsx
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { Dispatch, SetStateAction, useState } from 'react';
import { PaymentIntent } from '../types/paymentIntent';
import Image from 'next/image';
import { Check, CreditCard, ShoppingCart } from 'lucide-react';
import { CartData } from '../provider';
import { useRouter } from 'next/navigation';

export default function CheckoutForm({ paymentIntent, cart, setCart }: { paymentIntent: PaymentIntent, cart: CartData[], setCart: Dispatch<SetStateAction<CartData[]>> }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setError(result.error.message || 'Thanh toán thất bại.');
    } else if (result.paymentIntent?.status === 'succeeded') {
        setCart([]);
        setSuccess(true);
        setTimeout(() => {
            router.replace('/user/purchase');
        }, 2000);
    }

    setLoading(false);
  };

  if (success) 
    return (
        <div className="w-full px-2 py-8">
            <div className="max-w-xl mx-auto py-12 bg-white shadow-md rounded-xl space-y-4 flex items-center justify-center flex-col">
                <Check size={64} className="text-green-500" />
                <p>Thanh toán thành công :D</p>
            </div>
        </div>
    )

  return (
    <div className="w-full px-2 py-8">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Thanh toán</h2>
        <hr className="mb-4" />
        <p className="flex items-center gap-2 font-bold">
            <ShoppingCart />
            Giỏ hàng của bạn
        </p>
        <div className="mb-4 rounded-lg bg-gray-100">
        {
            paymentIntent.orderDetails.map((item, index) => (
            <div className="flex gap-4 p-2 border-b last:border-b-0" key={index}>
                <Image src={item.coverImage || ""} alt="" width={50} height={140} className="object-contain" />
                <div className="w-full">
                    <table className="w-full table-auto">
                        <tr className="text-primary-800 font-bold">
                            <td>{item.productName}</td>
                            <td className="text-right min-w-[120px]">
                                x{item.quantity}
                            </td>
                        </tr>
                        <tr className="text-sm">
                            <td>{Intl.NumberFormat('vi-VN').format(item.price)}đ</td>
                            <td className="text-right font-bold">
                                {Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            ))
        }
        <div className="flex gap-4 p-2">
            <div className="w-full">
                <table className="w-full table-auto">
                    <tr>
                        <td>Tổng số tiền</td>
                        <td className="text-right font-bold">
                            {Intl.NumberFormat('vi-VN').format(paymentIntent.amount)}đ
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        </div>
        <p className="flex items-center gap-2 font-bold">
            <CreditCard />
            Thanh toán
        </p>
        <div className="">
            <table className="w-full table-fixed">
                <tr>
                    <td className="text-sm text-right w-[120px]">Họ và Tên:</td>
                    <td className="text-primary-800 font-bold">{paymentIntent.billingDetails.fullName}</td>
                </tr>
                <tr>
                    <td className="text-sm text-right">Số điện thoại:</td>
                    <td className="text-primary-800 font-bold">{paymentIntent.billingDetails.phone}</td>
                </tr>
                <tr>
                    <td className="text-sm text-right">Email:</td>
                    <td className="text-primary-800 font-bold">{paymentIntent.billingDetails.email}</td>
                </tr>
                <tr>
                    <td className="text-sm text-right">Địa chỉ:</td>
                    <td className="text-primary-800 font-bold">{paymentIntent.billingDetails.address}</td>
                </tr>
            </table>
        </div>
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
            <CardElement
                options={{
                    style: {
                    base: {
                        fontSize: '16px',
                        color: '#1f2937',
                        '::placeholder': { color: '#9ca3af' },
                    },
                    invalid: { color: '#dc2626' },
                    },
                    hidePostalCode: true,
                }}
            />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {success ? (
            <p className="text-green-600 font-medium">Payment succeeded!</p>
        ) : (
            <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-primary-700 text-white font-medium py-2 px-4 rounded-md hover:bg-primary-700/80 transition disabled:opacity-50"
            >
            {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
            </button>
        )}
        </form>
    </div>
  );
}
