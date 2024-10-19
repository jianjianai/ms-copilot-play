const loadingEl = document.getElementById("loading")!;
const porxyHostEl = document.getElementById("proxyHost") as HTMLInputElement;
const porxyFIPEl = document.getElementById("proxyFIP") as HTMLInputElement;
const checkAvailabilityEl = document.getElementById("checkAvailability");
window.api.proxyConfig.onLoaded(() => {
  loadingEl.classList.add("loaded");
  setTimeout(() => { loadingEl.style.display = "none"; }, 500);
  porxyHostEl.value = window.api.proxyConfig.proxyHost;
  porxyFIPEl.value = window.api.proxyConfig.proxyFIP;
  porxyHostEl.addEventListener("change", () => {
    window.api.proxyConfig.proxyHost = porxyHostEl.value;
  });
  porxyFIPEl.addEventListener("change", () => {
    window.api.proxyConfig.proxyFIP = porxyFIPEl.value;
  });
  checkAvailability();
});

document.getElementById("start")?.addEventListener("click", () => {
  window.location.href = "https://copilot.microsoft.com/"
});

let debounceTimeout: number | undefined;
const checkAvailability = async () => {
  checkAvailabilityEl!.innerText = `正在检查${window.api.proxyConfig.proxyHost}和${window.api.proxyConfig.proxyFIP}的可用性...`;
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = window.setTimeout(async () => {
    let ok = false;
    try {
      const response = await fetch("https://copilot.microsoft.com/c/api/start", {
        "headers": {
          "content-type":"application/json"
        },
        "body": "{\"timeZone\":\"Asia/Shanghai\"}",
        "method": "POST"
      });
      ok = response.ok;
    } catch (e) {
      console.error(e);
      checkAvailabilityEl!.style.color = "red";
      checkAvailabilityEl!.innerText = `${e}`;
    }
    if (ok) {
      checkAvailabilityEl!.style.color = "green";
      checkAvailabilityEl!.innerText = `${window.api.proxyConfig.proxyHost}和${window.api.proxyConfig.proxyFIP}可用`;
    } else {
      checkAvailabilityEl!.style.color = "red";
      checkAvailabilityEl!.innerText = `${window.api.proxyConfig.proxyHost}和${window.api.proxyConfig.proxyFIP}不可用`;
    }
  }, 500); // Adjust the debounce delay as needed
}
window.api.proxyConfig.onchange(checkAvailability);




