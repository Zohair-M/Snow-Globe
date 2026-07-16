const globe = document.getElementById("snow-globe");
const bgMusic = document.getElementById("bg-music");
const shakeSound = document.getElementById("shake-sound");
const muteBtn = document.getElementById("mute-btn");
const speedSlider = document.getElementById("speed-slider");

// Customizer Selectors
const charSelect = document.getElementById("char-select");
const themeSelect = document.getElementById("theme-select");
const musicSelect = document.getElementById("music-select");
const weatherSelect = document.getElementById("weather-select");
const focalPoint = document.getElementById("focal-point");
const greetingMessage = document.getElementById("greeting-message");

// Dynamic Custom Inputs
const customCharInput = document.getElementById("custom-char-input");
const customWeatherInput = document.getElementById("custom-weather-input");
const gradientPickers = document.getElementById("gradient-pickers");
const gradientColor1 = document.getElementById("gradient-color1");
const gradientColor2 = document.getElementById("gradient-color2");

// File Upload Selectors
const bgUpload = document.getElementById("bg-upload");
const musicUpload = document.getElementById("music-upload");

// Share Modal Selectors
const shareBtn = document.getElementById("share-btn");
const shareModal = document.getElementById("share-modal");
const closeBtn = document.querySelector(".close-btn");
const shareMsgInput = document.getElementById("share-msg-input");
const generateLinkBtn = document.getElementById("generate-link-btn");
const shareStatusMsg = document.getElementById("share-status-msg");

let isMuted = false;
let particles;
let musicStarted = false;
let customBgUrl = "";
let customMusicUrl = "";

const themes = ["theme-night", "theme-sunset", "theme-aurora", "theme-spooky"];

// Load query settings if opening a shared link
function loadSharedSettings() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const sharedMsg = urlParams.get("msg");
    const sharedChar = urlParams.get("char");
    const sharedTheme = urlParams.get("theme");
    const sharedSpeed = urlParams.get("speed");
    const sharedWeather = urlParams.get("weather");
    
    if (sharedMsg) {
        greetingMessage.textContent = decodeURIComponent(sharedMsg);
    }
    
    if (sharedChar) {
        const charVal = decodeURIComponent(sharedChar);
        const presets = ["⛄", "🎄", "🏠", "🦌", "🦖"];
        if (!presets.includes(charVal)) {
            charSelect.value = "custom";
            customCharInput.style.display = "inline-block";
            customCharInput.value = charVal;
            focalPoint.textContent = charVal;
        } else {
            charSelect.value = charVal;
            focalPoint.textContent = charVal;
        }
    }
    
    if (sharedTheme) {
        const themeVal = decodeURIComponent(sharedTheme);
        if (themes.includes(themeVal)) {
            themes.forEach(theme => globe.classList.remove(theme));
            globe.classList.add(themeVal);
            themeSelect.value = themeVal;
        } else if (themeVal.startsWith("gradient_")) {
            const parts = themeVal.split("_");
            if (parts.length === 3) {
                themeSelect.value = "custom";
                gradientPickers.style.display = "inline-flex";
                gradientColor1.value = "#" + parts[1];
                gradientColor2.value = "#" + parts[2];
                applyCustomGradient("#" + parts[1], "#" + parts[2]);
            }
        }
    }
    
    if (sharedSpeed) {
        speedSlider.value = sharedSpeed;
    }

    if (sharedWeather) {
        const weatherVal = decodeURIComponent(sharedWeather);
        const weatherPresets = ["snow", "sparkles", "hearts", "leaves", "candy"];
        if (!weatherPresets.includes(weatherVal)) {
            weatherSelect.value = "custom";
            customWeatherInput.style.display = "inline-block";
            customWeatherInput.value = weatherVal;
        } else {
            weatherSelect.value = weatherVal;
        }
    }
}
loadSharedSettings();

// Helper to apply background gradients
function applyCustomGradient(c1, c2) {
    globe.style.backgroundImage = `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`;
}

