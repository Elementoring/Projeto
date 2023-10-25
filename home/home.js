         // Função para exibir o relógio em tempo real
         function updateClock() {
            const now = new Date();
            const clock = document.getElementById('clock');
            clock.innerText = `Horário: ${now.toLocaleTimeString()}`;
        }
        setInterval(updateClock, 1000); // Atualiza o relógio a cada segundo
        updateClock(); // Atualiza o relógio imediatamente