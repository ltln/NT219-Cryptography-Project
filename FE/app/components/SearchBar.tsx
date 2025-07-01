'use client';
import categories from '@/app/data/categories.json';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useState } from 'react';
import { Button, buttonVariants } from './ui/Button';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/Drawer';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

export default function SearchBar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const handleSearch: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    if (searchQuery.trim().length === 0) {
      console.log('Please type a book name');
      return;
    }
    router.push(`/search?q=${searchQuery}`);
    setOpenDrawer(false);
  };

  return (
    <div className="flex gap-4 max-lg:w-2/3 lg:w-2/5">
      <Popover>
        <PopoverTrigger className="cursor-pointer flex items-center text-gray-500">
          <SquaresPlusIcon className="h-7" />
          <ChevronDownIcon className="h-4 ml-1.5" />
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={24} className="md:w-[36rem]">
          <h3 className="font-semibold text-lg mb-4 text-primary-700">
            Danh mục sách
          </h3>

          <ul className="grid md:grid-cols-2 gap-4">
            {categories.map(({ name }, index) => (
              <li key={index}>
                <Link
                  href={''}
                  className="flex items-center transition-all hover:text-primary-700 hover:font-semibold"
                >
                  <ChevronRightIcon className="h-5 mr-2" />
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-end mt-6">
            <Link href={''} className={buttonVariants({ variant: 'outline' })}>
              <span>Xem tất cả</span>
              <ArrowRightIcon className="h-4 ml-2" />
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center h-11 border-[1.5px] border-gray-400 max-lg:border-none p-1.5 rounded-xl w-full">
        <input
          placeholder="Tìm kiếm sách..."
          className="max-lg:hidden border-none bg-transparent outline-none flex-1 px-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button size="xs" className="px-5 max-lg:hidden" onClick={handleSearch}>
          <MagnifyingGlassIcon className="h-4" />
        </Button>

        <div className="lg:hidden">
          <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerTrigger asChild>
              <Button size="xs" className="px-5">
                <MagnifyingGlassIcon className="h-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="px-4 py-2 w-full">
                <div className="flex items-center h-11 border-[1.5px] border-gray-400 p-1.5 rounded-xl w-full mb-4">
                  <input
                    placeholder="Tìm kiếm sách..."
                    className="lg:hidden bg-transparent outline-none flex-1 px-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  size="xs"
                  className="mb-2 w-full h-10"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
