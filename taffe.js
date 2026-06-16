document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    //  AFFICHAGE DYNAMIQUE DU NOM DE L'UTILISATEUR
    // ==========================================
    const nomUtilisateurEl = document.querySelector('.nom-utilisateur');
    // On va chercher le nom de l'utilisateur connecté
    const utilisateurConnecte = localStorage.getItem('pycompta_current_user');

    if (nomUtilisateurEl && utilisateurConnecte) {
        // On remplace "May" par le vrai nom trouvé dans le localStorage
        nomUtilisateurEl.textContent = utilisateurConnecte;
    } else if (nomUtilisateurEl) {
        // Si aucun utilisateur n'est connecté (accès direct sans login), on peut mettre un texte par défaut
        nomUtilisateurEl.textContent = "Invité";
    }

    // ==========================================
    //  ÉCRAN DE BIENVENUE (ACCUEIL)
    // ==========================================
    const ecranAccueil = document.getElementById('ecran-accueil');
    if (ecranAccueil) {
        // Vérifie si l'utilisateur vient de se connecter
        if (sessionStorage.getItem("justLoggedIn") === "true") {
            sessionStorage.removeItem("justLoggedIn");
            
            setTimeout(() => {
                ecranAccueil.classList.add("fade-out");
                setTimeout(() => ecranAccueil.style.display = "none", 800);
            }, 1500);
        } else {
            // Si on est déjà connecté, on cache l'écran immédiatement
            ecranAccueil.style.display = "none";
        }
    }

    // ==========================================
    //  NAVIGATION & MENU MOBILE
    // ==========================================
    const liensNavigation = document.querySelectorAll('.lien-navigation[data-tab]');
    const pagesContenu = document.querySelectorAll('.page-contenu');

    liensNavigation.forEach(lien => {
        lien.addEventListener('click', () => {
            liensNavigation.forEach(l => l.classList.remove('active'));
            pagesContenu.forEach(p => p.classList.remove('active'));

            lien.classList.add('active');
            const tabId = lien.getAttribute('data-tab');
            document.getElementById(tabId)?.classList.add('active');
        });
    });

    const boutonHamburger = document.getElementById('boutonHamburger');
    const menuNavigation = document.querySelector('.menu-navigation');

    if (boutonHamburger && menuNavigation) {
        boutonHamburger.addEventListener('click', () => {
            menuNavigation.classList.toggle('open');
        });
    }

    // ==========================================
    //  ANIMATIONS DE CHARGEMENT & REDIRECTIONS
    // ==========================================
    const chargeur = document.getElementById("chargeur-ecran");
    const generateBtn = document.getElementById("generateBtn");
    const triggerBtn = document.getElementById('triggerBtn');

    if (generateBtn && chargeur) {
        generateBtn.addEventListener('click', () => {
            chargeur.classList.add("active");
            
            setTimeout(() => {
                chargeur.classList.remove("active");
                window.location.href = 'et.html';
                alert("États financiers générés avec succès !");
            }, 2500);
        });
    }

    if (triggerBtn) {
        const overlayTheme = document.getElementById('overlay-transition-theme');
        const modeText = document.getElementById('modeText');
        const modeIcon = document.getElementById('modeIcon');

        triggerBtn.addEventListener('click', () => {
            if (overlayTheme) overlayTheme.classList.add('active');
            if (modeText) modeText.textContent = "CHARGEMENT...";
            if (modeIcon) modeIcon.className = "fas fa-spinner fa-spin";

            setTimeout(() => window.location.href = 'per.html', 800);
        });
    }

    // ==========================================
    //  MOTEUR COMPTABLE (OHADA) & GRAPHIQUE
    // ==========================================
    function rafraichirTableauDeBord() {
        const journal = JSON.parse(localStorage.getItem('py_compta_db')) || [];
        
        let totalActifs = 0, totalPassifs = 0, totalProduits = 0, totalCharges = 0;
        const donneesGraphe = {};

        journal.forEach(ecriture => {
            const compte = ecriture.account.toString();
            const debit = parseFloat(ecriture.debit || 0);
            const credit = parseFloat(ecriture.credit || 0);
            const date = ecriture.date;

            if (!donneesGraphe[date]) donneesGraphe[date] = { produits: 0, charges: 0 };

            if (compte.match(/^(2|3|5|41)/)) {         
                totalActifs += (debit - credit);
            } else if (compte.match(/^(1|16|40)/)) {   
                totalPassifs += (credit - debit);
            } else if (compte.startsWith('7')) {       
                totalProduits += credit;
                donneesGraphe[date].produits += credit;
            } else if (compte.startsWith('6')) {       
                totalCharges += debit;
                donneesGraphe[date].charges += debit;
            }
        });

        const resultatNet = totalActifs - totalPassifs;
        const elementResultat = document.getElementById('dash-produits');
        const carteResultat = document.getElementById('bran');
        const affichageActifs = document.getElementById('dash-actifs');
        const affichagePassifs = document.getElementById('dash-passifs');

        if (affichageActifs) affichageActifs.innerHTML = `${totalActifs.toLocaleString()} <small>FC</small>`;
        if (affichagePassifs) affichagePassifs.innerHTML = `${totalPassifs.toLocaleString()} <small>FC</small>`;
        if (elementResultat) elementResultat.innerHTML = `${resultatNet.toLocaleString()} <small>FC</small>`;

        if (resultatNet < 0 && elementResultat && carteResultat) {
            elementResultat.style.color = '#ef4444';
            carteResultat.style.background = '#ef44444a';
        }

        const zoneCanvas = document.getElementById('evolutionChart');
        if (!zoneCanvas) return; 

        const ctx = zoneCanvas.getContext('2d');
        const dates = Object.keys(donneesGraphe).sort();

        if (window.monGraphique) window.monGraphique.destroy();

        window.monGraphique = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Produits (recettes)',
                        data: dates.map(d => donneesGraphe[d].produits),
                        borderColor: '#f472b6',
                        backgroundColor: 'rgba(244, 114, 182, 0.2)',
                        fill: true,
                        tension: 0.4 
                    },
                    {
                        label: 'Charges (Dépenses)',
                        data: dates.map(d => donneesGraphe[d].charges),
                        borderColor: '#60a5fa',
                        backgroundColor: 'rgba(96, 165, 250, 0.2)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: 'white' } } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.6)' } },
                    x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.6)' } }
                }
            }
        });
    }

    rafraichirTableauDeBord();
});

// ==========================================
//  FONCTION DE DÉCONNEXION SÉCURISÉE
// ==========================================
function handleLogout() {
    // On efface l'utilisateur actif du stockage pour fermer la session
    localStorage.removeItem('pycompta_current_user');
    // Redirection vers la page de login
    window.location.href = 'login.html';
}