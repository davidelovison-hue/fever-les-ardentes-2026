export type PhoneCountry = {
  value: string
  flag: string
  name: string
  nameAlt?: string
  placeholder: string
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { value: '+34', flag: '🇪🇸', name: 'Spain', placeholder: '612 345 678' },
  { value: '+44', flag: '🇬🇧', name: 'United Kingdom', placeholder: '7700 900123' },
  { value: '+1', flag: '🇺🇸', name: 'United States', placeholder: '(201) 555-0123' },
  { value: '+380', flag: '🇺🇦', name: 'Ukraine', placeholder: '50 123 4567' },
  {
    value: '+971',
    flag: '🇦🇪',
    name: 'United Arab Emirates',
    nameAlt: 'الإمارات العربية المتحدة',
    placeholder: '50 123 4567',
  },
  { value: '+33', flag: '🇫🇷', name: 'France', placeholder: '6 12 34 56 78' },
  { value: '+39', flag: '🇮🇹', name: 'Italy', placeholder: '312 345 6789' },
  { value: '+49', flag: '🇩🇪', name: 'Germany', placeholder: '1512 3456789' },
  { value: '+31', flag: '🇳🇱', name: 'Netherlands', placeholder: '6 12345678' },
  { value: '+351', flag: '🇵🇹', name: 'Portugal', placeholder: '912 345 678' },
  { value: '+41', flag: '🇨🇭', name: 'Switzerland', placeholder: '78 123 45 67' },
]

export function phoneCountryByCode(code: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.value === code) ?? PHONE_COUNTRIES[0]
}
