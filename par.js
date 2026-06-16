document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. GESTION DU MENU MOBILE (HAMBURGER)
    // ==========================================
    const bouton = document.getElementById("hamburgerBtn");
    const menu = document.querySelector(".menu-navigation");

    if (bouton && menu) {
        bouton.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("open");
            console.log("Menu mobile cliqué ! État ouvert :", menu.classList.contains("open"));
        });
    }

    // ==========================================
    // 2. GESTION DE LA MUSIQUE DE FOND
    // ==========================================
    const music = document.getElementById('music');
    const musicBtn = document.getElementById('musicBtn');

    if (music && musicBtn) {
        musicBtn.addEventListener('click', () => {
            const spanTexte = musicBtn.querySelector('span');
            if (music.paused) {
                music.play();
                musicBtn.style.background = "var(--smash-btn-gradient)";
                if (spanTexte) spanTexte.textContent = "Couper";
            } else {
                music.pause();
                musicBtn.style.background = "rgba(255,255,255,0.1)";
                if (spanTexte) spanTexte.textContent = "Activer";
            }
        });
    }

    // ==========================================
    // 3. REDIRECTIONS SECURISEES
    // ==========================================
    const bu = document.getElementById('but');
    if (bu) {
        bu.onclick = function () {
            window.location.href = 'compte.html';
        };
    }

    const triggerBtn = document.getElementById('triggerBtn');
    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            setTimeout(() => { 
                window.location.href = 'paie.html'; 
            }, 100);
        });
    }

    // ==========================================
    // 4. CHARGEMENT & SAUVEGARDE (LOCALSTORAGE)
    // ==========================================
    const nomEntrepriseInput = document.getElementById('nomEntreprise');
    const adresseEntrepriseInput = document.getElementById('adresseEntreprise');
    const rccmEntrepriseInput = document.getElementById('rccmEntreprise');

    // Chargement des données au démarrage
    const infosEntreprise = JSON.parse(localStorage.getItem('pycompta_entreprise_infos'));
    if (infosEntreprise) {
        if (nomEntrepriseInput) nomEntrepriseInput.value = infosEntreprise.nom || "";
        if (adresseEntrepriseInput) adresseEntrepriseInput.value = infosEntreprise.adresse || "";
        if (rccmEntrepriseInput) rccmEntrepriseInput.value = infosEntreprise.rccm || "";
    }

    // Enregistrement lors du clic
    const btnEnregistrer = document.getElementById('btnEnregistrer');
    if (btnEnregistrer) {
        btnEnregistrer.addEventListener('click', () => {
            const nomSaisi = nomEntrepriseInput ? nomEntrepriseInput.value : "";
            const adresseSaisie = adresseEntrepriseInput ? adresseEntrepriseInput.value : "";
            const rccmSaisi = rccmEntrepriseInput ? rccmEntrepriseInput.value : "";

            const nouvellesInfos = {
                nom: nomSaisi,
                adresse: adresseSaisie,
                rccm: rccmSaisi
            };

            localStorage.setItem('pycompta_entreprise_infos', JSON.stringify(nouvellesInfos));
            alert("Informations de l'entreprise enregistrées avec succès !");
        });
    }
});