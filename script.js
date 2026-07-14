const globe = document.getElementById("snowglobe");
let particles;

// Function for calculating Gyro Activity
function calculateAcceleration(event) {
    const {x, y, z} = event.accelerationIncludingGravity;
    //Calculate three-dimensional acceleration magnitude
    const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z);
    return accelerationMagnitude;
}

// Shake action: play particles and trigger CSS keyframe Animaton
function ShakeITUP() {
    if (particles) {
        particles.play();
    }
    globe.classList.add("shake");

    // Remove the class after the animation finishes (1100ms)
    setTimeout(() => {
        globe.classList.remove("shake");
    }, 1100);
}

//Load Particles using he TsParticles library
tsParticles.loadJSON('particles', 'particles.json')
    .then(function () {
        // Select Particle instance and pause initailly until shaken or clicked
        particles = tsParticles.domItem(0);
        particles.pause();

        // Trigger on CLick/Touch 
        globe.addEventListener("click", () => ShakeITUP());

        // Trigger on DEvice Motion (Gyroscope)
        window.addEventListener("devicemotion", (event) => {
            const accelerationMagnitude = calculateAcceleration(event);
            // If the acceleration magnitude exceeds a certain threshold, trigger the shake action
            if (accelerationMagnitude > 23) {
                ShakeITUP();
            }
        });
    })
    .catch((error) => {
    console.error("Failed to load particle configuration:", error);
  });