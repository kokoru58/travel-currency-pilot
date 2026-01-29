/**
 * location.js - 위치 감지 및 처리
 * Geolocation API와 Nominatim API를 사용한 위치 기반 통화 설정
 */

/**
 * 현재 위치를 가져옵니다 (Geolocation API)
 */
function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      showWarning('이 브라우저는 위치 서비스를 지원하지 않습니다');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        showWarning('위치 권한이 거부되었습니다. 설정에서 위치 접근을 허용해주세요.');
        console.error('Geolocation error:', error);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
}

/**
 * 좌표로부터 국가 정보를 가져옵니다 (Nominatim API - OpenStreetMap)
 */
async function getCountryFromCoordinates(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      { headers: { 'Accept-Language': 'ko-KR' } }
    );

    if (!response.ok) {
      throw new Error('위치 정보 조회 실패');
    }

    const data = await response.json();
    const countryCode = data.address?.country_code?.toUpperCase();
    const countryName = data.address?.country;

    if (!countryCode || !countryName) {
      throw new Error('국가 정보를 찾을 수 없습니다');
    }

    const currency = countryToCurrency[countryCode] || null;

    return {
      countryCode,
      countryName,
      currency,
      coordinates: { latitude, longitude }
    };
  } catch (error) {
    showWarning(`위치 조회 실패: ${error.message}`);
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * 위치를 업데이트하고 현지 통화를 설정합니다
 */
async function updateLocation() {
  locationNameEl.innerHTML = '<span class="spinner"></span>위치 감지 중...';
  localCurrencyEl.textContent = '-';

  const coords = await getCurrentLocation();
  if (!coords) {
    locationNameEl.textContent = '위치 감지 실패';
    return;
  }

  const locationInfo = await getCountryFromCoordinates(coords.latitude, coords.longitude);
  if (!locationInfo) {
    locationNameEl.textContent = '위치 정보 조회 실패';
    return;
  }

  currentLocation = locationInfo;

  // UI 업데이트
  locationNameEl.textContent = locationInfo.countryName;

  if (locationInfo.currency) {
    localCurrencyEl.textContent = locationInfo.currency;
    // 현지 통화를 "현지 금액" (fromCurrency)으로 설정
    fromCurrencySelect.value = locationInfo.currency;
    // 내 국가 통화를 "내 국가 금액" (toCurrency)으로 설정
    toCurrencySelect.value = homeCurrencySelect.value;
    convertCurrency();
  } else {
    localCurrencyEl.textContent = '미지원';
    showWarning(`${locationInfo.countryName}의 통화가 지원되지 않습니다`);
  }
}

/**
 * 자동 위치 갱신을 토글합니다
 */
function toggleAutoLocation() {
  autoLocationEnabled = !autoLocationEnabled;
  autoLocationBtn.classList.toggle('active');

  if (autoLocationEnabled) {
    showWarning('자동 위치 갱신이 활성화되었습니다. 위치가 변경되면 자동으로 업데이트됩니다.');

    // watchPosition: 위치 변경 시 자동으로 콜백 실행
    if (navigator.geolocation) {
      locationWatchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 위치가 유의미하게 변경되었는지 확인 (100m 이상)
          if (currentLocation) {
            const distance = getDistance(
              currentLocation.coordinates.latitude,
              currentLocation.coordinates.longitude,
              latitude,
              longitude
            );
            if (distance < 0.1) return; // 100m 이하면 업데이트 안함
          }

          const locationInfo = await getCountryFromCoordinates(latitude, longitude);
          if (locationInfo && locationInfo.countryName !== currentLocation?.countryName) {
            currentLocation = locationInfo;
            locationNameEl.textContent = locationInfo.countryName;

            if (locationInfo.currency) {
              localCurrencyEl.textContent = locationInfo.currency;
              // 현지 통화를 "현지 금액" (fromCurrency)으로 설정
              fromCurrencySelect.value = locationInfo.currency;
              // 내 국가 통화를 "내 국가 금액" (toCurrency)으로 설정
              toCurrencySelect.value = homeCurrencySelect.value;
              convertCurrency();
            }
          }
        },
        (error) => {
          console.error('Watch error:', error);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
      );
    }
  } else {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId);
      locationWatchId = null;
    }
    showWarning('자동 위치 갱신이 비활성화되었습니다.');
  }
}

/**
 * 두 좌표 사이의 거리를 계산합니다 (km)
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
