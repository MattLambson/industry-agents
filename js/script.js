const characterData = [
    {
        "id": 1,
        "name": "Network Nova",
        "industry": "Channel Managers",
        "image": "images/characters/NetworkNova.png",
        "video": "videos/NetworkNova.mp4"
    },
    {
        "id": 2,
        "name": "PricePilot",
        "industry": "Retail Industry",
        "image": "images/characters/PricePilot.png",
        "video": "videos/PricePilot.mp4"
    },
    {
        "id": 3,
        "name": "Fillaform",
        "industry": "Customer Support",
        "image": "images/characters/Fillaform.png",
        "video": "videos/Fillaform.mp4"
    },
    {
        "id": 4,
        "name": "GuestGuide",
        "industry": "Hospitality",
        "image": "images/characters/GuestGuide.png",
        "video": "videos/GuestGuide.mp4"
    },
    {
        "id": 5,
        "name": "Teller",
        "industry": "Financial Services",
        "image": "images/characters/Teller.png",
        "video": "videos/Teller.mp4"
    },
    {
        "id": 6,
        "name": "Navigator",
        "industry": "Business Operations",
        "image": "images/characters/Navigator.png",
        "video": "videos/Navigator.mp4"
    },
    {
        "id": 7,
        "name": "The Home Ranger",
        "industry": "Real Estate",
        "image": "images/characters/HomeRanger.png",
        "video": "videos/HomeRanger.mp4"
    },
    {
        "id": 8,
        "name": "Scholar",
        "industry": "Edu/Universities",
        "image": "images/characters/Scholar.png",
        "video": "videos/Scholar.mp4"
    },
    {
        "id": 9,
        "name": "HAVoC",
        "industry": "Trades/Service",
        "image": "images/characters/HAVoC.png",
        "video": "videos/HAVoC.mp4"
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

        // Find the character data for the given ID
        const character = characterData.find(char => char.id == characterId);

        setTimeout(() => {
            //Uses the video path from the character data
            const videoPath = character.video;
            video.src = videoPath;
            modal.style.display = 'flex';
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