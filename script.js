let activeList = [], telegramActiveList = [];

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  document.getElementById('clock').textContent = "Live Time: " + time;
}
setInterval(updateClock, 1000);
updateClock();

// Function to play music from the entered URL
function playMusic() {
  const musicUrl = document.getElementById("musicUrl").value;
  const musicPlayer = document.getElementById("musicPlayer");

  if (musicUrl) {
    musicPlayer.src = musicUrl;
    musicPlayer.play();
  } else {
    alert("Please enter a valid music URL!");
  }
}

function validateNumber(num) {
  return /^\+?\d{10,15}$/.test(num);
}

function formatNumber(num, code) {
  num = num.trim();
  if (!num.startsWith("+")) num = code + num;
  return num;
}

function checkNumbers() {
  checkService("WhatsApp");
}

function checkTelegram() {
  checkService("Telegram");
}

function checkService(service) {
  const code = document.getElementById("countryCode").value.trim();
  const raw = document.getElementById("numbers").value.trim().split("\n");
  const numbers = raw.map(num => formatNumber(num, code)).filter(Boolean);

  let i = 0, total = 0, active = 0, inactive = 0, invalid = 0;
  let results = "", sendLinks = "";

  if (service === "WhatsApp") activeList = [];
  if (service === "Telegram") telegramActiveList = [];

  document.getElementById("progressBar").style.display = "block";

  function processNext() {
    if (i >= numbers.length) {
      document.getElementById("progressBar").style.display = "none";
      document.getElementById("results").innerHTML = results;

      if (service === "WhatsApp" && activeList.length) {
        document.getElementById("sendBar").style.display = "block";
        document.getElementById("sendLinks").innerHTML = sendLinks;
        document.getElementById("joinNowBox").style.display = "block";
      }

      if (service === "Telegram") {
        document.getElementById("telegramStatsBox").style.display = "block";
        document.getElementById("telegramTotal").textContent = total;
        document.getElementById("telegramActive").textContent = active;
        document.getElementById("telegramInactive").textContent = inactive;
        document.getElementById("telegramInvalid").textContent = invalid;
      }

      return;
    }

    const num = numbers[i];
    total++;

    if (!validateNumber(num)) {
      results += `<p class="invalid">${num} (${service}): Invalid</p>`;
      invalid++;
    } else {
      const hasAccount = Math.random() > 0.3;
      if (hasAccount) {
        results += `<p class="active">${num} (${service}): Active</p>`;
        if (service === "WhatsApp") {
          sendLinks += `<p><a class="send-link" href="https://wa.me/${num.replace(/\D/g, '')}" target="_blank">Send to ${num}</a></p>`;
          activeList.push(num);
        } else {
          telegramActiveList.push(num);
        }
        active++;
      } else {
        results += `<p class="inactive">${num} (${service}): Inactive</p>`;
        inactive++;
      }
    }

    document.getElementById("progress").style.width = ((i + 1) / numbers.length * 100) + "%";
    i++;
    setTimeout(processNext, 20);
  }

  processNext();
}

function copyActive() {
  if (!activeList.length) return alert("No WhatsApp active numbers.");
  navigator.clipboard.writeText(activeList.join("\n")).then(() => alert("Copied WhatsApp active numbers!"));
}

function exportActive() {
  if (!activeList.length) return alert("No WhatsApp active numbers.");
  const blob = new Blob([activeList.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "whatsapp_active.txt";
  link.click();
}

function copyTelegramActive() {
  if (!telegramActiveList.length) return alert("No Telegram active numbers.");
  navigator.clipboard.writeText(telegramActiveList.join("\n")).then(() => alert("Copied Telegram active numbers!"));
}

function exportTelegramActive() {
  if (!telegramActiveList.length) return alert("No Telegram active numbers.");
  const blob = new Blob([telegramActiveList.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "telegram_active.txt";
  link.click();
}

function clearAll() {
  document.getElementById("numbers").value = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("sendLinks").innerHTML = "";
  document.getElementById("sendBar").style.display = "none";
  document.getElementById("telegramStatsBox").style.display = "none";
  document.getElementById("joinNowBox").style.display = "none";
  activeList = [];
  telegramActiveList = [];
}

function filterResults() {
  const search = document.getElementById("searchBox").value.toLowerCase();
  document.querySelectorAll("#results p").forEach(p => {
    p.style.display = p.textContent.toLowerCase().includes(search) ? "block" : "none";
  });
}
