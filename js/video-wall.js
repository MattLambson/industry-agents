// Use the same character data from your main script
const characterData = [
    {
        "id": 1,
        "name": "Network Nova",
        "industry": "Channel Managers",
        "image": "images/characters/NetworkNova.png",
        "video": "videos/NetworkNova.mp4",
        "pageUrl": "characters/network-nova.html"
    },
    {
        "id": 2,
        "name": "PricePilot",
        "industry": "Retail Industry",
        "image": "images/characters/PricePilot.png",
        "video": "videos/PricePilot.mp4",
        "pageUrl": "characters/price-pilot.html"
    },
    {
        "id": 3,
        "name": "Fillaform",
        "industry": "Customer Support",
        "image": "images/characters/Fillaform.png",
        "video": "videos/Fillaform.mp4",
        "pageUrl": "characters/fillaform.html"
    },
    {
        "id": 4,
        "name": "GuestGuide",
        "industry": "Hospitality",
        "image": "images/characters/GuestGuide.png",
        "video": "videos/GuestGuide.mp4",
        "pageUrl": "characters/guest-guide.html"
    },
    {
        "id": 5,
        "name": "Teller",
        "industry": "Financial Services",
        "image": "images/characters/Teller.png",
        "video": "videos/Teller.mp4",
        "pageUrl": "characters/teller.html"
    },
    {
        "id": 6,
        "name": "Navigator",
        "industry": "Business Support",
        "image": "images/characters/Navigator.png",
        "video": "videos/Navigator.mp4",
        "pageUrl": "characters/navigator.html"
    },
    {
        "id": 7,
        "name": "The Home Ranger",
        "industry": "Real Estate",
        "image": "images/characters/HomeRanger.png",
        "video": "videos/HomeRanger.mp4",
        "pageUrl": "characters/home-ranger.html"
    },
    {
        "id": 8,
        "name": "Scholar",
        "industry": "Edu/Universities",
        "image": "images/characters/Scholar.png",
        "video": "videos/Scholar.mp4",
        "pageUrl": "characters/scholar.html"
    },
    {
        "id": 9,
        "name": "HAVoC",
        "industry": "Trades/Service",
        "image": "images/characters/HAVoC.png",
        "video": "videos/HAVoC.mp4",
        "pageUrl": "characters/havoc.html"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const videoGrid = document.querySelector('.video-grid');
    const muteAllBtn = document.getElementById('muteAllBtn');
    const unmuteAllBtn = document.getElementById('unmuteAllBtn');
    
    // Function to check if video files exist before trying to play them
    function checkVideoFile(url) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('HEAD', url, true);
            req.onload = function() {
                if (req.status >= 200 && req.status < 300) {
                    resolve(true);
                } else {
                    reject(new Error(`File at ${url} not found (status ${req.status})`));
                }
            };
            req.onerror = function() {
                reject(new Error(`Network error while checking ${url}`));
            };
            req.send();
        });
    }
    
    // Create video cards for each character
    function createVideoWall() {
        characterData.forEach(char => {
            // First check if the video exists
            checkVideoFile(char.video)
                .then(() => {
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card';
                    
                    // Create video element
                    const video = document.createElement('video');
                    video.src = char.video;
                    video.muted = true; // Start muted to allow autoplay
                    video.loop = true;
                    video.autoplay = true;
                    video.controls = true; // Show video controls
                    video.playsInline = true; // Better mobile support
                    
                    // Create title overlay
                    const titleOverlay = document.createElement('div');
                    titleOverlay.className = 'video-title';
                    titleOverlay.textContent = `${char.name} - ${char.industry}`;
                    
                    // Create mute toggle button
                    const muteToggle = document.createElement('button');
                    muteToggle.className = 'mute-toggle';
                    muteToggle.innerHTML = '🔇'; // Muted icon
                    muteToggle.addEventListener('click', () => {
                        video.muted = !video.muted;
                        muteToggle.innerHTML = video.muted ? '🔇' : '🔊';
                    });
                    
                    // Add everything to the card
                    videoCard.appendChild(video);
                    videoCard.appendChild(titleOverlay);
                    videoCard.appendChild(muteToggle);
                    
                    // Add card to grid
                    videoGrid.appendChild(videoCard);
                    
                    // Try to play the video
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error(`Error playing video for ${char.name}:`, error);
                            
                            // For some browsers, we need to try again with user interaction
                            video.addEventListener('click', () => {
                                video.play().catch(e => console.error('Still could not play video:', e));
                            });
                        });
                    }
                })
                .catch(error => {
                    console.error(`Could not load video for ${char.name}:`, error);
                    
                    // Create error card instead
                    const errorCard = document.createElement('div');
                    errorCard.className = 'video-card error-card';
                    errorCard.innerHTML = `
                        <div class="error-message">
                            <h3>Video not available</h3>
                            <p>${char.name} - ${char.industry}</p>
                            <p class="error-details">Could not load video file: ${char.video}</p>
                        </div>
                    `;
                    videoGrid.appendChild(errorCard);
                });
        });
    }
    
    // Initialize the video wall
    createVideoWall();
    
    // Handle mute/unmute all buttons
    muteAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.video-grid video').forEach(video => {
            video.muted = true;
            const muteToggle = video.parentNode.querySelector('.mute-toggle');
            if (muteToggle) muteToggle.innerHTML = '🔇';
        });
    });
    
    unmuteAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.video-grid video').forEach(video => {
            video.muted = false;
            const muteToggle = video.parentNode.querySelector('.mute-toggle');
            if (muteToggle) muteToggle.innerHTML = '🔊';
        });
    });
    
    // Add a link in the main page to this video wall
    if (window.opener && window.opener !== window) {
        const mainPageLink = document.createElement('a');
        mainPageLink.href = 'video-wall.html';
        mainPageLink.className = 'video-wall-link';
        mainPageLink.textContent = 'View All Videos';
        document.body.appendChild(mainPageLink);
    }
});