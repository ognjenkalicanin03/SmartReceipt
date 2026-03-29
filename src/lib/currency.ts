export interface CountryInfo {
  name: string;
  currency: string;
  symbol: string;
  locale: string;
}

export const COUNTRIES: CountryInfo[] = [
  { name: "Serbia", currency: "RSD", symbol: "RSD", locale: "sr-RS" },
  { name: "Germany", currency: "EUR", symbol: "€", locale: "de-DE" },
  { name: "France", currency: "EUR", symbol: "€", locale: "fr-FR" },
  { name: "Italy", currency: "EUR", symbol: "€", locale: "it-IT" },
  { name: "Spain", currency: "EUR", symbol: "€", locale: "es-ES" },
  { name: "Netherlands", currency: "EUR", symbol: "€", locale: "nl-NL" },
  { name: "Austria", currency: "EUR", symbol: "€", locale: "de-AT" },
  { name: "Belgium", currency: "EUR", symbol: "€", locale: "nl-BE" },
  { name: "Portugal", currency: "EUR", symbol: "€", locale: "pt-PT" },
  { name: "Greece", currency: "EUR", symbol: "€", locale: "el-GR" },
  { name: "Ireland", currency: "EUR", symbol: "€", locale: "en-IE" },
  { name: "Finland", currency: "EUR", symbol: "€", locale: "fi-FI" },
  { name: "United States", currency: "USD", symbol: "$", locale: "en-US" },
  { name: "United Kingdom", currency: "GBP", symbol: "£", locale: "en-GB" },
  { name: "Canada", currency: "CAD", symbol: "C$", locale: "en-CA" },
  { name: "Australia", currency: "AUD", symbol: "A$", locale: "en-AU" },
  { name: "Japan", currency: "JPY", symbol: "¥", locale: "ja-JP" },
  { name: "Switzerland", currency: "CHF", symbol: "CHF", locale: "de-CH" },
  { name: "Sweden", currency: "SEK", symbol: "kr", locale: "sv-SE" },
  { name: "Norway", currency: "NOK", symbol: "kr", locale: "nb-NO" },
  { name: "Denmark", currency: "DKK", symbol: "kr", locale: "da-DK" },
  { name: "Poland", currency: "PLN", symbol: "zł", locale: "pl-PL" },
  { name: "Czech Republic", currency: "CZK", symbol: "Kč", locale: "cs-CZ" },
  { name: "Hungary", currency: "HUF", symbol: "Ft", locale: "hu-HU" },
  { name: "Romania", currency: "RON", symbol: "lei", locale: "ro-RO" },
  { name: "Bulgaria", currency: "BGN", symbol: "лв", locale: "bg-BG" },
  { name: "Croatia", currency: "EUR", symbol: "€", locale: "hr-HR" },
  { name: "Turkey", currency: "TRY", symbol: "₺", locale: "tr-TR" },
  { name: "India", currency: "INR", symbol: "₹", locale: "en-IN" },
  { name: "Brazil", currency: "BRL", symbol: "R$", locale: "pt-BR" },
  { name: "Mexico", currency: "MXN", symbol: "MX$", locale: "es-MX" },
  { name: "South Korea", currency: "KRW", symbol: "₩", locale: "ko-KR" },
  { name: "China", currency: "CNY", symbol: "¥", locale: "zh-CN" },
  { name: "Bosnia and Herzegovina", currency: "BAM", symbol: "KM", locale: "bs-BA" },
  { name: "Montenegro", currency: "EUR", symbol: "€", locale: "sr-ME" },
  { name: "North Macedonia", currency: "MKD", symbol: "ден", locale: "mk-MK" },
  { name: "Albania", currency: "ALL", symbol: "L", locale: "sq-AL" },
];

export function getCurrencyForCountry(country: string): string {
  return COUNTRIES.find((c) => c.name === country)?.currency ?? "RSD";
}

export function getCountryInfo(country: string): CountryInfo {
  return COUNTRIES.find((c) => c.name === country) ?? COUNTRIES[0];
}

export function formatAmount(amount: number, currency: string): string {
  const info = COUNTRIES.find((c) => c.currency === currency);
  const symbol = info?.symbol ?? currency;

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
  });

  // Currencies where symbol goes before the number
  const prefixCurrencies = ["USD", "GBP", "CAD", "AUD", "BRL", "MXN"];
  if (prefixCurrencies.includes(currency)) {
    return `${symbol}${formatted}`;
  }

  return `${formatted} ${symbol}`;
}
