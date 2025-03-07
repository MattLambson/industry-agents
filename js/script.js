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
    
    let currentSelected = 0;
    let isModalOpen = false;
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
    
    // Function to check if video files exist (for debugging)
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
    
    function playCharacterVideo(characterId) {
        showLoading();
        
        // Store the current character ID
        currentCharacterId = characterId;
        
        
        // Find the character data for the selected ID
        const character = characterData.find(char => char.id == characterId);
        console.log("Playing video for:", character.name);
        console.log("Video path:", character.video);
        
        // First verify that the video file exists
        checkVideoFile(character.video)
            .then(exists => {
                console.log(`Video file exists: ${character.video}`);
                setTimeout(() => {
                    // Get the source element inside the video tag
                    const sourceElement = video.querySelector('source');
                    
                    // Set the video source properly
                    if (sourceElement) {
                        // Using source element
                        sourceElement.src = character.video;
                        sourceElement.type = "video/mp4";
                        // Important: need to call load() after changing source
                        video.load();
                    } else {
                        // Direct setting (fallback)
                        video.src = character.video;
                    }
                    
                    modal.style.display = 'flex';
                    hideLoading();
                    
                    // Play the video with error handling
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error("Error playing video:", error);
                            console.log("Video element:", video);
                            console.log("Current video source:", sourceElement ? sourceElement.src : video.src);
                            
                            alert("There was an error playing the video. Please try again later.");
                            closeButton.click(); // Close the modal
                        });
                    }
                    
                    isModalOpen = true;
                }, 1000);
            })
            .catch(error => {
                console.error(error);
                alert(`Could not find the video file: ${character.video}\n\nPlease check that the file exists and has the correct filename (case sensitive).`);
                hideLoading();
            });
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
    
    // FIXED: Close button handler properly clearing the source
    closeButton.addEventListener('click', () => {
        video.pause();
        
        // Clear the source element properly
        const sourceElement = video.querySelector('source');
        if (sourceElement) {
            sourceElement.src = '';
            video.load(); // Need to reload after changing source
        } else {
            video.src = ''; // Fallback
        }
        
        modal.style.display = 'none';
        isModalOpen = false;
        currentCharacterId = null; // Reset current character ID
    });
    
    // Video ended event listeners
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
    
    // Alternative onended approach for older browsers
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
        
        const gridColumns = 3;
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
        }
    });
    
    // Handle modal click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeButton.click();
        }
    });
    
    // Image Modal Functionality - UPDATED VERSION
    const photoBoxes = document.querySelectorAll('.photo-box');
    if (photoBoxes.length > 0) {
        const imageModal = document.getElementById('imageModal');
        const fullSizeImage = document.getElementById('fullSizeImage');
        const imageCloseButton = document.getElementById('imageCloseButton');
        
        // Make sure these elements exist
        if (imageModal && fullSizeImage && imageCloseButton) {
            // Make sure the modal and close button are properly hidden at start
            imageModal.style.display = 'none';
            imageCloseButton.style.opacity = '0'; // Hide the close button initially
            
            // Add click event to each photo box
            photoBoxes.forEach(box => {
                box.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const img = this.querySelector('img');
                    if (img) {
                        // Set the full-size image source
                        fullSizeImage.src = img.src;
                        fullSizeImage.alt = "";
                        
                        // Display the modal with theater mode effect
                        imageModal.style.display = 'flex';
                        imageModal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)'; // Darker background
                        
                        // Animate the appearance for theater effect
                        setTimeout(() => {
                            imageModal.style.opacity = '1';
                            imageCloseButton.style.opacity = '1'; // Show the close button
                        }, 10);
                        
                        document.body.classList.add('modal-open');
                        
                        // Prevent scrolling
                        document.body.style.overflow = 'hidden';
                    }
                });
            });
            
            // Close modal function
            function closeImageModal() {
                // Animate closing
                imageModal.style.opacity = '0';
                imageCloseButton.style.opacity = '0';
                
                // Delay the actual hiding to allow for animation
                setTimeout(() => {
                    imageModal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    
                    // Clear the image source when closed
                    setTimeout(() => {
                        fullSizeImage.src = '';
                    }, 300);
                }, 300); // Match transition duration
            }
            
            // Close modal when clicking the close button
            imageCloseButton.addEventListener('click', closeImageModal);
            
            // Close modal when clicking outside the image
            imageModal.addEventListener('click', function(e) {
                if (e.target === imageModal) {
                    closeImageModal();
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && imageModal.style.display === 'flex') {
                    closeImageModal();
                }
            });
        }
    }
    
    // Run a check of all video files at startup to see if they exist
    console.log("Checking if video files exist...");
    characterData.forEach(char => {
        checkVideoFile(char.video)
            .then(() => console.log(`✓ Video exists: ${char.video}`))
            .catch(err => console.error(`✗ ${err.message}`));
    });
