import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { Metadata } from "next";
import Header from "./components/Header";

export const metadata: Metadata = {
    title: 'Không tìm thấy',
    description: 'Không thể tìm thấy trang bạn yêu cầu.',
};
  
export default function NotFound() {
    return (
        <>
        <Header />
        <div className="container mt-28 mb-16">
            <div className="container h-[500px] max-w-[1000px] gap-4 flex items-center justify-center max-lg:flex-col max-lg:pt-32">
                <div className="text-right max-lg:text-center">
                    <p className="text-2xl font-bold text-ferra-700 mb-4">Không tìm thấy 🔎</p>
                    <p className="mb-1">Không thể tìm thấy trang bạn yêu cầu.</p>
                    <p className="mb-4 text-gray-500">Hãy kiểm tra lại xem bạn đã gõ đúng đường dẫn hay chưa, hoặc đường dẫn bị xoá thật rồi ¯\_(ツ)_/¯</p>
                    <Button>
                        <Link href="/">
                        Trang chủ
                        </Link>
                    </Button>
                    <p className="text-xs text-gray-500 italic mt-4">Status: 404 - Not Found</p>
                </div>
                <Image alt="" src="/book2.png" height={400} width={400} className="max-lg:" />
            </div>
        </div>
        </>
    )
}