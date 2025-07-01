import Review from '@/app/components/Review';
import Stars from '@/app/components/Stars';
import { Button, buttonVariants } from '@/app/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/Dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/ui/Pagination';
import { Separator } from '@/app/components/ui/Separator';
import { Textarea } from '@/app/components/ui/Textarea';
import { Label } from '@/app/components/ui/Label';
import { cn } from '@/app/lib/utils';
import { PencilIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { IBook } from '@/app/models/book';

export default function ReviewsAndRates({ book }: { book: IBook }) {
  return (
    <section className="bg-white rounded-[0.625rem] p-4 pb-6">
      <h3 className="font-semibold text-lg text-primary-700">Đánh giá</h3>

      <div className="mt-6 flex items-center lg:flex-row flex-col">
        <div className="flex items-center">
          <div className="flex flex-col items-center px-10">
            <div className="font-semibold">
              <span className="text-3xl">4.7</span>
              <span className="text-xl ml-1">/5</span>
            </div>

            <Stars value={4.7} className="mt-4" />

            <span className="text-sm text-gray-500 mt-2">(65 đánh giá)</span>
          </div>

          <div className="text-sm space-y-1 max-sm:hidden">
            <div className="flex items-center space-x-2">
              <span>5 sao</span>
              <div className="bg-gray-300 h-1 w-64">
                <div className="h-full bg-banana-mania-300 w-1/2"></div>
              </div>
              <span>50%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>4 sao</span>
              <div className="bg-gray-300 h-1 w-64">
                <div className="h-full bg-banana-mania-300 w-1/2"></div>
              </div>
              <span>50%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>3 sao</span>
              <div className="bg-gray-300 h-1 w-64">
                <div className="h-full bg-banana-mania-300 w-1/2"></div>
              </div>
              <span>50%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>2 sao</span>
              <div className="bg-gray-300 h-1 w-64">
                <div className="h-full bg-banana-mania-300 w-1/2"></div>
              </div>
              <span>50%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>1 sao</span>
              <div className="bg-gray-300 h-1 w-64">
                <div className="h-full bg-banana-mania-300 w-1/2"></div>
              </div>
              <span>50%</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center lg:mt-0 mt-8">
          <Dialog>
            <DialogTrigger
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'cursor-pointer',
              )}
            >
              <PencilIcon className="h-5 mr-3" />
              <span>Đánh giá ngay</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nhận xét và đánh giá</DialogTitle>
              </DialogHeader>

              <div>
                <div className="flex items-center">
                  <Image
                    alt=""
                    src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_183396.jpg"
                    width={50}
                    height={50}
                    className="object-cover w-8 h-8"
                  />
                  <div className="line-clamp-1 text-sm ml-2">
                    Vạn Dặm Đường Từ Một Bước Chân - Tặng Kèm Bookmark
                  </div>
                </div>
                <Separator />
                <div className="flex justify-center">
                  <Stars value={5} changeable className="mx-auto text-2xl" />
                </div>
                <div className="grid w-full items-center gap-2 mt-6">
                  <Label htmlFor="email">
                    <span className="font-medium"> Nhận xét </span>
                    <span className="text-xs text-gray-500 ml-1">
                      (Tùy chọn)
                    </span>
                  </Label>
                  <Textarea autoFocus placeholder="Viết nhận xét của bạn" />
                </div>
                <div className="flex justify-end mt-8">
                  <Button>Đánh giá ngay</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <Review />
        <Review />
        <Review />
        <Review />
      </div>

      <Pagination className="mt-6">
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
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
