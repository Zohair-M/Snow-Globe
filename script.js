const globe = document.getElementById("snow-globe");
const bgMusic = document.getElementById("bg-music");
const shakeSound = document.getElementById("shake-sound");
const muteBtn = document.getElementById("mute-btn");
const speedSlider = document.getElementById("speed-slider");

let isMuted = false;
let particles;
let musicStarted = false;

// Double-click to toggle Sunset Theme
globe.addEventListener("dblclick", () => {
    globe.classList.toggle("sunset-theme");
});

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
        bgMusic.volume = 0.4; // Set background music volume (0.0 to 1.0)
        bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
        musicStarted = true;
    }

    // 2. Play the quick shake sound effect
    if (shakeSound) {
        shakeSound.currentTime = 0; // Reset sound to the start if clicked rapidly
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
    // Prevent the click from bubbling down to the globe and shaking it
    event.stopPropagation(); 
    
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    shakeSound.muted = isMuted;
    
    // Update button text / icon
    muteBtn.textContent = isMuted ? "🔇 Unmute" : "🔊 Mute";
});

// Wind speed slider listener
speedSlider.addEventListener("input", (event) => {
    // Safety check: Don't run if particles are still loading
    if (!particles) return;
    
    const newSpeed = parseFloat(event.target.value);
    // Dynamically update the speed of tsParticles
    particles.options.particles.move.speed = newSpeed;
    particles.refresh(); // Tells tsParticles to apply the changes
});