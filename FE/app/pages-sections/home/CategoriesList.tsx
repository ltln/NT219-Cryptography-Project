import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/Carousel';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import categories from '@/app/data/categories.json';

function CategoryItem({ image, name }: (typeof categories)[0]) {
  return (
    <div className="select-none">
      <div className="aspect-w-2 aspect-h-1">
        <Image
          alt={name}
          src={image}
          width={200}
          height={200}
          className="w-full object-contain"
        />
      </div>

      <h3 className="text-center mt-2">{name}</h3>
    </div>
  );
}

export default function CategoriesList() {
  return (
    <section className="bg-white rounded-[0.625rem] p-4 pb-6">
      <h2 className="flex items-center text-primary-700">
        <Squares2X2Icon className="h-7 mr-3" />
        <span className="text-lg font-semibold">Danh mục</span>
      </h2>

      <Carousel className="mt-6">
        <CarouselContent className="-mx-2">
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="lg:basis-[10%] md:basis-[20%] basis-[25%] px-2"
            >
              <CategoryItem {...category} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
