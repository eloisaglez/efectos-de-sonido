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
    // Configurar inputs de archivo
    const fileInputs = document.querySelectorAll('.file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });

    // Configurar botones de reproducir
    const playButtons = document.querySelectorAll('.btn-play');
    playButtons.forEach(button => {
        button.addEventListener('click', handlePlay);
    });

    // Configurar botón de detener
    const stopButton = document.getElementById('btn-stop');
    stopButton.addEventListener('click', stopSound);
});

// Manejar carga de archivo
function handleFileUpload(event) {
    const input = event.target;
    const soundId = input.dataset.sound;
    const file = input.files[0];

    if (file) {
        const url = URL.createObjectURL(file);
        
        // Configurar el audio
        const audio = document.getElementById(`audio-${soundId}`);
        audio.src = url;
        audio.classList.remove('hidden');
        
        // Mostrar el check
        const checkIcon = document.getElementById(`check-${soundId}`);
        checkIcon.classList.remove('hidden');
        
        // Habilitar el botón de reproducir
        const playButton = document.querySelector(`.btn-play[data-sound="${soundId}"]`);
        playButton.disabled = false;
    }
}

// Manejar reproducción
function handlePlay(event) {
    const button = event.currentTarget;
    const soundId = button.dataset.sound;
    
    // Si hay otro sonido reproduciéndose, detenerlo
    if (currentPlaying && currentPlaying !== soundId) {
        stopSound();
    }
    
    // Reproducir el audio
    const audio = document.getElementById(`audio-${soundId}`);
    audio.play()
        .then(() => {
            currentPlaying = soundId;
            
            // Actualizar UI
            button.classList.add('playing');
            button.textContent = '▶ Reproduciendo';
            
            // Habilitar botón de detener
            const stopButton = document.getElementById('btn-stop');
            stopButton.disabled = false;
            
            // Mostrar estado
            const status = document.getElementById('status');
            const statusText = document.getElementById('status-text');
            statusText.textContent = soundNames[soundId];
            status.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error al reproducir audio:', error);
            alert('Error al reproducir el audio. Verifica que el archivo sea válido.');
        });
}

// Detener sonido
function stopSound() {
    if (currentPlaying) {
        const audio = document.getElementById(`audio-${currentPlaying}`);
        audio.pause();
        audio.currentTime = 0;
        
        // Actualizar UI
        const button = document.querySelector(`.btn-play[data-sound="${currentPlaying}"]`);
        button.classList.remove('playing');
        button.textContent = '▶ Reproducir';
        
        currentPlaying = null;
    }
    
    // Deshabilitar botón de detener
    const stopButton = document.getElementById('btn-stop');
    stopButton.disabled = true;
    
    // Ocultar estado
    const status = document.getElementById('status');
    status.classList.add('hidden');
}