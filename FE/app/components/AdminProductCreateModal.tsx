import categories from '@/app/data/categories.json';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { IBook } from '../models/book';
import { Button } from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/Form';
import { Input } from './ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/Select';
import { Textarea } from './ui/Textarea';
import { useAuth } from '../lib/hooks/useAuth';
import httpClient from '../lib/httpClient';

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tiêu đề sách'),
  author: z.string().min(1, 'Vui lòng nhập tác giả'),
  publisher: z.string().min(1, 'Vui lòng nhập nhà phát hành'),
  publishYear: z.coerce.number().min(1, 'Vui lòng nhập năm phát hành'),
  price: z.coerce.number().min(1, 'Vui lòng nhập giá'),
  discount: z.coerce.number().min(0, 'Vui lòng nhập tiền giảm giá'),
  weight: z.coerce.number().min(1, 'Vui lòng nhập trọng lượng'),
  stock: z.coerce.number().min(1, 'Vui lòng nhập số lượng'),
  language: z.string().min(1, 'Vui lòng nhập ngôn ngữ'),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  description: z.string().optional(),
  sizeX: z.coerce.number().min(0, 'Vui lòng nhập kích thước sách'),
  sizeY: z.coerce.number().min(0, 'Vui lòng nhập kích thước sách'),
  sizeZ: z.coerce.number().min(0, 'Vui lòng nhập kích thước sách'),
  coverType: z.string().min(1, 'Vui lòng chọn loại bìa'),
  pageCount: z.coerce.number().min(1, 'Vui lòng nhập số trang'),
  coverImage: z.string().min(1, 'Vui lòng chọn ảnh bìa'),
  image1: z.string().optional(),
  image2: z.string().optional(),
  image3: z.string().optional(),
});

interface ProductCreateModalProps {
  defaultValues?: IBook;
  action?: 'create' | 'update';
  children?: React.ReactNode;
}

export default function ProductCreateModal({
  action = 'create',
  children,
  defaultValues,
}: ProductCreateModalProps) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      author: defaultValues?.author || '',
      category: defaultValues?.category || '',
      description: defaultValues?.description || '',
      discount: defaultValues?.discount || 0,
      language: defaultValues?.language || '',
      pageCount: defaultValues?.pageCount || 0,
      price: defaultValues?.price || 0,
      publishYear: defaultValues?.publishYear || 0,
      publisher: defaultValues?.publisher || '',
      sizeX: defaultValues?.dimensionsX || 0,
      sizeY: defaultValues?.dimensionsY || 0,
      sizeZ: defaultValues?.dimensionsZ || 0,
      stock: defaultValues?.stock || 0,
      weight: defaultValues?.weight || 0,
      coverType: defaultValues?.coverType || '',
      coverImage: defaultValues?.coverImage || '',
      image1: defaultValues?.images[0] || '',
      image2: defaultValues?.images[1] || '',
      image3: defaultValues?.images[2] || '',
    },
  });

  async function onSubmit({
    sizeX,
    sizeY,
    sizeZ,
    image1,
    image2,
    image3,
    ...values
  }: z.infer<typeof formSchema>) {
    try {
      const book = {
        ...values,
        dimensionsX: sizeX,
        dimensionsY: sizeY,
        dimensionsZ: sizeZ,
        images: [image1, image2, image3].filter(Boolean),
      };
      if (action === 'create') {
        console.log(book);
        await httpClient.post('/product', book);
        toast.success('Thêm sản phẩm thành công');
      } else {
        const res = await httpClient.patch<IBook>(
          `/product/${defaultValues?.productId}`,
          book,
        );
        toast.success('Cập nhật sản phẩm thành công');
        queryClient.invalidateQueries({
          queryKey: ['books/' + res.productId],
        });
      }
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
    } catch (error) {
      if (action === 'create')
        toast.error('Thêm sản phẩm thất bại! Vui lòng thử lại sau');
      else toast.error('Cập nhật sản phẩm thất bại! Vui lòng thử lại sau');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="lg:max-w-4xl max-w-[calc(100vw-1rem)]">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 px-4 py-2 overflow-auto"
          >
            <div className="col-span-1">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề sách" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tác giả</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tác giả" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhà phát hành</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập nhà phát hành" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publishYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm phát hành</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập năm phát hành" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập giá sách" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiền giảm giá</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tiền giảm giá" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Kích thước</FormLabel>
                    <div className="grid grid-cols-3 gap-0.5">
                      <FormField
                        control={form.control}
                        name="sizeX"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="X" {...field} />
                            </FormControl>

                            <FormMessage className="whitespace-nowrap" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sizeY"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Y" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sizeZ"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Z" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khối lượng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập khối lượng" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số lượng" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngôn ngữ</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập ngôn ngữ" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại bìa</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="- Chọn loại bìa -" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {[
                              { label: 'Bìa cứng', value: 'HARD' },
                              { label: 'Bìa mềm', value: 'SOFT' },
                            ].map(({ label, value }, index) => (
                              <SelectItem key={index} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pageCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số trang</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số trang" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-1 space-y-2">
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh bìa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập url ảnh bìa" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ảnh 1{' '}
                      <span className="text-xs text-gray-500 font-normal">
                        (Tùy chọn)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập url ảnh" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ảnh 2{' '}
                      <span className="text-xs text-gray-500 font-normal">
                        (Tùy chọn)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập url ảnh" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ảnh 3{' '}
                      <span className="text-xs text-gray-500 font-normal">
                        (Tùy chọn)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập url ảnh" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="- Chọn danh mục -" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map(({ name }, index) => (
                          <SelectItem key={index} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    Mô tả{' '}
                    <span className="text-gray-500 text-xs">(Tùy chọn)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Nhập mô tả sách"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-2 mt-4">
              <Button type="submit">
                {action === 'create' ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
