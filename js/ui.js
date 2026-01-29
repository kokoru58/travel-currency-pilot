/**
 * ui.js - UI 유틸리티 및 DOM 요소 관리
 * DOM 요소 참조 및 메시지 표시 함수
 */

// ===== DOM 요소 참조 =====
const fromAmountInput = document.getElementById('fromAmount');
const convertedAmountInput = document.getElementById('convertedAmount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const resultAmount = document.getElementById('resultAmount');
const resultLabel = document.getElementById('resultLabel');
const exchangeRateInfo = document.getElementById('exchangeRateInfo');
const errorMessage = document.getElementById('errorMessage');
const warningMessage = document.getElementById('warningMessage');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const homeCurrencySelect = document.getElementById('homeCurrency');
const locationNameEl = document.getElementById('locationName');
const localCurrencyEl = document.getElementById('localCurrency');
const updateLocationBtn = document.getElementById('updateLocationBtn');
const autoLocationBtn = document.getElementById('autoLocationBtn');
const saveTitleInput = document.getElementById('saveTitle');
const saveBtn = document.getElementById('saveBtn');

/**
 * 에러 메시지를 표시합니다
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  setTimeout(() => hideError(), 5000);
}

/**
 * 에러 메시지를 숨깁니다
 */
function hideError() {
  errorMessage.style.display = 'none';
}

/**
 * 경고 메시지를 표시합니다
 */
function showWarning(message) {
  warningMessage.textContent = message;
  warningMessage.style.display = 'block';
  setTimeout(() => hideWarning(), 4000);
}

/**
 * 경고 메시지를 숨깁니다
 */
function hideWarning() {
  warningMessage.style.display = 'none';
}
