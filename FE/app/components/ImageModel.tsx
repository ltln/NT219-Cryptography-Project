import React, { useState } from 'react';

interface ImageModalProps {
  onClose: () => void;
  onSubmit: (imageUrl: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ onClose, onSubmit }) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(imageUrl);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Chọn hình ảnh</h2>
        <input
          type="text"
          value={imageUrl}
          onChange={handleInputChange}
          placeholder="Nhập URL hình ảnh"
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md mr-4"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
