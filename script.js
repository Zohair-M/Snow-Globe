const globe = document.getElementById("snow-globe");
const bgMusic = document.getElementById("bg-music");
const shakeSound = document.getElementById("shake-sound");
const muteBtn = document.getElementById("mute-btn");
const speedSlider = document.getElementById("speed-slider");

// Customizer Selectors
const charSelect = document.getElementById("char-select");
const themeSelect = document.getElementById("theme-select");
const musicSelect = document.getElementById("music-select");
const focalPoint = document.getElementById("focal-point");

// File Upload Selectors
const bgUpload = document.getElementById("bg-upload");
const musicUpload = document.getElementById("music-upload");

let isMuted = false;
let particles;
let musicStarted = false;

// Variables to store custom user URLs
let customBgUrl = "";
let customMusicUrl = "";

// Function for calculating Gyro Activity
function calculateAcceleration(event) {
    const { x, y, z } = event.accelerationIncludingGravity;
    const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z);
    return accelerationMagnitude;
}

// Shake action: play particles, play sounds, and trigger CSS keyframe Animation
function shakeItUp() {
    // 1. Play Background Music on first click/shake
    if (!musicStarted) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
        musicStarted = true;
    }

    // 2. Play the quick shake sound effect
    if (shakeSound) {
        shakeSound.currentTime = 0;
        shakeSound.volume = 0.6;
        shakeSound.play();
    }

    // 3. Play particles
    if (particles) {
        particles.play();
    }

    // 4. Trigger CSS shake animation
    globe.classList.add("shake");
    setTimeout(() => {
        globe.classList.remove("shake");
    }, 1100);
}

// Load Particles using the tsParticles library
tsParticles.loadJSON('particles', 'particles.json')
    .then(function () {
        particles = tsParticles.domItem(0);
        particles.pause();

        // Trigger on Click/Touch 
        globe.addEventListener("click", () => shakeItUp());

        // Trigger on Device Motion (Gyroscope)
        window.addEventListener("devicemotion", (event) => {
            const accelerationMagnitude = calculateAcceleration(event);
            if (accelerationMagnitude > 23) {
                shakeItUp();
            }
        });
    })
    .catch((error) => {
        console.error("Failed to load particle configuration:", error);
    });

// Mute Button listener
muteBtn.addEventListener("click", (event) => {
    event.stopPropagation(); 
    
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    shakeSound.muted = isMuted;
    
    muteBtn.textContent = isMuted ? "🔇 Unmute" : "🔊 Mute";
});

// Wind speed slider listener
speedSlider.addEventListener("input", (event) => {
    if (!particles) return;
    const newSpeed = parseFloat(event.target.value);
    particles.options.particles.move.speed = newSpeed;
    particles.refresh();
});

// 1. Character Dropdown listener
charSelect.addEventListener("change", (event) => {
    focalPoint.textContent = event.target.value;
});

// 2. Sky Theme Dropdown listener
const themes = ["theme-night", "theme-sunset", "theme-aurora", "theme-spooky"];
themeSelect.addEventListener("change", (event) => {
    // Remove previous theme classes
    themes.forEach(theme => globe.classList.remove(theme));
    
    // Clear custom background image if choosing a preset
    if (event.target.value !== "custom") {
        globe.style.backgroundImage = "";
        globe.classList.add(event.target.value);
    } else if (customBgUrl) {
        // Re-apply custom background if "Custom Sky" is re-selected
        globe.style.backgroundImage = `url(${customBgUrl})`;
        globe.style.backgroundSize = "cover";
        globe.style.backgroundPosition = "center";
    }
});

// 3. Music Track Dropdown listener
musicSelect.addEventListener("change", (event) => {
    const wasPlaying = !bgMusic.paused;
    
    bgMusic.src = event.target.value;
    bgMusic.load();
    
    if (wasPlaying && musicStarted) {
        bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
    }
});

// 4. Custom Background Upload Handler
bgUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        // Generate a local browser URL for the uploaded image
        customBgUrl = URL.createObjectURL(file);
        
        // Clear active theme classes and apply image
        themes.forEach(theme => globe.classList.remove(theme));
        globe.style.backgroundImage = `url(${customBgUrl})`;
        globe.style.backgroundSize = "cover";
        globe.style.backgroundPosition = "center";

        // Add/select a custom option in the theme dropdown
        let customOption = document.getElementById("custom-bg-option");
        if (!customOption) {
            customOption = document.createElement("option");
            customOption.id = "custom-bg-option";
            customOption.value = "custom";
            themeSelect.appendChild(customOption);
        }
        customOption.textContent = "🖼️ Custom Sky";
        themeSelect.value = "custom";
    }
});

// 5. Custom Music Upload Handler
musicUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        // Generate a local browser URL for the uploaded song
        customMusicUrl = URL.createObjectURL(file);
        const wasPlaying = !bgMusic.paused;

        bgMusic.src = customMusicUrl;
        bgMusic.load();

        // Add/select a custom option in the music dropdown
        let customOption = document.getElementById("custom-music-option");
        if (!customOption) {
            customOption = document.createElement("option");
            customOption.id = "custom-music-option";
            musicSelect.appendChild(customOption);
        }
        // Truncate name if it's too long
        const displayName = file.name.length > 15 ? file.name.substring(0, 12) + "..." : file.name;
        customOption.textContent = `🎵 ${displayName}`;
        customOption.value = customMusicUrl;
        musicSelect.value = customMusicUrl;

        if (wasPlaying && musicStarted) {
            bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
        }
    }
});