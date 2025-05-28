// script.js (Luxon-based)
(function () {
  const { DateTime } = luxon;

  const yourTimeInput = document.getElementById('yourTime');
  const theirLocationInput = document.getElementById('theirLocation');
  const directionSelect = document.getElementById('direction');
  const toggleButton = document.getElementById('toggleDirection');
 2irrju-codex/fix-toggle-behavior-and-clock-display
  const toggleClocksButton = document.getElementById('toggleClocks');

  const zonesList = document.getElementById('zones');
  const yourTimeDisplay = document.getElementById('yourTimeDisplay');
  const theirTimeDisplay = document.getElementById('theirTimeDisplay');
  const clockEls = document.querySelectorAll('.clock');

 2irrju-codex/fix-toggle-behavior-and-clock-display
  let showAnalog = false;

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
2irrju-codex/fix-toggle-behavior-and-clock-display
      leftLabel.textContent = 'Your Time:';
      rightLabel.textContent = 'Their Time:';

      baseDT = DateTime.fromISO(yourTimeInput.value, { zone: yourZone });
      yourTimeDisplay.textContent = baseDT.setZone(yourZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
      theirTimeDisplay.textContent = baseDT.setZone(theirZone).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
    } else {
      // Update UI labels
      timeLabelText.textContent = 'Their Time:';
2irrju-codex/fix-toggle-behavior-and-clock-display
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
      const dt = now.setZone(tz);
      el.querySelector('.time').textContent = dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
      const canvas = el.querySelector('canvas');
      if (canvas && showAnalog) {
        drawAnalog(canvas, dt);
      }
    });
  }

2irrju-codex/fix-toggle-behavior-and-clock-display
  function drawAnalog(canvas, dt) {
    const ctx = canvas.getContext('2d');
    const r = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(r, r);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r - 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath();
      ctx.moveTo(0, -r + 4);
      ctx.lineTo(0, -r + 10);
      ctx.stroke();
    }
    ctx.rotate(-Math.PI / 6 * 12);
    const hour = dt.hour % 12;
    const minute = dt.minute;
    const second = dt.second;
    ctx.save();
    ctx.rotate(hour * Math.PI / 6 + minute * Math.PI / 360);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r * 0.5);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(minute * Math.PI / 30 + second * Math.PI / 1800);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r * 0.75);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.rotate(second * Math.PI / 30);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -r * 0.85);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  // Toggle direction with button
  toggleButton.addEventListener('click', () => {
    directionSelect.value = directionSelect.value === 'yourToTheir' ? 'theirToYour' : 'yourToTheir';
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (directionSelect.value === 'theirToYour') {
      theirLocationInput.value = userZone;
    } else {
      theirLocationInput.value = '';
    }
    yourTimeInput.value = DateTime.local().startOf('minute').toISO({ suppressSeconds: true, includeOffset: false });
    updateResult();
  });

  // Toggle digital/analog clocks
  toggleClocksButton.addEventListener('click', () => {
    showAnalog = !showAnalog;
    clockEls.forEach(el => {
      el.querySelector('.time').style.display = showAnalog ? 'none' : 'block';
      el.querySelector('canvas').style.display = showAnalog ? 'block' : 'none';
    });
    toggleClocksButton.textContent = showAnalog ? 'Show Digital' : 'Show Analog';
    updateClocks();

  });

  // Event listeners
  yourTimeInput.addEventListener('input', updateResult);
  theirLocationInput.addEventListener('input', updateResult);
  directionSelect.addEventListener('change', updateResult);

  updateResult();
  updateClocks();
  setInterval(updateClocks, 1000);
})();
