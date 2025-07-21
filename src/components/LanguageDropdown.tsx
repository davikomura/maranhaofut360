import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  flagSrc: string;
}

const languages: Language[] = [
    { code: 'PT', flagSrc: '/flags/br.png' },
    { code: 'EN', flagSrc: '/flags/us.png' },
    // { code: 'ES', flagSrc: '/flags/es.png' },
    // { code: 'FR', flagSrc: '/flags/fr.png' },
    // { code: 'DE', flagSrc: '/flags/de.png' }
];

export const LanguageDropdown = () => {

  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang.code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-md p-2 hover:bg-gray-700 transition"
        aria-label="Select language"
      >
        <img
          src={currentLang.flagSrc}
          className="w-5 h-5 rounded-sm"
        />
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-14 bg-black border border-gray-700 shadow-xl rounded-md overflow-hidden z-50">
          {languages.map(lang => (
            <li key={lang.code}>
              <button
                onClick={() => handleLanguageChange(lang)}
                className="w-full flex items-center justify-center px-2 py-2 hover:bg-gray-700 transition"
              >
                <img
                  src={lang.flagSrc}
                  className="w-5 h-5 rounded-sm"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
