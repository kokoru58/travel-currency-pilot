/**
 * history.js - 변환 내역 관리
 * localStorage를 사용한 히스토리 저장, 표시, 초기화
 */

/**
 * 변환 내역을 localStorage에 저장합니다 (저장 버튼 클릭 시만 호출)
 */
function saveConversion(title) {
  if (!currentConversion) {
    showWarning('저장할 환율 정보가 없습니다');
    return;
  }

  let history = JSON.parse(localStorage.getItem('currencyHistory')) || [];

  const conversion = {
    title: title || `${currentConversion.fromCurrency} → ${currentConversion.toCurrency}`,
    timestamp: currentConversion.timestamp.toLocaleTimeString('ko-KR'),
    amount: currentConversion.amount,
    fromCurrency: currentConversion.fromCurrency,
    convertedAmount: currentConversion.convertedAmount,
    toCurrency: currentConversion.toCurrency,
    rate: currentConversion.rate.toFixed(6)
  };

  history.unshift(conversion);

  if (history.length > 20) {
    history = history.slice(0, 20);
  }

  localStorage.setItem('currencyHistory', JSON.stringify(history));
  renderHistory();
  saveTitleInput.value = '';
  showWarning('✅ 환율이 저장되었습니다');
}

/**
 * 히스토리를 화면에 표시합니다
 */
function renderHistory() {
  const history = JSON.parse(localStorage.getItem('currencyHistory')) || [];

  if (history.length === 0) {
    historyList.innerHTML = '<div class="empty-history">저장된 환율이 없습니다</div>';
    clearHistoryBtn.style.display = 'none';
    return;
  }

  clearHistoryBtn.style.display = 'block';

  historyList.innerHTML = history.map((item) => {
    // 숫자에 콤마 추가 (1000단위)
    const amountFormatted = parseFloat(item.amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    const convertedFormatted = parseFloat(item.convertedAmount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const rateValue = parseFloat(item.rate).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });

    return `
      <div class="history-item">
        <div style="width: 100%;">
          <div class="history-conversion" style="font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px;">📌 ${item.title}</div>
          <div style="color: #666; font-size: 12px; margin-bottom: 4px;">${amountFormatted} ${item.fromCurrency} → ${convertedFormatted} ${item.toCurrency}</div>
          <div class="history-timestamp">⏰ ${item.timestamp}</div>
          <div class="history-rate">📊 환율: 1 ${item.fromCurrency} = ${rateValue} ${item.toCurrency}</div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 히스토리를 초기화합니다
 */
function clearHistory() {
  if (confirm('모든 변환 내역을 삭제하시겠습니까?')) {
    localStorage.removeItem('currencyHistory');
    renderHistory();
  }
}
