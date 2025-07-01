import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { CartData } from '../provider/index';
import { StoreContext } from '@/app/context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/Form';
import { Input } from './ui/Input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/Label';
import { useAuth } from '../lib/hooks/useAuth';
import httpClient from '../lib/httpClient';
import { toast } from 'react-toastify';
import { sign } from '../lib/csr';

const formSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại').max(11, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional(),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  cardNumber: z.string().length(16, 'Số thẻ phải có 16 chữ số').optional(),
  cardExpiry: z.string().length(5, 'Ngày hết hạn phải có định dạng MM/YY').optional(),
  cardCVC: z.string().length(3, 'CVC phải có 3 chữ số').optional(),
  cardHolderName: z.string().min(1, 'Vui lòng nhập tên chủ thẻ').optional(),
});

export default function Thanhtoan({ selected }: { selected: CartData[] }) {
  const { cartData, setCartData } = useContext(StoreContext);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: '',
      email: user?.email || '',
      address: '',
    },
  });

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const data = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email ?? null,
      address: formData.address,
      items: selected.map(item => ({
        productId: item.book.productId,
        quantity: item.count,
      })),
      paymentMethod
    }

    const privateKey = localStorage.getItem('falconPrivateKey');
    if (!privateKey) {
      toast.error('Không tìm thấy khoá riêng tư để ký đơn hàng!');
      return;
    }

    const signature = await sign(JSON.stringify(data), privateKey);

    console.log('Chữ ký đơn hàng: ', signature);

    const order = {
      data,
      signature,
    }

    setPaymentProcessing(true);
    try {
      const res = await httpClient.post('/order/create', order);

      console.log(res);

      if (data.paymentMethod === 'cod') {
        toast.success('Đặt hàng thành công! Vui lòng kiểm tra đơn hàng của bạn.');
        setCartData([]);
        setTimeout(() => {
          router.replace('/user/purchase');
        }, 2000)
        return;
      }

      // router.push(`/checkout/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Đặt hàng thất bại, vui lòng thử lại sau!');
    }
  }

  return (
    <div className="sticky max-lg:left-0 max-lg:bottom-0 lg:top-20 h-fit max-lg:bg-donkey-brown-100 bg-white col-span-full lg:col-span-3 px-4 py-3 rounded-xl">
      <p className="font-semibold mb-2">
        Thanh toán ({selected.length} sản phẩm)
      </p>
      <hr className="mb-2" />
      <div className="relative mb-8">
        <span className="text-sm mt-2">Tổng số tiền</span>
        <p className="text-center text-lg text-ferra-700 font-bold float-right mb-4">
          {selected
            .reduce(
              (acc, cur) =>
                acc +
                (cur.book.price
                  ? (cur.book.price - cur.book.discount) * cur.count
                  : 100000 * cur.count),
              0,
            )
            .toLocaleString('vi-VN')}{' '}
          đ
        </p>
      </div>
      {
        user && cartData.length > 0 && (
        <>
        <p className="font-semibold mb-2">
          Thông tin thanh toán
        </p>
        <hr className="mb-2" />
        <Form {...form}>
          <form className="space-y-2 mb-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>

                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập họ và tên"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số điện thoại"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Nhập Email (tuỳ chọn)"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nhập địa chỉ"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <p className="font-semibold mb-2">
          Phương thức thanh toán
        </p>
        <hr className="mb-2" />
        <RadioGroup defaultValue="cod" onValueChange={(e) => setPaymentMethod(e as 'cod' | 'card')} className="mb-8">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="payment-cod" />
            <Label htmlFor="payment-cod">Thanh toán khi nhận hàng</Label>
          </div>
          {/* <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="payment-card" />
            <Label htmlFor="payment-card">Thẻ tín dụng/ghi nợ</Label>
          </div> */}
        </RadioGroup>
        </>
        )
      }
      
      <Button
        className="w-full"
        onClick={form.handleSubmit(onSubmit)}
        disabled={!user || paymentProcessing || selected.length == 0}
      >
        {!user ? 'Vui lòng đăng nhập' : paymentProcessing ? 'Processing...' : 'Thanh toán'}
      </Button>
    </div>
  );
}
