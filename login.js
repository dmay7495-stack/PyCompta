// 1. On stocke temporairement une info dans le navigateur
sessionStorage.setItem("justLoggedIn", "true");
function handleLogin() {
    // 1. RÉCUPÉRATION : On attrape tous les éléments de notre page HTML
    const utilisateur = document.getElementById('nomUtilisateur');
    const motDePasse  = document.getElementById('motDePasse');
    const bouton = document.getElementById('boutonConnexion');
    const message = document.getElementById('messageStatut');
    const carte = document.getElementById('carte');
    const fond = document.getElementById('corpsPrincipal');

    const nomSaisi = utilisateur.value.trim();
    const mdpSaisi = motDePasse.value;

    // 2. BASE DE DONNÉES : On récupère les utilisateurs inscrits via sign.html
    let utilisateursInscrits = JSON.parse(localStorage.getItem('pycompta_users')) || {};

    // 3. VÉRIFICATIONS : Compte admin par défaut OU compte inscrit dans le localStorage
    const estAdmin = (nomSaisi.toLowerCase() === "may" && mdpSaisi === "smash");
    const estUtilisateurInscrit = (utilisateursInscrits[nomSaisi] && utilisateursInscrits[nomSaisi].password === mdpSaisi);

    if (estAdmin || estUtilisateurInscrit) {
        // --- CAS NUMÉRO 1 : TOUT EST BON ---
        
        // On choisit le nom exact à afficher dans le tableau de bord
        const nomA_Afficher = estAdmin ? "May" : nomSaisi;
        
        // On stocke les infos de session de manière sécurisée au moment du succès
        localStorage.setItem('pycompta_current_user', nomA_Afficher); // Pour afficher le nom sur taffe.html
        sessionStorage.setItem("justLoggedIn", "true");              // Pour déclencher l'écran de bienvenue

        message.innerText = "Accès autorisé...";
        message.style.color = "#10b981";      
        carte.style.opacity = "0";            
        carte.style.transform = "scale(0.9)";

        // On attend 0,6 seconde (le temps de l'animation) puis on change de page
        setTimeout(() => {
            window.location.href = "taffe.html";
        }, 600);

    } else {
        // --- CAS NUMÉRO 2 : C'EST FAUX ---
        message.innerText = "ACCÈS REFUSÉ - IDENTIFIANTS INCORRECTS";
        message.style.color = "#ff4d4d";

        // On active les classes CSS d'erreur (fond rouge, bouton rouge, tremblement)
        fond.classList.add('error-mode');
        carte.classList.add('shake');
        bouton.classList.add('btn-error');
        utilisateur.classList.add('input-error');
        motDePasse.classList.add('input-error');

        // On retire l'animation de tremblement (shake) après 0.5s pour pouvoir la rejouer au prochain clic raté
        setTimeout(() => {
            carte.classList.remove('shake');
        }, 500);

        // Au bout de 4 secondes, on calme le jeu et on remet l'interface par défaut
        setTimeout(() => {
            fond.classList.remove('error-mode');
            bouton.classList.remove('btn-error');
            utilisateur.classList.remove('input-error');
            motDePasse.classList.remove('input-error');
            message.innerText = "Identification requise";
            message.style.color = "#d9e88a";
        }, 4000);
    }
}