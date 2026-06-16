// 1. Initialisation de la base de données locale (Stockage dans le navigateur)
let écritures = JSON.parse(localStorage.getItem('py_compta_db')) || [
    { date: "2026-03-01", account: "521", label: "Apport Initial", debit: 5000000, credit: 0 },
    { date: "2026-03-01", account: "101", label: "Apport Initial", debit: 0, credit: 5000000 }
];

// 2. Supprimer une écriture
function deleteEntry(index) {
    if (confirm("Supprimer cette écriture ?")) {
        écritures.splice(index, 1); 
        renderJournal(); // Met à jour l'affichage et sauvegarde
    }
}

// 3. Moteur d'affichage du Journal (Le rendu HTML)
function renderJournal() {
    const table = document.getElementById("journalTable");
    const barreTotaux = document.querySelector(".barre-totaux");
    const corpsPage = document.getElementById('le');
    
    table.innerHTML = "";
    let totalDébit = 0, totalCrédit = 0;

    // Boucle sur chaque écriture pour générer les lignes du tableau
    écritures.forEach((écriture, index) => {
        totalDébit += écriture.debit; 
        totalCrédit += écriture.credit;
        
        table.innerHTML += `
            <tr>
                <td>${écriture.date}</td>
                <td style="font-weight:bold; color:#38bdf8">${écriture.account}</td>
                <td>${écriture.label}</td>
                <td class="debit">${écriture.debit > 0 ? écriture.debit.toLocaleString() : "-"}</td>
                <td class="credit">${écriture.credit > 0 ? écriture.credit.toLocaleString() : "-"}</td>
                <td>
                    <button class="bouton-supprimer" onclick="deleteEntry(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>`;
    });

    // Injection des totaux calculés dans le HTML
    document.getElementById("totalDebit").innerText = totalDébit.toLocaleString();
    document.getElementById("totalCredit").innerText = totalCrédit.toLocaleString();

    // Vérification du principe de la partie double (Équilibre Débit / Crédit)
    if (totalDébit === totalCrédit && totalDébit > 0) {
        barreTotaux.classList.remove("is-unbalanced");
        corpsPage.classList.remove("eh");
        barreTotaux.classList.add("is-balanced"); // Vert & Pulse
    } else {
        barreTotaux.classList.remove("is-balanced");
        barreTotaux.classList.add("is-unbalanced"); // Rouge & Secousse
        corpsPage.classList.add("eh"); // Alerte visuelle arrière-plan (mode panique)
    }

    // Sauvegarde de l'état actuel dans le LocalStorage
    localStorage.setItem('py_compta_db', JSON.stringify(écritures));
}

// 4. Ajouter une nouvelle écriture
function addEntry() {
    const date = document.getElementById("dateInput").value;
    const account = document.getElementById("accountInput").value;
    const label = document.getElementById("labelInput").value;
    const debit = parseFloat(document.getElementById("debitInput").value) || 0;
    const credit = parseFloat(document.getElementById("creditInput").value) || 0;

    // Validation stricte : la date, le compte et le libellé sont obligatoires
    if (date && account && label) {
        écritures.push({ date, account, label, debit, credit });
        renderJournal(); // Relance le calcul et l'affichage complet
        
        // Réinitialisation des champs pour la saisie suivante (sauf la date pour aller plus vite)
        document.getElementById("accountInput").value = "";
        document.getElementById("debitInput").value = "";
        document.getElementById("creditInput").value = "";
    }
    localStorage.setItem('py_compta_db', JSON.stringify(écritures));
}

// Lancement automatique dès le chargement de la page
window.onload = renderJournal;

// 5. Gestion du Menu Mobile (Hamburger)
document.addEventListener("DOMContentLoaded", () => {
    const boutonHamburger = document.querySelector('.bouton-hamburger');
    const menuNavigation = document.querySelector('.menu-navigation');

    if (boutonHamburger && menuNavigation) {
        // Ouverture / Fermeture au clic sur le bouton ☰
        boutonHamburger.addEventListener('click', () => {
            menuNavigation.classList.toggle('open');
        });

        // Fermeture automatique du menu après avoir cliqué sur un lien (sur mobile uniquement)
        document.querySelectorAll('.element-navigation').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuNavigation.classList.remove('open');
                }
            });
        });
    } else {
        console.error("Erreur : Le script ne trouve pas les éléments du menu !");
    }
});