// script.js
(function () {
  const yourTimeInput = document.getElementById('yourTime');
  const theirLocationInput = document.getElementById('theirLocation');
  const zonesList = document.getElementById('zones');
  const yourTimeDisplay = document.getElementById('yourTimeDisplay');
  const theirTimeDisplay = document.getElementById('theirTimeDisplay');
  const clockEls = document.querySelectorAll('.clock');

  // Populate datalist with time zones
  const timeZones = (Intl.supportedValuesOf && Intl.supportedValuesOf('timeZone')) || [
    'UTC',
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
    'Australia/Sydney'
  ];

  timeZones.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz;
    zonesList.appendChild(option);
  });

  // Set default date-time to now (rounded to nearest minute)
  const now = new Date();
  now.setSeconds(0, 0);
  yourTimeInput.value = now.toISOString().slice(0, 16);

  function updateResult() {
    const yourDate = new Date(yourTimeInput.value);
    if (isNaN(yourDate)) return;

    const yourFormatted = yourDate.toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    yourTimeDisplay.textContent = yourFormatted;

    const theirZone = theirLocationInput.value || Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const theirFormatted = yourDate.toLocaleString(undefined, {
        timeZone: theirZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      theirTimeDisplay.textContent = theirFormatted;
    } catch (e) {
      theirTimeDisplay.textContent = 'Invalid time zone';
    }
  }

  yourTimeInput.addEventListener('input', updateResult);
  theirLocationInput.addEventListener('input', updateResult);

  updateResult();

  // Update digital clocks
  function updateClocks() {
    const now = new Date();
    clockEls.forEach(el => {
      const tz = el.dataset.tz;
      el.querySelector('.time').textContent = now.toLocaleTimeString(undefined, {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    });
  }
  updateClocks();
  setInterval(updateClocks, 1000);
})();
