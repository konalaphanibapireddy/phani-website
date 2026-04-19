function showSurprise() {
    // Show surprise
    document.getElementById("surpriseBox").style.display = "block";

    // Play music
    const music = document.getElementById("birthdayMusic");
    music.play();

    // Play video
    const video = document.getElementById("birthdayVideo");
    video.play();

    // Balloons
    createBalloons();
}

function createBalloons() {
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");

        balloon.style.left = Math.random() * window.innerWidth + "px";
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        balloon.style.animationDuration = (4 + Math.random() * 3) + "s";

        document.body.appendChild(balloon);
    }
}