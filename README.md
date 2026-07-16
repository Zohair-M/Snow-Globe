# Custom Digital Snow Globe

This is a web-based digital snow globe project I built for a Hack Club Jam(Used the tutorial). You can customize almost everything about it change the character inside, pick different weather patterns, design a custom gradient background, or even upload your own music and images. You can also type a custom message and generate a shareable link to send to your friends.

## What it can do

* **Shake it up:** You can click/tap to shake the globe on desktop, or shake your physical phone using the mobile gyroscope.
* **Infinite characters:** Choose a preset character (like the snowman) or type in any emoji or symbol you want to put inside the globe.
* **Custom weather:** Make standard snow fall, or type custom emojis (like 🍕 or 🦖) to rain down from the sky.
* **Dynamic sky gradients:** Use the built-in color wheels to pick any two colors and blend your own background sky in real-time.
* **Upload your own files:** You can upload your own custom background images or custom music files directly from your computer or phone.
* **Shareable greeting cards:** You can type a quick message in the "Share" menu to generate a custom link. When a friend opens the link, your custom message will float inside the globe with your exact background, character, and speed settings.
* **Music & mute:** Toggle between cozy ambient tracks or your uploaded audio, with a mute button in the top corner.

## How it was built

I built this project using HTML, CSS, and vanilla JavaScript. 
* The custom falling physics and emoji rain are powered by the **tsParticles** library.
* The design is built using CSS flexbox, native HTML5 color pickers, and glassmorphic reflection overlays.
* The local image and music uploads are handled offline using browser-based Object URLs, meaning no servers or databases are required to run the app.
* The sharing system parses the URL parameters on load to reconstruct the sender's exact globe configuration.

## AI Disclosure

I used AI to assist with debugging the tsParticles configuration, resolving a scope issue with the custom audio player, and setting up the responsive layout for the control dock(Also the README.md before but not now).
