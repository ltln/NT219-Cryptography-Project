// SignIn.js

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/app/components/ui/Dialog';
import SignUp from './SignUp';
import { Button } from './ui/Button';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from './ui/Form';
import { Input } from './ui/Input';
import { randomQuotation } from '../lib/book-quotations';
import { useAuth } from '../lib/hooks/useAuth';

const formSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  mfa: z.boolean(),
  mfaCode: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.mfa && !data.mfaCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['mfaCode'],
      message: 'Vui lòng nhập mã xác thực nhiều yếu tố',
    });
  }
});

export default function SignIn({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isMFA, setIsMFA] = useState(false);
  const [emailPlaceholder, setEmailPlaceholder] = useState('jo******@example.com');
  const { login, mfaLogin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      mfa: false,
    },
  });

  async function onSubmit({ username, password, mfaCode }: z.infer<typeof formSchema>) {
    if (isMFA && mfaCode) {
      try {
        setIsSigningIn(true);
        await mfaLogin(username, password, mfaCode);
        toast.success('Đăng nhập thành công');
      } catch (error: any) {
        const data = error.response?.data;
        if (data.message && data.message.includes('Invalid email OTP code')) {
          toast.error('Mã xác thực không hợp lệ. Vui lòng thử lại.');
        } else {
          toast.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
        }
      } finally {
        setIsSigningIn(false);
      }
      return;
    }

    try {
      setIsSigningIn(true);
      await login(username, password);
      toast.success('Đăng nhập thành công');
    } catch (error: any) {
      const data = error.response?.data;
      console.log(error.response.data);
      if (data.mfa) {
        form.setValue('mfa', true);
        setIsMFA(true);
        setEmailPlaceholder(data.email);
        return;
      }
      toast.error('Đăng nhập thất bại. Vui lòng thử lại sau');
    } finally {
      setIsSigningIn(false);
    }
  }

  const bookQuote = randomQuotation();

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent 
        className="grid grid-cols-1 md:grid-cols-[repeat(13,minmax(0,1fr))] gap-0 max-w-[calc(100vw-2rem)] md:max-w-3xl p-0 border-none overflow-hidden"
        onInteractOutside={(e) => {
          if (isMFA) e.preventDefault();
        }}
      >
        <div className="md:col-span-7 p-5">
          <h2 className="text-2xl text-primary-700 font-bold">Đăng nhập</h2>
          <h3 className="mt-4 mb-6">Đăng nhập để bắt đầu mua sắm sách nhé!</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>

                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập tên đăng nhập của bạn"
                        readOnly={isMFA}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu của bạn"
                        readOnly={isMFA}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.getValues("mfa") === true && <hr />}
              <FormField
                control={form.control}
                name="mfaCode"
                render={({ field }) => (
                  <FormItem className={form.getValues('mfa') === true ? 'block' : 'hidden'}>
                    <FormLabel className="flex flex-col gap-2 mb-2">
                      <p>Xác thực nhiều yếu tố</p>
                      <p className="text-sm text-gray-500">Một mã xác thực đã được gửi đến {emailPlaceholder}. Mã sẽ hết hạn trong 3 phút.</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập mã xác thực của bạn"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !mt-8" disabled={isSigningIn}>
                <span>{isSigningIn ? 'Đang Đăng Nhập...' : 'Đăng nhập'}</span>
                <ChevronRightIcon className="h-4 ml-3" />
              </Button>
            </form>
          </Form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="mx-2 text-sm text-gray-500">
              Chưa có tài khoản
            </span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          <SignUp>
            <Button className="w-full" variant="outline" disabled={isMFA}>
              <span>Đăng kí</span>
              <ChevronRightIcon className="h-4 ml-3" />
            </Button>
          </SignUp>
        </div>

        <div className="col-span-6 bg-donkey-brown-400 hidden items-center justify-center flex-col p-5 md:flex">
          <Image
            alt="books"
            src="/books.png"
            width={200}
            height={200}
            className="w-48 h-auto"
          />

          <div className="mt-4 text-white">
            <blockquote className="italic text-center">
              “{bookQuote.quote}”
            </blockquote>
            <div className="text-right">– {bookQuote.author}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
