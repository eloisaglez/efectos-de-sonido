// Estado de la aplicación
let currentPlaying = null;

// Nombres de sonidos
const soundNames = {
    'tormenta': 'Tormenta',
    'trueno': 'Trueno',
    'telefono': 'Timbre de Teléfono',
    'bofetada': 'Bofetada',
    'agonizando': 'Persona Agonizando',
    'timbre': 'Timbre de Puerta'
};

// Inicializar eventos
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de reproducir
    const playButtons = document.querySelectorAll('.btn-play');
    playButtons.forEach(button => {
        button.addEventListener('click', handlePlay);
    });

    // Configurar botón de detener
    const stopButton = document.getElementById('btn-stop');
    if (stopButton) stopButton.addEventListener('click', stopSound);

    // Habilitar botones si los audios ya tienen src (preinstalados)
    enablePreinstalledAudios();
});

// Habilita botones si el audio ya tiene src (preinstalado)
function enablePreinstalledAudios() {
    const audios = document.querySelectorAll('audio[id^="audio-"]');
    audios.forEach(audio => {
        // Comprobamos que exista un src válido (ignoramos about:blank)
        if (audio.getAttribute('src')) {
            const soundId = audio.id.replace('audio-', '');
            const playButton = document.querySelector(`.btn-play[data-sound="${soundId}"]`);
            const checkIcon = document.getElementById(`check-${soundId}`);
            if (checkIcon) checkIcon.classList.remove('hidden');
            if (playButton) playButton.disabled = false;
        }
    });
}

// Manejar reproducción: si se pulsa el mismo sonido que suena, lo detiene; si es otro, lo cambia.
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
    audio.play()
        .then(() => {
            currentPlaying = soundId;

            // Actualizar UI
            button.classList.add('playing');
            button.textContent = '▶ Reproduciendo';

            // Habilitar botón de detener
            const stopButton = document.getElementById('btn-stop');
            if (stopButton) stopButton.disabled = false;

            // Mostrar estado
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

// Detener sonido
function stopSound() {
    if (currentPlaying) {
        const audio = document.getElementById(`audio-${currentPlaying}`);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // Actualizar UI
        const button = document.querySelector(`.btn-play[data-sound="${currentPlaying}"]`);
        if (button) {
            button.classList.remove('playing');
            button.textContent = '▶ Reproducir';
        }

        currentPlaying = null;
    }

    // Deshabilitar botón de detener
    const stopButton = document.getElementById('btn-stop');
    if (stopButton) stopButton.disabled = true;

    // Ocultar estado
    const status = document.getElementById('status');
    if (status) status.classList.add('hidden');
}
