import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Đổi mật khẩu",
  description: "Đổi mật khẩu tài khoản"
}

export default function ChangePassword() {
  return (
    <main className="bg-white rounded-[0.625rem] p-4 pb-8">
      <h2 className="mb-4 text-lg font-semibold text-primary-700">
        Đổi mật khẩu
      </h2>

      <div className="flex justify-center">
        <table>
          <tbody>
            <tr className="md:table-row flex flex-col items-start">
              <td className="md:pr-16 text-right md:py-6 pt-4 pb-1 whitespace-nowrap font-semibold">
                Mật khẩu cũ:
              </td>
              <td className="w-full">
                <Input placeholder="Nhập mật khẩu cũ" className="w-96" />
              </td>
            </tr>
            <tr className="md:table-row flex flex-col items-start">
              <td className="md:pr-16 text-right md:py-6 pt-4 pb-1 whitespace-nowrap font-semibold">
                Mật khẩu mới:
              </td>
              <td className="w-full">
                <Input placeholder="Nhập mật khẩu mới" className="w-96" />
              </td>
            </tr>
            <tr className="md:table-row flex flex-col items-start">
              <td></td>
              <td className="text-right pt-6 w-full">
                <Button>Lưu thay đổi</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
