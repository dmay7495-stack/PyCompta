// Fonction utilitaire pour cibler les ID plus rapidement
const $ = id => document.getElementById(id);

function gererBilan() {
    const journal = JSON.parse(localStorage.getItem('py_compta_db')) || [];
    const balances = {};
    
    // Calcul des soldes par compte
    journal.forEach(e => balances[e.account] = (balances[e.account] || 0) + (e.debit - e.credit));

    const corpsActif = $('corpsActif'), corpsPassif = $('corpsPassif');
    let tActif = 0, tPassif = 0, tCharges = 0, tProduits = 0;

    corpsActif.innerHTML = corpsPassif.innerHTML = "";

    Object.keys(balances).sort().forEach(acc => {
        const solde = balances[acc];
        if (!solde) return;

        const code = acc[0], val = Math.abs(solde), strVal = val.toLocaleString();

        // Classement Actif
        if (['2', '3', '5'].includes(code) || acc.startsWith('41')) {
            corpsActif.innerHTML += `<tr><td>${acc} - Poste Actif</td><td class="montant">${strVal}</td></tr>`;
            tActif += val;
        } 
        // Classement Passif
        else if (code === '1' || acc.startsWith('40')) {
            corpsPassif.innerHTML += `<tr><td>${acc} - Poste Passif</td><td class="montant montant-passif">${strVal}</td></tr>`;
            tPassif += val;
        } 
        // Gestion des comptes de gestion (6 & 7)
        else if (code === '6') tCharges += val;
        else if (code === '7') tProduits += val;
    });

    const resultat = tProduits - tCharges;
    const strRes = Math.abs(resultat).toLocaleString();

    // Intégration du résultat net (Bénéfice ou Perte)
    if (resultat > 0) {
        tPassif += resultat;
        corpsPassif.innerHTML += `<tr><td class="ligne-resultat">Résultat (Bénéfice)</td><td class="montant montant-passif">${strRes}</td></tr>`;
    } else if (resultat < 0) {
        tActif += Math.abs(resultat);
        corpsActif.innerHTML += `<tr><td class="ligne-resultat">Résultat (Perte)</td><td class="montant">${strRes}</td></tr>`;
    }

    // Affichage des totaux finaux
    $('totalActif').innerText = `${tActif.toLocaleString()} XOF`;
    $('totalPassif').innerText = `${tPassif.toLocaleString()} XOF`;
}

// Initialisation globale au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    gererBilan();

    const btnMenu = $('boutonHamburger');
    const menuNav = document.querySelector('.menu-navigation');

    if (btnMenu && menuNav) {
        // Toggle du menu mobile
        btnMenu.addEventListener('click', () => menuNav.classList.toggle('open'));

        // Fermeture automatique du menu au clic sur un lien (Délégation d'événement)
        menuNav.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && e.target.closest('.lien-navigation')) {
                menuNav.classList.remove('open');
            }
        });
    }
});