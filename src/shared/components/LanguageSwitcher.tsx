import { useLanguageSwitcher } from 'shared/hooks/useLanguage'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/components/shadcn/select'

export const LanguageSwitcher = () => {
    const { currentLanguage, changeLanguage } = useLanguageSwitcher();

  return (
    <Select
      value={currentLanguage}
      onValueChange={(value) => changeLanguage(value as 'en' | 'vi')}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chọn ngôn ngữ" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="vi">Tiếng Việt</SelectItem>
      </SelectContent>
    </Select>
  )
} 

