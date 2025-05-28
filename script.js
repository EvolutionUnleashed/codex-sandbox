// script.js (Luxon-based)
(function () {
  const { DateTime } = luxon;

  const yourTimeInput = document.getElementById('yourTime');
  const theirLocationInput = document.getElementById('theirLocation');
  const directionSelect = document.getElementById('direction');
  const toggleButton = document.getElementById('toggleDirection');
  const zonesList = document.getElementById('zones');
  const yourTimeDisplay = document.getElementById('yourTimeDisplay');
  const theirTimeDisplay = document.getElementById('theirTimeDisplay');
  const clockEls = document.querySelectorAll('.clock');
  const clockZoneInputs = document.querySelectorAll('.clock-zone');
  const editButton = document.getElementById('editClocks');

  const leftLabel = document.getElementById('leftLabel');
  const rightLabel = document.getElementById('rightLabel');
  const timeLabelText = document.getElementById('timeLabelText');

  const timeZones = (Intl.supportedValuesOf && Intl.supportedValuesOf('timeZone')) || [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Australia/Brisbane'
  ];

  timeZones.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz;
    zonesList.appendChild(option);
  });

  // Load clock preferences from cookie
  function loadClockPrefs() {
    const match = document.cookie.match(/clockZones=([^;]+)/);
    if (match) {
      return decodeURIComponent(match[1]).split('|');
    }
    return null;
  }

  function saveClockPrefs(zones) {
    document.cookie = `clockZones=${encodeURIComponent(zones.join('|'))}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  // Default your time input to now (rounded to minute)
  const now = DateTime.local().startOf('minute');
  yourTimeInput.value = now.toISO({ suppressSeconds: true, includeOffset: false });
  theirLocationInput.value = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Apply saved clock zones
  const savedZones = loadClockPrefs();
  if (savedZones && savedZones.length === clockEls.length) {
    clockEls.forEach((el, idx) => {
      el.dataset.tz = savedZones[idx];
      el.querySelector('h3').textContent = savedZones[idx];
    });
  }

  function updateResult() {
    const yourZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const theirZone = theirLocationInput.value || 'UTC';
    const direction = directionSelect.value;

    let baseDT;

    if (direction === 'yourToTheir') {
      // Update UI labels
      timeLabelText.textContent = 'Your Time:';
      leftLabel.textContent = 'Your Time:';
      rightLabel.textContent = 'Their Time:';

      baseDT = DateTime.fromISO(yourTimeInput.value, { zone: yourZone });
      yourTimeDisplay.textContent = baseDT.setZone(yourZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
      theirTimeDisplay.textContent = baseDT.setZone(theirZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
    } else {
      // Update UI labels
      timeLabelText.textContent = 'Their Time:';
      leftLabel.textContent = 'Their Time:';
      rightLabel.textContent = 'Your Time:';

      baseDT = DateTime.fromISO(yourTimeInput.value, { zone: theirZone });
      theirTimeDisplay.textContent = baseDT.setZone(theirZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
      yourTimeDisplay.textContent = baseDT.setZone(yourZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
    }
  }

  // Update clocks
  function updateClocks() {
    const now = DateTime.local();
    clockEls.forEach(el => {
      const tz = el.dataset.tz;
      el.querySelector('.time').textContent = now.setZone(tz).toLocaleString(DateTime.TIME_WITH_SECONDS);
    });
  }

  // Edit clock zones
  let editing = false;
  editButton.addEventListener('click', () => {
    editing = !editing;
    editButton.textContent = editing ? 'Save' : '⚙️';
    clockEls.forEach((el, idx) => {
      const input = clockZoneInputs[idx];
      if (editing) {
        input.style.display = 'block';
        input.value = el.dataset.tz;
      } else {
        input.style.display = 'none';
        const zone = input.value || el.dataset.tz;
        el.dataset.tz = zone;
        el.querySelector('h3').textContent = zone;
      }
    });
    if (!editing) {
      const zones = Array.from(clockEls, el => el.dataset.tz);
      saveClockPrefs(zones);
    }
  });

  clockZoneInputs.forEach((input, idx) => {
    input.addEventListener('change', () => {
      const zone = input.value || 'UTC';
      clockEls[idx].dataset.tz = zone;
      clockEls[idx].querySelector('h3').textContent = zone;
      saveClockPrefs(Array.from(clockEls, el => el.dataset.tz));
    });
  });

  // Toggle direction with button
  toggleButton.addEventListener('click', () => {
    directionSelect.value = directionSelect.value === 'yourToTheir' ? 'theirToYour' : 'yourToTheir';
    theirLocationInput.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const nowISO = DateTime.local().startOf('minute').toISO({ suppressSeconds: true, includeOffset: false });
    yourTimeInput.value = nowISO;
    updateResult();
  });

  // Event listeners
  yourTimeInput.addEventListener('input', updateResult);
  theirLocationInput.addEventListener('input', updateResult);
  directionSelect.addEventListener('change', updateResult);

  updateResult();
  updateClocks();
  setInterval(updateClocks, 1000);
})();
