import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/Accordion';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/Select';
import { MinusIcon } from '@heroicons/react/24/outline';
import categories from '@/app/data/categories.json';

export default function Sidebar() {
  return (
    <aside className="bg-white rounded-[0.625rem] p-4 pb-6 sticky top-20">
      <Accordion type="single" collapsible defaultValue={'item-1'}>
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-lg font-semibold text-primary-700 p-0 !no-underline">
            Bộ lọc tìm kiếm
          </AccordionTrigger>

          <AccordionContent className="space-y-4 mt-4 text-base">
            <div className="grid gap-1.5">
              <Label>Danh mục</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(({ name }, index) => (
                    <SelectItem key={index} value={`${index}`}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Ngôn ngữ</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  {['Tất cả', 'Tiếng Việt', 'Tiếng Anh', 'Tiếng Trung'].map(
                    (name, index) => (
                      <SelectItem key={index} value={`${index}`}>
                        {name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Mức giá</Label>
              <div className="flex space-x-2">
                <Input placeholder="Từ" variant="secondary" />
                <MinusIcon className="w-8" />
                <Input placeholder="Đến" variant="secondary" />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Hình thức bìa</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hình thức bìa" />
                </SelectTrigger>
                <SelectContent>
                  {['Tất cả', 'Bìa cứng', 'Bìa mềm'].map((name, index) => (
                    <SelectItem key={index} value={`${index}`}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
