/**
 * api.js - 환율 API 함수
 * ExchangeRate-API에서 환율 데이터를 가져오고 캐싱
 */

/**
 * ExchangeRate-API에서 환율 데이터를 가져옵니다
 */
async function fetchExchangeRates() {
  try {
    // 캐시 확인
    if (exchangeRates && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      return exchangeRates;
    }

    const response = await fetch('https://open.er-api.com/v6/latest/USD');

    if (!response.ok) {
      throw new Error('환율 데이터를 가져올 수 없습니다');
    }

    const data = await response.json();

    if (data.result !== 'success') {
      throw new Error('API 응답 오류');
    }

    exchangeRates = data.rates;
    lastFetchTime = Date.now();
    hideError();

    return exchangeRates;
  } catch (error) {
    showError(`환율 조회 실패: ${error.message}`);
    console.error('API Error:', error);
    return null;
  }
}
