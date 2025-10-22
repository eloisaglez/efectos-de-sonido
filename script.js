// Estado de la aplicación
let currentPlaying = null;

const soundNames = {
    'tormenta': 'Tormenta',
    'trueno': 'Trueno',
    'telefono': 'Timbre de Teléfono',
    'bofetada': 'Bofetada',
    'agonizando': 'Persona Agonizando',
    'timbre': 'Timbre de Puerta'
};

document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.btn-play');
    playButtons.forEach(button => button.addEventListener('click', handlePlay));

    const stopButton = document.getElementById('btn-stop');
    if (stopButton) stopButton.addEventListener('click', stopSound);

    // Habilitar botones si los audios ya tienen src (preinstalados)
    enablePreinstalledAudios();

    // Añadir listener 'ended' para cada audio: si termina, restablecer UI
    const audios = document.querySelectorAll('audio[id^="audio-"]');
    audios.forEach(audio => {
        const soundId = audio.id.replace('audio-', '');
        audio.addEventListener('ended', () => {
            // Si se trata de la bofetada (o cualquier audio no-loop), al terminar
            // limpiamos el estado tal y como hace stopSound.
            if (currentPlaying === soundId) {
                // actualizamos UI sin volver a pausar (ya terminó)
                const button = document.querySelector(`.btn-play[data-sound="${soundId}"]`);
                if (button) {
                    button.classList.remove('playing');
                    button.textContent = '▶ Reproducir';
                }
                currentPlaying = null;
                const stopBtn = document.getElementById('btn-stop');
                if (stopBtn) stopBtn.disabled = true;
                const status = document.getElementById('status');
                if (status) status.classList.add('hidden');
            }
        });
    });
});

function enablePreinstalledAudios() {
    const audios = document.querySelectorAll('audio[id^="audio-"]');
    audios.forEach(audio => {
        if (audio.getAttribute('src')) {
            const soundId = audio.id.replace('audio-', '');
            const playButton = document.querySelector(`.btn-play[data-sound="${soundId}"]`);
            const checkIcon = document.getElementById(`check-${soundId}`);
            if (checkIcon) checkIcon.classList.remove('hidden');
            if (playButton) playButton.disabled = false;
        }
    });
}

function handlePlay(event) {
    const button = event.currentTarget;
    const soundId = button.dataset.sound;

    // Si el mismo sonido está reproduciéndose -> detenerlo
    if (currentPlaying === soundId) {
        stopSound();
        return;
    }

    // Si hay otro sonido reproduciéndose, detenerlo primero
    if (currentPlaying && currentPlaying !== soundId) {
        stopSound();
    }

    // Reproducir el audio
    const audio = document.getElementById(`audio-${soundId}`);
    if (!audio) return;

    // Aseguramos que la bofetada no esté en loop (por si quedó marcado)
    if (soundId === 'bofetada') audio.loop = false;

    audio.play()
        .then(() => {
            currentPlaying = soundId;
            button.classList.add('playing');
            button.textContent = '▶ Reproduciendo';
            const stopButton = document.getElementById('btn-stop');
            if (stopButton) stopButton.disabled = false;
            const status = document.getElementById('status');
            const statusText = document.getElementById('status-text');
            if (statusText) statusText.textContent = soundNames[soundId] || soundId;
            if (status) status.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error al reproducir audio:', error);
            alert('Error al reproducir el audio. Verifica que el archivo sea válido y que el navegador permita reproducción.');
        });
}

function stopSound() {
    if (currentPlaying) {
        const audio = document.getElementById(`audio-${currentPlaying}`);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        const button = document.querySelector(`.btn-play[data-sound="${currentPlaying}"]`);
        if (button) {
            button.classList.remove('playing');
            button.textContent = '▶ Reproducir';
        }

        currentPlaying = null;
    }

    const stopButton = document.getElementById('btn-stop');
    if (stopButton) stopButton.disabled = true;

    const status = document.getElementById('status');
    if (status) status.classList.add('hidden');
}
