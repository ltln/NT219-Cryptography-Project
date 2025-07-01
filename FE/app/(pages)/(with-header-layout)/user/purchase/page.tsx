'use client';
import OrderedBook from '@/app/components/OrderedBook';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/Accordion';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/Pagination';
import { Separator } from '@/app/components/ui/Separator';
import { useAuth } from '@/app/lib/hooks/useAuth';
import httpClient from '@/app/lib/httpClient';
import { useQuery } from '@tanstack/react-query';
import { falcon } from 'falcon-crypto';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const statusOptions = {
  "PENDING": "Đang chờ xác minh",
  "PROCESSING": "Đang xử lý",
  "IN_TRANSIT": "Đang vận chuyển",
  "DELIVERED": "Đã giao hàng",
  "CANCELLED": "Đã huỷ",
}

export default function OrderPage() {
  const [fetchingState, setFetchingState] = useState<boolean>(false);
  const { falconPublicKey, user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => httpClient.get('/order'),
    enabled: !!user
  });

  const orders = data;

  useEffect(() => {
    document.title = "Đơn mua";
  }, [])

  console.log(orders);

  const fetchInvoice = async (orderId: string) => {
    if (fetchingState) return;
    setFetchingState(true);
    try {
        const { signature, invoiceUrl } = await httpClient.get<{ invoiceUrl: string, signature: string }>(`/order/invoice/${orderId}`);
        console.log('Fetched invoice data:', { signature, invoiceUrl });
        const pdfBuffer = await fetchPDF(invoiceUrl);
        if (!signature || !falconPublicKey) {
            throw new Error('Signature or invoice URL is missing');
        }
        const isValid = await falcon.verifyDetached(
            Uint8Array.from(Buffer.from(signature, 'base64')),
            new Uint8Array(pdfBuffer),
            Uint8Array.from(Buffer.from(falconPublicKey, 'base64'))
        );
        if (!isValid) {
            throw new Error('Invalid signature for the invoice');
        }
        console.log('Signature is valid for the invoice');
        handleDownloadInvoice(invoiceUrl);
    } catch (error) {
        toast.error('Không thể tải hoá đơn. Vui lòng thử lại sau.');
        console.error(error);
    }
    setFetchingState(false);
  }

  async function fetchPDF(pdfURL: string) {
      const pdfRes = await fetch(pdfURL);
      const pdfArrayBuffer = await pdfRes.arrayBuffer();
      return pdfArrayBuffer;
  }

  const handleDownloadInvoice = async (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }

  return (
    <main className="bg-white rounded-[0.625rem] p-4 pb-8">
      <h2 className="mb-4 text-lg font-semibold text-primary-700">Đơn mua</h2>

      <div>
        <div className="flex items-center space-x-2">
          <Input placeholder="Tìm kiếm..." variant="secondary" />
          <Button size="sm">Tìm</Button>
        </div>

        <Separator className="mb-4" />

        {isLoading ? (
          <p>Đang tải...</p>
        ) : orders?.length === 0 ? (
          <p>Không có đơn hàng.</p>
        ) : (
          <Accordion type="single" collapsible>
            {
              orders?.map((order: any) => (
              <AccordionItem value={order.orderId} className="border-[1px] px-4 rounded-md border-primary-500" key={order.orderId}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <h4 className="font-medium uppercase">#{order.orderId}</h4>
                    <span className="text-donkey-brown-500 font-medium">
                      {statusOptions[order.status as keyof typeof statusOptions] || 'Không xác định'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-3">
                    {order.orderDetails.map((item: any, index: number) => (
                      <OrderedBook
                        key={index}
                        book={item.product}
                        count={item.quantity}
                      />
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Tổng tiền:</span>
                    <span className="text-lg font-semibold text-ferra-700">
                      {Intl.NumberFormat('vi-VN').format(order.orderDetails.reduce((sum: number, item: any) => sum + item.subtotal, 0))} đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Ngày: {(new Date(order.orderDate)).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1 mt-1">Chữ ký đơn hàng:</p>
                    <p className="text-xs border-ferra-700 border-[1px] px-1 py-[1px] rounded-md hover:bg-ferra-100 w-full break-all">VGhpcyBpcyBhIHBsYWNlaG9sZGVyIEZBTC1PTi01MTIgc2lnbmF0dXJlIHN0cmluZy4gVXNlIHRoaXMgZm9yIHRlc3RpbmcgcHVycG9zZXMgaW4gZGV2ZWxvcG1lbnQuIFRoZSBhY3R1YWwgc2lnbmF0dXJlIHdvdWxkIGJlIG11Y2ggbG9uZ2VyIHRoYW4gdGhpcy4gRG8gbm90IHVzZSBmb3IgcHJvZHVjdGlvbi4gVGhpcyBzaWduYXR1cmUgaXMgYmFzZTY0IGVuY29kZWQuIFdoZW4gcmVhZHkgdGhpcyBzaWduYXR1cmUgaXMgc2ltcGx5IGEgcGxhY2Vob2xkZXIsIHJlcGxhY2Ugd2l0aCBhIHJlYWwgb25lLg==</p>
                    <p className="text-sm text-gray-500 mt-1">Chứng chỉ: <span className="text-ferra-700 hover:text-ferra-900 cursor-pointer hover:underline">Xem</span></p>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Button disabled={(order.status === "PENDING" || order.status === "PROCESSING") ?? false}>Đã nhận được hàng</Button>
                  </div>
                  {/* <span
                    onClick={() => fetchInvoice(order.orderId)}
                    className="text-blue-500 hover:underline mt-2 inline-flex items-center cursor-pointer"
                  >Tải xuống hoá đơn</span> */}
                </AccordionContent>
              </AccordionItem>
              ))
            }
          </Accordion>
        )
        }

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
