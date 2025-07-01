'use client'
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import {useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/Avatar';
import React from 'react';
import { Separator } from '@/app/components/ui/Separator';
import ImageModal from '@/app/components/ImageModel';
import { useAuth } from '@/app/lib/hooks/useAuth';

interface IUser {
  name: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  imageUrl:string;
  country:string;
  city:string;
  specificLocal:string;
}

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  // const [formData, setFormData] = useState<IUser>({
  //   name: '',
  //   fullname: '',
  //   email: '',
  //   phoneNumber: '',
  //   imageUrl: '',
  //   country: '',
  //   city: '',
  //   specificLocal: '',
  // });
  const { user } = useAuth();

  // useEffect(() => {
  //   if (email) {
  //     fetch(`/api/profile/${email}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setUser(data.user);
  //         setFormData(data.user); // Populate formData with user data
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         setError(error.message);
  //         setLoading(false);
  //       });
  //   }
  // }, [email]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleImageSelect = (imageUrl: string) => setSelectedImageUrl(imageUrl);

  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <main className="bg-white rounded-[0.62rem] p-4 pb-8">
      <h2 className="mb-4 text-lg font-semibold text-primary-700">Hồ sơ</h2>

      <div className="grid xl:grid-cols-12 grid-cols-1 gap-4">
        <div className="xl:col-span-8 xl:order-1 order-3 ">
          <table className="w-full">
            <tbody>
              <tr className="md:table-row flex flex-col items-start">
                <td className="font-medium md:py-5 md:my-0 mb-1 mt-4 text-right whitespace-nowrap lg:pr-12 md:pr-8 pr-3 lg:w-48">
                  Họ và tên:
                </td>
                <td className="w-full">
                  <Input
                    className="w-full"
                    placeholder="Nhập tên của bạn"
                    defaultValue={user.fullName}
                  />
                </td>
              </tr>
              <tr className="md:table-row flex flex-col items-start">
                <td className="font-medium md:py-5 md:my-0 mb-1 mt-4 text-right whitespace-nowrap lg:pr-12 md:pr-8 pr-3 lg:w-48">
                  Tên đăng nhập
                </td>
                <td className="w-full">
                  <Input
                    className="w-full"
                    placeholder="Nhập tên của bạn"
                    defaultValue={user.username}
                    disabled
                  />
                </td>
              </tr>
              <tr className="md:table-row flex flex-col items-start">
                <td className="font-medium md:py-5 md:my-0 mb-1 mt-4 text-right whitespace-nowrap lg:pr-12 md:pr-8 pr-3 lg:w-48">
                  Số điện thoại:
                </td>
                <td className="w-full">
                  <Input
                    className="w-full"
                    placeholder="Nhập số điện thoại của bạn"
                    defaultValue={'#'}
                    disabled
                  />
                </td>
              </tr>
              <tr className="md:table-row flex flex-col items-start">
                <td className="font-medium md:py-5 md:my-0 mb-1 mt-4 text-right whitespace-nowrap lg:pr-12 md:pr-8 pr-3 lg:w-48">
                  Email:
                </td>
                <td className="w-full">
                  <Input
                    className="w-full"
                    placeholder="Nhập số điện thoại của bạn"
                    defaultValue={user.email}
                    disabled
                  />
                </td>
              </tr>
              <tr className="md:table-row flex flex-col items-start">
                <td className="font-medium md:py-5 md:my-0 mb-1 mt-4 text-right whitespace-nowrap lg:pr-12 md:pr-8 pr-3 lg:w-48 align-top">
                  Địa chỉ:
                </td>
                <td className="w-full">
                  <Input className="w-full" placeholder="Địa chỉ cụ thể" defaultValue={'Đại Học Công Nghệ Thông Tin UIT'} />
                </td>
              </tr>

              <tr className="md:table-row flex flex-col items-start">
                <td></td>
                <td className="text-right w-full pt-8">
                  <Button>Lưu thay đổi</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Separator className="xl:hidden order-2" />

        <div className="xl:col-span-4 xl:order-2 order-1 flex flex-col items-center">
          <Avatar className="w-36 h-36">
            <AvatarImage src={selectedImageUrl || 'https://github.com/shadcn.png'} />
            <AvatarFallback>VA</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" className="mt-8" onClick={handleOpenModal}>
            Chọn hình ảnh
          </Button>
        </div>

        {showModal && (
          <ImageModal onClose={handleCloseModal} onSubmit={handleImageSelect} />
        )}
      </div>
    </main>
  );
}
