// --- SÉCURITÉ ANTI-FRAUDE ---
// On vérifie si un gain est déjà enregistré dans la mémoire du navigateur
if (localStorage.getItem("prize")) {
    // Si oui, on remplace tout le contenu par un message de blocage
    document.addEventListener("DOMContentLoaded", () => {
        document.body.innerHTML = `
            <div class="card" style="margin: 50px auto; max-width: 400px; text-align: center;">
                <h1 style="color: #ff7b00;">Oups ! 🎡</h1>
                <p>La roue a déjà tourné pour vous.</p>
                <p>Vous avez gagné : <strong>${localStorage.getItem("prize")}</strong></p>
                <p>Cliquez ci-dessous pour finaliser votre demande.</p>
                <a href="claim.html" class="btn">Réclamer mon gift</a>
            </div>`;
    });
}
const wheel = document.getElementById("wheel")
const btn = document.getElementById("spinBtn")
const resultDiv = document.getElementById("result")
const claimBtn = document.getElementById("claimBtn")
const ctx = wheel.getContext("2d")

const prizes = ["120 Mo", "10 Go_Nuit", "1 Go", "2.5 Go", "1 Go_1h", "10 Go_7jours", "25 Go"]
const colors = ["#ff0000", "#ff7f00", "#f9f91cff", "#00ff00", "#1515f3ff", "#4b0082", "#961af4ff"]

let currentRotation = 0

// Force la transition CSS pour être sûr qu'on voit l'animation
wheel.style.transition = "transform 5s cubic-bezier(0.15, 0, 0.15, 1)";

function drawWheel() {
    const arc = (Math.PI * 2) / prizes.length
    ctx.clearRect(0, 0, 350, 350)
    for (let i = 0; i < prizes.length; i++) {
        ctx.beginPath()
        ctx.moveTo(175, 175)
        ctx.arc(175, 175, 175, i * arc - Math.PI / 2, (i + 1) * arc - Math.PI / 2)
        ctx.fillStyle = colors[i]
        ctx.fill()
        ctx.save()
        ctx.translate(175, 175)
        ctx.rotate(i * arc + arc / 2 - Math.PI / 2)
        ctx.fillStyle = (i === 2) ? "#333" : "white"
        ctx.textAlign = "right"
        ctx.font = "bold 16px Arial"
        ctx.fillText(prizes[i], 150, 10)
        ctx.restore()
    }
}

drawWheel()

btn.addEventListener("click", () => {
    // 1. DÉSACTIVATION IMMÉDIATE
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
    btn.innerText = "TOUR EN COURS...";

    resultDiv.innerText = "La roue tourne...";
    claimBtn.classList.add("hidden");

    const special = localStorage.getItem("special");
    let prizeIndex;

    // --- LOGIQUE DE SÉLECTION (RÉTABLIE) ---
    if (special === "yes") {
        prizeIndex = 5; // Force 10 Go_7jours
    } else {
        // Sélectionne au hasard parmis les 5 premiers prix (exclut 10Go et 25Go)
        prizeIndex = Math.floor(Math.random() * 5); 
    }

    const segment = 360 / prizes.length;
    
    // Calcul de l'angle pour que l'index choisi finisse SOUS le pointeur (en haut)
    const stopAngle = (360 - (prizeIndex * segment)) - (segment / 2);
    
    // On ajoute 5 tours complets (1800°)
    currentRotation = Math.ceil(currentRotation / 360) * 360 + 1800 + stopAngle;

    // Déclenche l'animation
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const prize = prizes[prizeIndex];
        localStorage.setItem("prize", prize);
        
        resultDiv.innerText = "La roue s'est arrêtée 🎉";
        claimBtn.classList.remove("hidden");
        btn.innerText = "DÉJÀ JOUÉ";

        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });

        // On ne réactive PAS btn.disabled ici pour empêcher de rejouer
    }, 5000);
});