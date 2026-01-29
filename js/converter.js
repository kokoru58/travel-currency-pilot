/**
 * converter.js - 통화 변환 로직
 * 환율 계산, 금액 포맷팅, 통화 변환 및 교환
 */

/**
 * 두 통화 간의 교차 환율을 계산합니다
 */
function calculateExchangeRate(fromCurrency, toCurrency, rates) {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return null;
  }

  const rate = rates[toCurrency] / rates[fromCurrency];
  return rate;
}

/**
 * 입력된 금액을 포맷팅합니다 (콤마 추가)
 */
function formatAmount(value) {
  // 콤마와 공백 제거
  let cleaned = value.replace(/[,\s]/g, '');

  // 숫자와 마지막 소수점만 남기기
  let parts = cleaned.split('.');
  parts[0] = parts[0].replace(/\D/g, '') || '0'; // 첫 부분은 숫자만

  if (parts.length > 2) {
    parts = [parts[0], parts[1] + parts.slice(2).join('')];
  }

  cleaned = parts.join('.');

  if (cleaned === '' || cleaned === '.') return '';

  // 콤마 추가
  const parsed = parseFloat(cleaned);
  return parsed.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10
  });
}

/**
 * 금액을 다른 통화로 변환합니다
 */
async function convertCurrency() {
  // 입력값에서 콤마 제거하여 순수 숫자로 변환
  const rawValue = fromAmountInput.value.replace(/,/g, '');
  const amount = parseFloat(rawValue);
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  if (isNaN(amount) || amount < 0) {
    resultAmount.textContent = '0';
    convertedAmountInput.value = '';
    return;
  }

  const rates = await fetchExchangeRates();
  if (!rates) {
    resultAmount.textContent = '오류';
    convertedAmountInput.value = '';
    return;
  }

  const exchangeRate = calculateExchangeRate(fromCurrency, toCurrency, rates);
  if (exchangeRate === null) {
    showError('지원하지 않는 통화입니다');
    return;
  }

  const convertedAmount = amount * exchangeRate;

  // 입력 필드에 결과 표시
  convertedAmountInput.value = convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // 큰 결과창 업데이트 (선택사항)
  resultAmount.textContent = convertedAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  updateExchangeRateInfo(fromCurrency, toCurrency, exchangeRate);
  resultLabel.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;

  // 현재 환율 정보 저장 (저장 버튼 클릭 시 사용)
  currentConversion = {
    amount: amount,
    fromCurrency: fromCurrency,
    convertedAmount: convertedAmount,
    toCurrency: toCurrency,
    rate: exchangeRate,
    timestamp: new Date()
  };
}

/**
 * 환율 정보를 화면에 표시합니다
 */
function updateExchangeRateInfo(fromCurrency, toCurrency, rate) {
  const inverseRate = (1 / rate).toFixed(6);
  exchangeRateInfo.innerHTML = `
    <div style="margin-bottom: 8px;">1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}</div>
    <div>1 ${toCurrency} = ${inverseRate} ${fromCurrency}</div>
  `;
}

/**
 * 출발 통화와 도착 통화를 교환합니다
 */
function swapCurrencies() {
  const temp = fromCurrencySelect.value;
  fromCurrencySelect.value = toCurrencySelect.value;
  toCurrencySelect.value = temp;

  convertCurrency();
}
