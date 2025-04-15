// Character data (same as before but with Italian industry names)
const characterData = [
    {
        "id": 1,
        "name": "Network Nova",
        "industry": "Gestori di Canale",
        "image": "images/characters/NetworkNova.png",
        "video": "videos/NetworkNova.mp4",
        "pageUrl": "characters/network-nova.html"
    },
    {
        "id": 2,
        "name": "PricePilot",
        "industry": "Settore Retail",
        "image": "images/characters/PricePilot.png",
        "video": "videos/PricePilot.mp4",
        "pageUrl": "characters/price-pilot.html"
    },
    {
        "id": 3,
        "name": "Fillaform",
        "industry": "Assistenza Clienti",
        "image": "images/characters/Fillaform.png",
        "video": "videos/Fillaform.mp4",
        "pageUrl": "characters/fillaform.html"
    },
    {
        "id": 4,
        "name": "GuestGuide",
        "industry": "Ospitalità",
        "image": "images/characters/GuestGuide.png",
        "video": "videos/GuestGuide.mp4",
        "pageUrl": "characters/guest-guide.html"
    },
    {
        "id": 5,
        "name": "Teller",
        "industry": "Servizi Finanziari",
        "image": "images/characters/Teller.png",
        "video": "videos/Teller.mp4",
        "pageUrl": "characters/teller.html"
    },
    {
        "id": 6,
        "name": "Navigator",
        "industry": "Supporto Aziendale",
        "image": "images/characters/Navigator.png",
        "video": "videos/Navigator.mp4",
        "pageUrl": "characters/navigator.html"
    },
    {
        "id": 7,
        "name": "The Home Ranger",
        "industry": "Immobiliare",
        "image": "images/characters/HomeRanger.png",
        "video": "videos/HomeRanger.mp4",
        "pageUrl": "characters/home-ranger.html"
    },
    {
        "id": 8,
        "name": "Scholar",
        "industry": "Istruzione/Università",
        "image": "images/characters/Scholar.png",
        "video": "videos/Scholar.mp4",
        "pageUrl": "characters/scholar.html"
    },
    {
        "id": 9,
        "name": "HAVoC",
        "industry": "Commercio/Servizi",
        "image": "images/characters/HAVoC.png",
        "video": "videos/HAVoC.mp4",
        "pageUrl": "characters/havoc.html"
    }
];
document.addEventListener('DOMContentLoaded', function() {
    const mainPlayer = document.getElementById('mainPlayer');
    const currentVideoName = document.getElementById('currentVideoName');
    const currentVideoIndustry = document.getElementById('currentVideoIndustry');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const progressText = document.getElementById('progressText');
    const progressDots = document.getElementById('progressDots');
    
    let currentVideoIndex = 0;
    let validVideos = []; // Will store indices of videos that successfully load
    
    // Debug - Log the working directory path
    console.log("Current page URL:", window.location.href);
    
    // Important - Make videos play directly without checking if they exist first
    // (Some servers don't support HEAD requests)
    function startVideoPlayback() {
        console.log("Starting video playback sequence");
        
        // Add all video indices to valid videos
        for (let i = 0; i < characterData.length; i++) {
            validVideos.push(i);
        }
        
        // Create progress dots
        createProgressDots();
        
        // Start with the first video
        currentVideoIndex = 0;
        loadAndPlayVideo(currentVideoIndex);
    }
    
    // Create progress dots for all videos
    function createProgressDots() {
        progressDots.innerHTML = ''; // Clear existing dots if any
        
        characterData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            progressDots.appendChild(dot);
        });
    }
    
    // Show error message in player
    function showError(message) {
        console.error("Video error:", message);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>Errore Video</h3>
            <p>${message}</p>
            <p>Percorso video: ${characterData[currentVideoIndex]?.video || 'Sconosciuto'}</p>
        `;
        
        // Add to player container
        mainPlayer.parentNode.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
        
        // Try to continue with next video after an error
        setTimeout(playNextVideo, 3000);
    }
    
    // Load and play a specific video
    function loadAndPlayVideo(index) {
        if (index >= characterData.length || index < 0) {
            console.error("Invalid video index:", index);
            playNextVideo();
            return;
        }
        
        const videoData = characterData[index];
        console.log(`Loading video: ${videoData.name}, Path: ${videoData.video}`);
        
        showLoading(true);
        
        // Update the progress indicator
        updateProgressIndicator(index);
        
        // Update video info
        currentVideoName.textContent = videoData.name;
        currentVideoIndustry.textContent = videoData.industry;
        
        // Update video source
        mainPlayer.innerHTML = ''; // Clear any previous source elements
        const source = document.createElement('source');
        source.src = videoData.video;
        source.type = 'video/mp4';
        mainPlayer.appendChild(source);
        
        // Reload and play
        mainPlayer.load();
        
        // Give the browser a moment to process the new source
        setTimeout(() => {
            const playPromise = mainPlayer.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`Successfully playing: ${videoData.name}`);
                        showLoading(false);
                    })
                    .catch(error => {
                        console.error(`Error playing video ${videoData.name}:`, error);
                        showLoading(false);
                        
                        // Show visible error but continue playback
                        showError(`Impossibile riprodurre ${videoData.name}: ${error.message}`);
                    });
            }
        }, 500);
    }
    
    // Update the progress dots and text
    function updateProgressIndicator(index) {
        // Update dots
        const dots = progressDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update text
        progressText.textContent = `Video ${index + 1}/${characterData.length}`;
    }
    
    // Show/hide loading indicator
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
    
    // Play the next video in sequence
    function playNextVideo() {
        currentVideoIndex++;
        
        // Loop back to the beginning if we've reached the end
        if (currentVideoIndex >= characterData.length) {
            currentVideoIndex = 0;
        }
        
        // Load and play the next video
        loadAndPlayVideo(currentVideoIndex);
    }
    
    // Event: When current video ends, play the next one
    mainPlayer.addEventListener('ended', function() {
        console.log("Video ended, playing next...");
        playNextVideo();
    });
    
    // Handle video errors
    mainPlayer.addEventListener('error', function(e) {
        console.error("Video error event:", e);
        
        const error = e.target.error;
        let errorMessage = "Errore sconosciuto";
        
        if (error) {
            switch (error.code) {
                case error.MEDIA_ERR_ABORTED:
                    errorMessage = "Hai interrotto la riproduzione del video";
                    break;
                case error.MEDIA_ERR_NETWORK:
                    errorMessage = "Un errore di rete ha causato il fallimento del download del video";
                    break;
                case error.MEDIA_ERR_DECODE:
                    errorMessage = "La riproduzione del video è stata interrotta a causa di un problema di corruzione";
                    break;
                case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = "Il formato del video non è supportato";
                    break;
                default:
                    errorMessage = "Si è verificato un errore sconosciuto";
                    break;
            }
        }
        
        showError(errorMessage);
        
        // Try the next video after a short delay
        setTimeout(playNextVideo, 3000);
    });
    
    // Start video playback
    startVideoPlayback();
    
    // Help diagnose path issues
    console.log("Debug info:");
    console.log("Page URL:", window.location.href);
    console.log("Folder path:", window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));
    console.log("Sample video path:", characterData[0].video);
});