// Update the tsParticles weather options dynamically
function applyWeatherStyle(style) {
    if (!particles) return;

    if (style === "snow") {
        particles.options.particles.shape.type = "circle";
        particles.options.particles.color.value = "#ffffff";
        particles.options.particles.size.value = { min: 1, max: 5 };
    } else if (style === "sparkles") {
        particles.options.particles.shape.type = "star";
        particles.options.particles.color.value = "#ffd700";
        particles.options.particles.size.value = { min: 2, max: 6 };
    } else if (style === "hearts") {
        particles.options.particles.shape.type = "character";
        particles.options.particles.shape.options = {
            character: { value: ["💖", "💕", "❤️"], font: "Arial" }
        };
        particles.options.particles.size.value = { min: 8, max: 16 };
    } else if (style === "leaves") {
        particles.options.particles.shape.type = "character";
        particles.options.particles.shape.options = {
            character: { value: ["🍁", "🍂", "🍃"], font: "Arial" }
        };
        particles.options.particles.size.value = { min: 10, max: 20 };
    } else if (style === "candy") {
        particles.options.particles.shape.type = "character";
        particles.options.particles.shape.options = {
            character: { value: ["🍬", "🍭", "🍫"], font: "Arial" }
        };
        particles.options.particles.size.value = { min: 10, max: 20 };
    } else {
        const emojiArray = Array.from(style);
        particles.options.particles.shape.type = "character";
        particles.options.particles.shape.options = {
            character: { value: emojiArray.length > 0 ? emojiArray : ["❄️"], font: "Arial" }
        };
        particles.options.particles.size.value = { min: 12, max: 22 };
    }
    particles.refresh();
}

// Function for calculating Gyro Activity
function calculateAcceleration(event) {
    const { x, y, z } = event.accelerationIncludingGravity;
    const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z);
    return accelerationMagnitude;
}

// Shake action: play particles, play sounds, and trigger CSS keyframe Animation
function shakeItUp() {
    if (!musicStarted) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
        musicStarted = true;
    }

    if (shakeSound) {
        shakeSound.currentTime = 0;
        shakeSound.volume = 0.6;
        shakeSound.play();
    }

    if (particles) {
        particles.play();
    }

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

        const urlParams = new URLSearchParams(window.location.search);
        const sharedSpeed = urlParams.get("speed");
        const sharedWeather = urlParams.get("weather");

        if (sharedSpeed && particles) {
            particles.options.particles.move.speed = parseFloat(sharedSpeed);
        }

        if (sharedWeather && particles) {
            applyWeatherStyle(decodeURIComponent(sharedWeather));
        } else {
            particles.refresh();
        }

        globe.addEventListener("click", () => shakeItUp());

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

// Character Selection Listener
charSelect.addEventListener("change", (event) => {
    if (event.target.value === "custom") {
        customCharInput.style.display = "inline-block";
        focalPoint.textContent = customCharInput.value || "🦄";
    } else {
        customCharInput.style.display = "none";
        focalPoint.textContent = event.target.value;
    }
});

// Real-time custom character input listener
customCharInput.addEventListener("input", (event) => {
    focalPoint.textContent = event.target.value.trim() || "🦄";
});

// Sky Theme Selection Listener
themeSelect.addEventListener("change", (event) => {
    themes.forEach(theme => globe.classList.remove(theme));
    globe.style.backgroundImage = "";
    
    if (event.target.value === "custom") {
        gradientPickers.style.display = "inline-flex";
        applyCustomGradient(gradientColor1.value, gradientColor2.value);
    } else {
        gradientPickers.style.display = "none";
        if (event.target.value === "user-uploaded") {
            globe.style.backgroundImage = `url(${customBgUrl})`;
            globe.style.backgroundSize = "cover";
            globe.style.backgroundPosition = "center";
        } else {
            globe.classList.add(event.target.value);
        }
    }
});

// Real-time Color Picker listeners
function handleColorChange() {
    if (themeSelect.value === "custom") {
        applyCustomGradient(gradientColor1.value, gradientColor2.value);
    }
}
gradientColor1.addEventListener("input", handleColorChange);
gradientColor2.addEventListener("input", handleColorChange);

