import {
  ExclamationCircleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import Stars from './Stars';

export default function Review() {
  return (
    <div className="flex items-start lg:flex-row flex-col">
      <div className="lg:w-40 lg:block flex items-center">
        <div className="font-medium">Nguyễn Văn A</div>
        <div className="text-sm text-gray-500 lg:ml-0 ml-4">12/1/2024</div>
      </div>

      <div className="flex-1 lg:mt-0 mt-3">
        <Stars value={5} className="text-sm" />

        <p className="text-[0.9375rem] mt-2">
          Tác giả đưa ra những nguyên tắc rất hữu ích của quyền lực. Những cách
          này đọc tựa đề rất giống với những gì nhân vật gian hùng Tào Tháo
          trong Tam Quốc Diễn Nghĩa. Tác giả có cách viết rất dễ hiểu. Tóm kết
          bài học cụ thể ở cuối mỗi chương. Tác giả là người am hiểu sâu sắc
          lịch sử Đông Tây kim cổ. Sách được trình bày cuốn hút với rất nhiều
          mẩu chuyện lịch sử và ngụ ngôn được thu thập từ mọi lĩnh vực và mọi
          nền văn hóa.
        </p>

        <div className="flex items-center mt-3 space-x-3">
          <div className="flex items-center text-sm text-gray-500">
            <HandThumbUpIcon className="h-4 mr-1" />
            <span>Thích</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <ExclamationCircleIcon className="h-4 mr-1" />
            <span>Báo cáo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
