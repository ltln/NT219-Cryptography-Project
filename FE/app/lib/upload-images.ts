import axios from 'axios';

export default async function uploadImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    );

    const res = await axios.post<{ secure_url: string }>(
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL || '',
      formData,
    );
    return res.data.secure_url;
  } catch (error) {
    console.log(error);
  }
}
