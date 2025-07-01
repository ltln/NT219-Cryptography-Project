import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative md:left-0 left-[calc(-50vw+50%)] w-screen md:w-full">
      <Image
        alt="banner"
        src="/banner.jpg"
        width={1920}
        height={505}
        className="w-full md:rounded-[0.625rem] h-auto"
      />
    </div>
  );
}
