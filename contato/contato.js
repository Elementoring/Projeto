// Relógio em tempo real
function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    clock.innerText = `Horário: ${now.toLocaleTimeString()}`;
}
setInterval(updateClock, 1000);
updateClock();