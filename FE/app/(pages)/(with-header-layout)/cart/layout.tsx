import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
    title: 'Thanh toán',
    description: 'Thanh toán sản phẩm'
}

export default function CartLayout({ children }: { children: ReactNode }) {
    return children
}