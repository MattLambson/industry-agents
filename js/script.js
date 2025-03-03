const characterData = [
    {
        "id": 1,
        "name": "HAVoC",
        "industry": "Trades/Service",
        "image": "images/characters/char1.png",
        "video": "videos/video1.mp4"
    },
    {
        "id": 2,
        "name": "PricePilot",
        "industry": "Retail Industry",
        "image": "images/characters/char2.png",
        "video": "videos/placeholder.mp4"
    },
    {
        "id": 3,
        "name": "Fillaform",
        "industry": "Customer Support",
        "image": "images/characters/char3.png",
        "video": "videos/placeholder.mp4"
    },
    {
        "id": 4,
        "name": "Scholar",
        "industry": "Edu/Universities",
        "image": "images/characters/char4.png",
        "video": "videos/video4.mp4"
    },
    {
        "id": 5,
        "name": "GuestGuide",
        "industry": "Hospitality",
        "image": "images/characters/char5.png",
        "video": "videos/video5.mp4"
    },
    {
        "id": 6,
        "name": "Navigator",
        "industry": "Business Operations",
        "image": "images/characters/char6.png",
        "video": "videos/placeholder.mp4"
    },
    {
        "id": 7,
        "name": "The Home Ranger",
        "industry": "Real Estate",
        "image": "images/characters/char7.png",
        "video": "videos/video7.mp4"
    },
    {
        "id": 8,
        "name": "Teller",
        "industry": "Financial Services",
        "image": "images/characters/char8.png",
        "video": "videos/placeholder.mp4"
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
    // (The remaining functions stay the same, just update the video path)

    function playCharacterVideo(characterId) {
        showLoading();
        
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
        }

        setTimeout(() => {
            const videoPath = `videos/video${characterId}.mp4`;
            video.src = videoPath;
            modal.style.display = 'block';
            hideLoading();
            video.play();
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
        // Optionally, if you want the music to resume after closing the video:
        // if (!isMusicPlaying) {
        //     bgMusic.play();
        //     isMusicPlaying = true;
        // }
    });

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
});