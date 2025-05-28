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

  const leftLabel = document.getElementById('leftLabel');
  const rightLabel = document.getElementById('rightLabel');
  const timeLabelText = document.getElementById('timeLabelText');
const locationLabelText = document.getElementById('locationLabelText');> main
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

  // Default your time input to now (rounded to minute)
  const now = DateTime.local().startOf('minute');
  yourTimeInput.value = now.toISO({ suppressSeconds: true, includeOffset: false });

  function updateResult() {
    const yourZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const theirZone = theirLocationInput.value || 'UTC';
    const direction = directionSelect.value;

    let baseDT;

    if (direction === 'yourToTheir') {
      // Update UI labels
      timeLabelText.textContent = 'Your Time:';
timeLabelText.textContent = 'Your Time:';
locationLabelText.textContent = 'Their Location:';
leftLabel.textContnt = 'Your Time:';
      rightLabel.textContent = 'Their Time:';
      baseDT = DateTime.fromISO(yourTimeInput.value, { zone: yourZone });
      yourTimeDisplay.textContent = baseDT.setZone(yourZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
      theirTimeDisplay.textContent = baseDT.setZone(theirZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
    } else {
      // Update UI labels
      timeLabelText.textContent = 'Their Time:';
timeLabelText.textContent = 'Their Time:';
locationLabelText.textContent = 'Your Location:';
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

  // Toggle direction with button
  toggleButton.addEventListener('click', () => {
const newDirection = directionSelect.value === 'yourToTheir' ? 'theirToYour' : 'yourToTheir';
directionSelect.value = newDirection;<
// Reset fields when toggling
const now = DateTime.local().startOf('minute');
yourTimeInput.value = now.toISO({ suppressSeconds: true, includeOffset: false });

if (newDirection === 'theirToYour') {
    theirLocationInput.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
}    } else {
      theirLocationInput.value = '';
    }

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
