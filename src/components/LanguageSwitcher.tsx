import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';
import flagEn from '@/assets/flag-uk.png';
import flagId from '@/assets/flag-id.png';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'id', label: 'Bahasa', flag: flagId },
    { code: 'en', label: 'English', flag: flagEn },
  ];
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          aria-label="Change language"
        >
          {currentLanguage?.flag ? (
            <img 
              src={currentLanguage.flag} 
              alt={`${currentLanguage.label} flag`}
              className="w-5 h-5 object-contain"
            />
          ) : (
            <Languages className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-primary/10' : ''}
          >
            <img 
              src={lang.flag} 
              alt={`${lang.label} flag`}
              className="w-4 h-4 mr-2 object-contain"
            />
            {lang.label}
            {language === lang.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

