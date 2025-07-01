import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/Dialog';
import { IOrder } from '@/app/models/order';
import { Button } from './Button';
import { Check, X } from 'lucide-react';

export function ViewOrder({ children, product }: { children: React.ReactNode, product: IOrder }) {
    return (
      <Dialog>
        <DialogTrigger>{ children }</DialogTrigger>
        <DialogContent className="lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem đơn mua</DialogTitle>
            <DialogDescription>
              ID: {product.orderId}
            </DialogDescription>
          </DialogHeader>
          <div>
            <p className="text-sm text-ferra-700 underline mb-2">Thông tin đơn mua</p>
            <div className="grid grid-cols-5 gap-x-4 gap-y-2">
              <div className="col-span-1 flex items-center justify-end font-semibold text-sm text-gray-500">
                Khách hàng
              </div>
              <div className="col-span-4 flex items-center">
                {product.user.username}
              </div>
              <div className="col-span-1 flex items-center justify-end font-semibold text-sm text-gray-500">
              Ngày mua
              </div>
              <div className="col-span-4 flex items-center">
                {(new Date(product.orderDate)).toLocaleString("vi-VN")}
              </div>
              <div className="col-span-1 flex items-center justify-end font-semibold text-sm text-gray-500">
                Trạng thái
              </div>
              <div className="col-span-4 flex items-center">
                {product.status}
              </div>
              <div className="col-span-1 flex items-center justify-end font-semibold text-sm text-gray-500">
                Thành tiền
              </div>
              <div className="col-span-4 flex items-center">
                {product.total.toLocaleString("vi-VN")} đ
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-ferra-700 underline mb-2">Sản phẩm đã mua</p>
            <table className="table-auto w-full border-[1px] border-gray-400 border-spacing-y-2 rounded-lg">
              <thead>
                <tr className="text-sm text-gray-400 border-b-[1px]">
                  <th>Tên</th>
                  <th className="w-16">Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
              {
                product.orderDetails.map((data, i) => {
                  return (
                    <tr 
                      className="text-sm [&:not(:last-child)]:border-b-[1px] hover:bg-ferra-100 cursor-pointer"
                      onClick={() => data.product != null ? window.open(`/books/${data.product.productId}`) : undefined}
                      key={i}
                    >
                      <td className="px-2 py-1">{data.product.name != null ? data.product.name : "N/A"}</td>
                      <td className="text-center">{data.quantity}</td>
                      {
                        data.product != null && data.product.discount ? (
                          <td className="text-center">{data.product != null ? (data.product.price - data.product.discount).toLocaleString("vi-VN") : "N/A"} đ <span className="text-xs line-through text-gray-500">{data.product != null ? data.product.price.toLocaleString("vi-VN") : "N/A"} đ</span></td>
                        ) : (
                          <td className="text-center">{data.product != null ? data.product.price : "N/A"}</td>
                        )
                      }
                      <td className="text-center">{data.product ? ((data.product.price - data.product.discount) * data.quantity).toLocaleString("vi-VN") + " đ" : "N/A"}</td>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
          <div className="w-full space-y-2">
            <p className="text-sm text-ferra-700 underline mb-2">Xác nhận đơn hàng</p>
            <p className="text-sm">Chữ ký:</p>
            <div className="text-xs border-ferra-700 border-[1px] px-1 py-[1px] rounded-md hover:bg-ferra-100 w-full break-all">
              <p>VGhpcyBpcyBhIHBsYWNlaG9sZGVyIEZBTC1PTi01MTIgc2lnbmF0dXJlIHN0cmluZy4gVXNlIHRoaXMgZm9yIHRlc3RpbmcgcHVycG9zZXMgaW4gZGV2ZWxvcG1lbnQuIFRoZSBhY3R1YWwgc2lnbmF0dXJlIHdvdWxkIGJlIG11Y2ggbG9uZ2VyIHRoYW4gdGhpcy4gRG8gbm90IHVzZSBmb3IgcHJvZHVjdGlvbi4gVGhpcyBzaWduYXR1cmUgaXMgYmFzZTY0IGVuY29kZWQuIFdoZW4gcmVhZHkgdGhpcyBzaWduYXR1cmUgaXMgc2ltcGx5IGEgcGxhY2Vob2xkZXIsIHJlcGxhY2Ugd2l0aCBhIHJlYWwgb25lLg==</p>
            </div>
            <p className="text-sm">Chứng chỉ: <span className="text-ferra-700 hover:text-ferra-900 cursor-pointer hover:underline">Xem</span></p>
            <hr />
            <div>
              <p className="text-sm">Kiểm tra chữ ký và chứng chỉ (FALCON-512):</p>
              <p className="flex gap-2 items-center text-green-700 text-sm"><Check /> Hợp lệ</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>Xác nhận</Button>
              <Button className="bg-red-500 hover:bg-red-700">Huỷ</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }