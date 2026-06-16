/**
 * GESTION DU GRAND LIVRE - PY COMPTA
 */

// Clé unique pour récupérer les données dans le LocalStorage
const CLE_BASE_DONNEES = 'py_compta_db';

/**
 * 1. FERMER LA MODALE
 * Masque la boîte de dialogue des détails du compte.
 */
function closeModal() { 
    const modale = document.getElementById("invoiceModal");
    if (modale) {
        modale.style.display = "none"; 
    }
}

/**
 * 2. OUVRIR LA MODALE
 * Filtre et affiche l'historique des écritures pour un compte précis.
 */
function openModal(nomCompte) {
    const journal = JSON.parse(localStorage.getItem(CLE_BASE_DONNEES)) || [];
    const modale = document.getElementById("invoiceModal");
    const conteneurContenu = document.getElementById("modalContent");
    
    if (!modale || !conteneurContenu) return;

    // Récupération des lignes qui appartiennent uniquement à ce compte
    const ecrituresDuCompte = journal.filter(ligne => ligne.account === nomCompte);
    
    // Génération de la table HTML à injecter dans la modale
    conteneurContenu.innerHTML = `
        <h2 style="margin-bottom:20px; color:#38bdf8;">Détails Compte : ${nomCompte}</h2>
        <div style="max-height:400px; overflow-y:auto;">
            <table style="width:100%; border-collapse:collapse; color:white;">
                <thead style="border-bottom:1px solid rgba(255,255,255,0.2);">
                    <tr>
                        <th style="text-align:left; padding:10px;">Date</th>
                        <th>Libellé</th>
                        <th>Débit</th>
                        <th>Crédit</th>
                    </tr>
                </thead>
                <tbody>
                    ${ecrituresDuCompte.map(ligne => `
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                            <td style="padding:10px;">${ligne.date}</td>
                            <td>${ligne.label}</td>
                            <td style="color:#10b981;">${ligne.debit > 0 ? ligne.debit.toLocaleString() : '-'}</td>
                            <td style="color:#f472b6;">${ligne.credit > 0 ? ligne.credit.toLocaleString() : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Affichage de la modale en mode flexbox pour le centrage CSS
    modale.style.display = "flex";
}

/**
 * 3. CALCULER ET AFFICHER LE GRAND LIVRE
 * Récupère le journal, regroupe par compte, calcule les totaux et génère les comptes en T.
 */
function renderLedger() {
    const journal = JSON.parse(localStorage.getItem(CLE_BASE_DONNEES)) || [];
    const conteneurGrandLivre = document.getElementById('ledgerContainer');
    
    if (!conteneurGrandLivre) return;
    conteneurGrandLivre.innerHTML = ""; // Vide le conteneur avant affichage

    const dictionnairesComptes = {};
    let cumulGeneralDebit = 0;
    let cumulGeneralCredit = 0;

    // Étape A : On regroupe les écritures par compte et on calcule les totaux généraux
    journal.forEach(ligne => {
        if (!dictionnairesComptes[ligne.account]) {
            dictionnairesComptes[ligne.account] = { 
                debits: [], 
                credits: [], 
                totalDebit: 0, 
                totalCredit: 0 
            };
        }
        
        const compteCible = dictionnairesComptes[ligne.account];

        if (ligne.debit > 0) {
            compteCible.debits.push(ligne);
            compteCible.totalDebit += ligne.debit;
            cumulGeneralDebit += ligne.debit;
        }
        if (ligne.credit > 0) {
            compteCible.credits.push(ligne);
            compteCible.totalCredit += ligne.credit;
            cumulGeneralCredit += ligne.credit;
        }
    });

    // Étape B : Mise à jour des trois cartes du ruban supérieur (en Francs Congolais)
    document.getElementById('totalDebits').innerText = cumulGeneralDebit.toLocaleString() + " FC";
    document.getElementById('totalCredits').innerText = cumulGeneralCredit.toLocaleString() + " FC";
    document.getElementById('totalSolde').innerText = (cumulGeneralDebit - cumulGeneralCredit).toLocaleString() + " FC";

    // Étape C : Construction globale de la vue des comptes en T
    let htmlGlobal = "";

    Object.keys(dictionnairesComptes).forEach(nomCompte => {
        const donneesCompte = dictionnairesComptes[nomCompte];
        const soldeCalculé = donneesCompte.totalDebit - donneesCompte.totalCredit;
        const estDebiteur = soldeCalculé >= 0;
        
        htmlGlobal += `
            <div class="compte-t" onclick="openModal('${nomCompte}')" style="cursor:pointer;">
                <div class="t-header"><h3>COMPTE : ${nomCompte}</h3></div>
                <div class="t-body">
                    <div class="t-col">
                        ${donneesCompte.debits.map(d => `
                            <div class="entry-line"><span>${d.date}</span><b>${d.debit.toLocaleString()}</b></div>
                        `).join('')}
                    </div>
                    <div class="t-col" style="border:none">
                        ${donneesCompte.credits.map(c => `
                            <div class="entry-line"><b>${c.credit.toLocaleString()}</b><span>${c.date}</span></div>
                        `).join('')}
                    </div>
                </div>
                <div class="solde-footer">
                    <span style="font-weight:800;">TOTAL : ${Math.abs(soldeCalculé).toLocaleString()}</span>
                    <span class="solde-tag ${estDebiteur ? 'debiteur' : 'crediteur'}">
                        ${estDebiteur ? 'Débiteur' : 'Créditeur'}
                    </span>
                </div>
            </div>`;
    });

    // Étape D : Une seule injection dans le DOM pour optimiser la fluidité et la vitesse
    conteneurGrandLivre.innerHTML = htmlGlobal;
}

/**
 * 4. RECHERCHE / FILTRE DYNAMIQUE
 * Masque ou affiche les cartes de comptes en fonction de la saisie utilisateur.
 */
function filterAccounts() {
    const saisieRecherche = document.getElementById('searchAccount').value.toLowerCase();
    const cartesComptes = document.getElementsByClassName('compte-t');
    
    for (let carte of cartesComptes) {
        // Si le texte de la carte contient le mot recherché, on l'affiche, sinon on la cache
        carte.style.display = carte.innerText.toLowerCase().includes(saisieRecherche) ? "block" : "none";
    }
}

// Déclenche l'affichage dès que la fenêtre charge
window.onload = renderLedger;

/**
 * 5. NAVIGATION RESPONSIVE (MOBILE)
 * Gère l'ouverture et fermeture du menu hamburger.
 */
document.addEventListener("DOMContentLoaded", () => {
    const boutonHamburger = document.getElementById('hamburgerBtn');
    const menuNavigation = document.querySelector('.menu-navigation');

    if (boutonHamburger && menuNavigation) {
        // Ouvre ou ferme le menu au clic sur l'icône ☰
        boutonHamburger.addEventListener('click', () => {
            menuNavigation.classList.toggle('open');
        });

        // Ferme automatiquement le menu de navigation si on change de page sur mobile
        document.querySelectorAll('.element-navigation').forEach(lien => {
            lien.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuNavigation.classList.remove('open');
                }
            });
        });
    }
});