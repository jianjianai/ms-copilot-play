window.electron.ipcRenderer.send('ping')

document.getElementById("start")?.addEventListener("click",()=>{
  window.location.href = "https://copilot.microsoft.com/"
});