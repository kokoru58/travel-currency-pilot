/**
 * config.js - 상수 및 전역 설정
 * 국가 코드 매핑, 환율 캐시 설정, 전역 상태 변수
 */

// ===== 국가 코드 → 통화 매핑 =====
const countryToCurrency = {
  'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD', 'NZ': 'NZD',
  'KR': 'KRW', 'JP': 'JPY', 'CN': 'CNY', 'HK': 'HKD', 'SG': 'SGD',
  'IN': 'INR', 'TH': 'THB', 'VN': 'VND', 'MY': 'MYR', 'ID': 'IDR',
  'PH': 'PHP', 'TR': 'TRY', 'BR': 'BRL', 'MX': 'MXN', 'AR': 'ARS',
  'RU': 'RUB', 'ZA': 'ZAR', 'EG': 'EGP', 'SA': 'SAR', 'AE': 'AED',
  'IL': 'ILS', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'FI': 'EUR',
  'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'AT': 'EUR',
  'BE': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'GR': 'EUR', 'IE': 'EUR',
  'IT': 'EUR', 'NL': 'EUR', 'PT': 'EUR', 'ES': 'EUR', 'CH': 'CHF'
};

// ===== 환율 캐싱 설정 =====
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

// ===== 환율 데이터 캐싱 =====
let exchangeRates = null;
let lastFetchTime = null;

// ===== 위치 관련 변수 =====
let currentLocation = null;
let autoLocationEnabled = false;
let locationWatchId = null;

// ===== 현재 환율 정보 (저장용) =====
let currentConversion = null;