// Weather Style Selection Listener
weatherSelect.addEventListener("change", (event) => {
    if (event.target.value === "custom") {
        customWeatherInput.style.display = "inline-block";
        applyWeatherStyle(customWeatherInput.value || "🍕");
    } else {
        customWeatherInput.style.display = "none";
        applyWeatherStyle(event.target.value);
    }
});

// Real-time custom weather input listener
customWeatherInput.addEventListener("input", (event) => {
    applyWeatherStyle(event.target.value.trim() || "🍕");
});

// Music Track Dropdown listener
musicSelect.addEventListener("change", (event) => {
    const wasPlaying = !bgMusic.paused;
    bgMusic.src = event.target.value;
    bgMusic.load();
    if (wasPlaying && musicStarted) {
        bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
    }
});

// Custom Background Upload Handler
bgUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        customBgUrl = URL.createObjectURL(file);
        themes.forEach(theme => globe.classList.remove(theme));
        globe.style.backgroundImage = `url(${customBgUrl})`;
        globe.style.backgroundSize = "cover";
        globe.style.backgroundPosition = "center";

        let customOption = document.getElementById("custom-bg-option");
        if (!customOption) {
            customOption = document.createElement("option");
            customOption.id = "custom-bg-option";
            customOption.value = "user-uploaded";
            themeSelect.appendChild(customOption);
        }
        customOption.textContent = "🖼️ Custom Uploaded Sky";
        themeSelect.value = "user-uploaded";
    }
});

// Custom Music Upload Handler
musicUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        customMusicUrl = URL.createObjectURL(file);
        const wasPlaying = !bgMusic.paused;
        bgMusic.src = customMusicUrl;
        bgMusic.load();

        let customOption = document.getElementById("custom-music-option");
        if (!customOption) {
            customOption = document.createElement("option");
            customOption.id = "custom-music-option";
            musicSelect.appendChild(customOption);
        }
        const displayName = file.name.length > 15 ? file.name.substring(0, 12) + "..." : file.name;
        customOption.textContent = `🎵 ${displayName}`;
        customOption.value = customMusicUrl;
        musicSelect.value = customMusicUrl;

        if (wasPlaying && musicStarted) {
            bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
        }
    }
});

/* Modal & Sharing logic */
shareBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    shareModal.style.display = "flex";
    shareStatusMsg.style.display = "none";
});

closeBtn.addEventListener("click", () => {
    shareModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === shareModal) {
        shareModal.style.display = "none";
    }
});

generateLinkBtn.addEventListener("click", () => {
    const base = window.location.origin + window.location.pathname;
    
    const msg = encodeURIComponent(shareMsgInput.value.trim());
    
    // Evaluate if sharing a custom value vs standard preset value
    const finalChar = (charSelect.value === "custom") ? customCharInput.value.trim() : charSelect.value;
    const finalWeather = (weatherSelect.value === "custom") ? customWeatherInput.value.trim() : weatherSelect.value;
    
    let finalTheme = themeSelect.value;
    if (themeSelect.value === "custom") {
        const c1 = gradientColor1.value.replace("#", "");
        const c2 = gradientColor2.value.replace("#", "");
        finalTheme = `gradient_${c1}_${c2}`;
    }

    const speed = speedSlider.value;
    
    // Construct link
    let shareUrl = `${base}?char=${encodeURIComponent(finalChar)}&theme=${encodeURIComponent(finalTheme)}&speed=${speed}&weather=${encodeURIComponent(finalWeather)}`;
    if (msg) {
        shareUrl += `&msg=${msg}`;
    }
    
    // Copy link
    navigator.clipboard.writeText(shareUrl)
        .then(() => {
            shareStatusMsg.textContent = "📋 Link copied to your clipboard!";
            shareStatusMsg.style.display = "block";
            if (shareMsgInput.value.trim()) {
                greetingMessage.textContent = shareMsgInput.value.trim();
            }
            setTimeout(() => {
                shareModal.style.display = "none";
            }, 1500);
        })
        .catch(err => {
            console.error("Clipboard copy failed: ", err);
            shareStatusMsg.textContent = "Unable to copy link automatically. Please copy your browser's address bar.";
            shareStatusMsg.style.display = "block";
        });
});