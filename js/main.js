/**
 * main.js - 초기화 및 이벤트 리스너
 * 모든 이벤트 리스너 등록, window.load 초기화, window.beforeunload 정리
 */

// ===== 이벤트 리스너 등록 =====

fromAmountInput.addEventListener('input', (e) => {
  // 입력값 포맷팅 (콤마 추가)
  const formatted = formatAmount(e.target.value);
  if (formatted !== '' && e.target.value !== formatted) {
    e.target.value = formatted;
  }
  convertCurrency();
});

// 붙여넣기 시에도 포맷팅 적용
fromAmountInput.addEventListener('paste', (e) => {
  setTimeout(() => {
    const formatted = formatAmount(fromAmountInput.value);
    if (formatted !== '') {
      fromAmountInput.value = formatted;
      convertCurrency();
    }
  }, 0);
});

fromCurrencySelect.addEventListener('change', convertCurrency);
toCurrencySelect.addEventListener('change', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);
clearHistoryBtn.addEventListener('click', clearHistory);

homeCurrencySelect.addEventListener('change', () => {
  localStorage.setItem('homeCurrency', homeCurrencySelect.value);

  // 기본 통화 변경 시 toCurrency(내 국가 금액)를 새로운 기본 통화로 변경
  toCurrencySelect.value = homeCurrencySelect.value;

  // fromCurrency(현지 금액)는 현재 위치의 통화로 유지
  // (이미 설정되어 있으므로 그대로 유지)

  convertCurrency();
});

updateLocationBtn.addEventListener('click', updateLocation);
autoLocationBtn.addEventListener('click', toggleAutoLocation);

saveBtn.addEventListener('click', () => {
  const title = saveTitleInput.value.trim();
  if (!title) {
    showWarning('제목을 입력해주세요');
    return;
  }
  saveConversion(title);
});

saveTitleInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveBtn.click();
  }
});

// ===== 페이지 로드 시 초기화 =====
window.addEventListener('load', async () => {
  // localStorage에서 기본 통화 복원
  const savedHomeCurrency = localStorage.getItem('homeCurrency');
  if (savedHomeCurrency) {
    homeCurrencySelect.value = savedHomeCurrency;
    toCurrencySelect.value = savedHomeCurrency;
  }

  // 초기 금액 포맷팅
  fromAmountInput.value = formatAmount(fromAmountInput.value);

  renderHistory();
  updateLocation(); // 초기 위치 감지 (fromCurrency를 현지 통화로 설정)
  convertCurrency();
  saveTitleInput.placeholder = `예) 런던 쇼핑, 도쿄 식당 등...`;
});

// ===== 언로드 시 정리 =====
window.addEventListener('beforeunload', () => {
  if (locationWatchId !== null) {
    navigator.geolocation.clearWatch(locationWatchId);
  }
});
