// SignUp.js

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Image from 'next/image';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogTrigger } from './ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/Form';
import { Input } from './ui/Input';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { IUser } from '../models/user';
import { randomQuotation } from '../lib/book-quotations';
import httpClient from '../lib/httpClient';

const formSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Vui lòng nhập mật khẩu tối thiểu 8 ký tự')
    .max(64, 'Mật khẩu không được quá 64 ký tự'),
  confirmPassword: z
    .string()
    .min(8, 'Vui lòng nhập mật khẩu tối thiểu 8 ký tự')
    .max(64, 'Mật khẩu không được quá 64 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

export default function SignUp({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false); // Track sign-up loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
  });

  async function onSubmit({
    fullName,
    email,
    username,
    password,
    confirmPassword,
  }: z.infer<typeof formSchema>) {
    try {
      setIsSigningUp(true); // Set loading state to true during sign-up
      const res = await httpClient.post<{ success: boolean }>('/auth/signup', { fullName, email, username, password, confirmPassword });
      if (res.success) {
        toast.success('Đăng ký thành công');
        setOpen(false);
      }
    } catch {
      toast.error('Đăng ký thất bại. Vui lòng thử lại sau');
    } finally {
      setIsSigningUp(false);
    }
  }

  const bookQuote = randomQuotation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="grid grid-cols-1 md:grid-cols-[repeat(13,minmax(0,1fr))] gap-0 max-w-[calc(100vw-2rem)] md:max-w-3xl p-0 border-none overflow-hidden">
        <div className="md:col-span-7 p-5">
          <h2 className="text-2xl text-primary-700 font-bold">Đăng ký</h2>
          <h3 className="mt-4 mb-6">Đăng ký để bắt đầu mua sắm sách nhé!</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên đăng nhập của bạn" {...field} />
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
                        placeholder="Nhập email của bạn"
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !mt-8" disabled={isSigningUp}>
                <span>{isSigningUp ? 'Đang Đăng Ký...' : 'Đăng ký'}</span>
                <ChevronRightIcon className="h-4 ml-3" />
              </Button>
            </form>
          </Form>
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
  );
}
