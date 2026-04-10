const form = document.getElementById("registerForm")

// 🔥 METS ICI TON NUMÉRO GAGNANT
const numeroGagnant = "0998239895"

form.addEventListener("submit", (e) => {
    e.preventDefault()

    // .trim() permet d'enlever les espaces accidentels avant ou après
    const prenom = document.getElementById("prenom").value.trim()
    const numero = document.getElementById("numero").value.trim()

    // 1. SÉCURITÉ : On empêche ce numéro de s'inscrire deux fois
    if (localStorage.getItem("deja_inscrit_" + numero)) {
        alert("Désolé, ce numéro a déjà été utilisé pour participer !")
        return // On arrête tout ici, il n'ira pas vers la roue
    }

    // 2. STOCKAGE DES INFOS POUR LE MAIL FINAL
    localStorage.setItem("user_prenom", prenom)
    localStorage.setItem("user_tel", numero)

    // 3. VÉRIFICATION DU PRIX SPÉCIAL
    if (numero === numeroGagnant) {
        localStorage.setItem("special", "yes")
    } else {
        localStorage.setItem("special", "no")
    }

    // 4. VERROUILLAGE DÉFINITIF
    // On crée une marque indélébile pour ce numéro sur ce navigateur
    localStorage.setItem("deja_inscrit_" + numero, "oui")

    // 5. DIRECTION LA ROUE
    window.location.href = "wheel.html"
})