// Handle on-screen controls - ONLY arrow buttons functional
document.querySelectorAll('.arrow-btn').forEach(button => {
    button.addEventListener('click', function() {
      const key = this.dataset.key;
      
      // Create and dispatch a keyboard event for arrow buttons only
      const event = new KeyboardEvent('keydown', {
        key: key,
        code: key,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      
      // Add visual feedback
      this.classList.add('active');
      setTimeout(() => {
        this.classList.remove('active');
      }, 200);
    });
  });
  
  // For action buttons (A, B, Start) - just visual feedback, no actions
  document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      // Prevent any default action or event propagation
      e.preventDefault();
      e.stopPropagation();
      
      // Just visual feedback to show the button works
      this.classList.add('active');
      setTimeout(() => {
        this.classList.remove('active');
      }, 200);
      
      // No keyboard event is dispatched
      return false;
    });
  });
// Konami code tracker - with START at the end
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA', 'Enter']; // 'Enter' is for START
let konamiCodePosition = 0;

// Function to check button presses against Konami code
function checkKonamiCode(buttonKey) {
  // Check if the button pressed matches the next key in the sequence
  if (buttonKey === konamiCode[konamiCodePosition]) {
    konamiCodePosition++;
    
    // If we've reached the end of the sequence, activate the easter egg
    if (konamiCodePosition === konamiCode.length) {
      activateKonamiEasterEgg();
      konamiCodePosition = 0; // Reset for next time
    }
  } else {
    konamiCodePosition = 0; // Reset if wrong button pressed
    
    // If they press Up again after failing, count it as first step
    if (buttonKey === konamiCode[0]) {
      konamiCodePosition = 1;
    }
  }
}

// Function to activate the easter egg effect
function activateKonamiEasterEgg() {
  console.log('KONAMI CODE ACTIVATED!');
  
  // Create glowing border overlay
  const glowOverlay = document.createElement('div');
  glowOverlay.className = 'konami-glow-overlay';
  document.body.appendChild(glowOverlay);
  
  // Change background gradient
  document.body.classList.add('konami-active');
  
  // Remove effect after 5 seconds
  setTimeout(() => {
    document.body.removeChild(glowOverlay);
    document.body.classList.remove('konami-active');
  }, 5000);
}

// Handle on-screen controls - unified handler for ALL buttons
document.querySelectorAll('.arrow-btn, .action-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    // Prevent any default action
    e.preventDefault();
    
    const key = this.dataset.key;
    
    // Check for Konami code
    checkKonamiCode(key);
    
    // Only dispatch keyboard events for arrow buttons (for navigation)
    if (this.classList.contains('arrow-btn')) {
      const event = new KeyboardEvent('keydown', {
        key: key,
        code: key,
        bubbles: true
      });
      document.dispatchEvent(event);
    }
    
    // Visual feedback for all buttons
    this.classList.add('active');
    setTimeout(() => {
      this.classList.remove('active');
    }, 200);
  });
});

});