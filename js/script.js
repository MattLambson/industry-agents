const characterData = [
    {
        "id": 1,
        "name": "Network Nova",
        "industry": "Channel Managers",
        "image": "images/characters/NetworkNova.png",
        "video": "videos/networknova.mp4",
        "pageUrl": "characters/network-nova.html"
    },
    {
        "id": 2,
        "name": "PricePilot",
        "industry": "Retail Industry",
        "image": "images/characters/PricePilot.png",
        "video": "videos/pricepilot.mp4",
        "pageUrl": "characters/price-pilot.html"
    },
    {
        "id": 3,
        "name": "Fillaform",
        "industry": "Customer Support",
        "image": "images/characters/Fillaform.png",
        "video": "videos/fillaform.mp4",
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
        "video": "videos/teller.mp4",
        "pageUrl": "characters/teller.html"
    },
    {
        "id": 6,
        "name": "Navigator",
        "industry": "Business Support",
        "image": "images/characters/Navigator.png",
        "video": "videos/navigator.mp4",
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
    // Function to create character grid
    function createCharacterGrid() {
        const grid = document.querySelector('.character-grid');
        characterData.forEach(char => {
            const charCard = document.createElement('div');
            charCard.className = 'character-card';
            charCard.dataset.id = char.id;
            
            charCard.innerHTML = `
                <div class="character-frame">
                    <img src="${char.image}" alt="${char.name}" class="character-image">
                </div>
                <div class="character-info">
                    <div class="character-name">${char.name}</div>
                    <div class="character-industry">${char.industry}</div>
                </div>
            `;
            grid.appendChild(charCard);
        });
    }
    
    // Create the character grid
    createCharacterGrid();
    
    const characters = document.querySelectorAll('.character-card');
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('characterVideo');
    const closeButton = document.querySelector('.close-button');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const bgMusic = document.getElementById('bgMusic');
    
    let currentSelected = 0;
    let isModalOpen = false;
    let isMusicPlaying = false;
    let currentCharacterId = null;
    
    // Initialize first character as selected
    characters[currentSelected].classList.add('selected');
    
    // Character selection logic
    function selectCharacter(index) {
        characters.forEach(char => char.classList.remove('selected'));
        characters[index].classList.add('selected');
        currentSelected = index;
    }
    
    // Show loading overlay
    function showLoading() {
        loadingOverlay.style.display = 'flex';
    }
    
    // Hide loading overlay
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }
    
    // Function to redirect to character-specific page
    function redirectToCharacterPage(characterId) {
        console.log("Redirect function called with ID:", characterId);
        const character = characterData.find(char => char.id == characterId);
        console.log("Found character:", character);
        
        if (character && character.pageUrl) {
            console.log("Redirecting to:", character.pageUrl);
            window.location.href = character.pageUrl;
        } else {
            console.log("No valid pageUrl found");
        }
    }
    
    // FIXED: Play character video function
    function playCharacterVideo(characterId) {
        showLoading();
        
        // Store the current character ID
        currentCharacterId = characterId;
        
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
        }
        
        // Find the character data for the selected ID
        const character = characterData.find(char => char.id == characterId);
        
        setTimeout(() => {
            // Use the video path from the character data
            const videoPath = character.video;
            
            // FIXED: Set the video source properly
            video.src = videoPath;
            
            modal.style.display = 'flex';
            hideLoading();
            video.play().catch(error => {
                console.error("Error playing video:", error);
            });
            isModalOpen = true;
        }, 1000);
    }
    
    // Event Listeners
    characters.forEach((char, index) => {
        char.addEventListener('click', () => {
            const characterId = char.dataset.id;
            playCharacterVideo(characterId);
        });
        char.addEventListener('mouseenter', () => {
            selectCharacter(index);
        });
    });
    
    closeButton.addEventListener('click', () => {
        video.pause();
        video.src = '';
        modal.style.display = 'none';
        isModalOpen = false;
        currentCharacterId = null; // Reset current character ID
        // Optionally, if you want the music to resume after closing the video:
        // if (!isMusicPlaying) {
        //     bgMusic.play();
        //     isMusicPlaying = true;
        // }
    });
    
    // Add event listener for video end
    video.addEventListener('ended', function() {
        console.log("Video ended event fired");
        console.log("Current character ID:", currentCharacterId);
        
        if (currentCharacterId) {
            console.log("Attempting to redirect to character page");
            redirectToCharacterPage(currentCharacterId);
        } else {
            console.log("No current character ID set");
        }
    });
    
    // Added alternative onended approach for better compatibility
    video.onended = function() {
        console.log("Video ended event fired (onended property)");
        if (currentCharacterId) {
            redirectToCharacterPage(currentCharacterId);
        }
    };
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isModalOpen) {
            if (e.key === 'Escape') {
                closeButton.click();
            }
            return;
        }
        
        const gridColumns = 4;
        const totalCharacters = characters.length;
        
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                selectCharacter((currentSelected + 1) % totalCharacters);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                selectCharacter((currentSelected - 1 + totalCharacters) % totalCharacters);
                break;
            case 'ArrowUp':
                e.preventDefault();
                const upIndex = currentSelected - gridColumns;
                if (upIndex >= 0) selectCharacter(upIndex);
                break;
            case 'ArrowDown':
                e.preventDefault();
                const downIndex = currentSelected + gridColumns;
                if (downIndex < totalCharacters) selectCharacter(downIndex);
                break;
            case 'Enter':
                e.preventDefault();
                const selectedChar = characters[currentSelected];
                const characterId = selectedChar.dataset.id;
                playCharacterVideo(characterId);
                break;
            case 'm':
            case 'M':
                if (!isModalOpen) {  // Only toggle music if no video is playing
                    if (isMusicPlaying) {
                        bgMusic.pause();
                        isMusicPlaying = false;
                    } else {
                        bgMusic.play();
                        isMusicPlaying = true;
                    }
                }
                break;
        }
    });
    
    // Handle modal click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeButton.click();
        }
    });
    
    // ADDED: Image Modal Functionality for character pages
    // Only initialize if we're on a character page with photo boxes
    const photoBoxes = document.querySelectorAll('.photo-box');
    if (photoBoxes.length > 0) {
        const imageModal = document.getElementById('imageModal');
        const fullSizeImage = document.getElementById('fullSizeImage');
        const imageCloseButton = document.getElementById('imageCloseButton');
        
        // Make sure the modal is hidden initially
        if (imageModal) {
            imageModal.style.display = 'none';
            
            // Add click event to each photo box
            photoBoxes.forEach(box => {
                box.addEventListener('click', function() {
                    const img = this.querySelector('img');
                    if (img) {
                        // Set the full-size image source
                        fullSizeImage.src = img.src;
                        fullSizeImage.alt = img.alt;
                        
                        // Display the modal
                        imageModal.style.display = 'flex';
                    }
                });
            });
            
            // Close modal when clicking the close button
            imageCloseButton.addEventListener('click', function() {
                imageModal.style.display = 'none';
            });
            
            // Close modal when clicking outside the image
            imageModal.addEventListener('click', function(e) {
                if (e.target === imageModal) {
                    imageModal.style.display = 'none';
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && imageModal.style.display === 'flex') {
                    imageModal.style.display = 'none';
                }
            });
        }
    }
});