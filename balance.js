// 1. Dictionnaire du Plan Comptable OHADA
const planComptable = {
    "10": "Capital", "101": "Capital social", "11": "Réserves", "12": "Report à nouveau",
    "13": "Résultat net", "16": "Emprunts", "21": "Immo. incorporelles", "22": "Terrains", 
    "23": "Bâtiments", "24": "Matériel", "31": "Marchandises", "40": "Fournisseurs", 
    "41": "Clients", "44": "État & TVA", "52": "Banque", "57": "Caisse",
    "60": "Achats", "61": "Transports", "70": "Ventes"
};
// 2. Fonction Principale : Génération de la Balance
function genererBalance() {
    const ecritures = JSON.parse(localStorage.getItem('py_compta_db')) || [];
    const tableBody = document.getElementById("corpsTableauBalance");
    tableBody.innerHTML = "";

    // Étape A : Accumulation et regroupement des montants par compte unique
    let balanceMap = {};
    ecritures.forEach(({ account, debit, credit }) => {
        let num = account ? account.trim() : "";
        if (!num) return;

        if (!balanceMap[num]) balanceMap[num] = { debit: 0, credit: 0 };
        balanceMap[num].debit += parseFloat(debit) || 0;
        balanceMap[num].credit += parseFloat(credit) || 0;
    });

    // Étape B : Calcul des soldes, cumul des totaux et injection HTML
    let [totMvtD, totMvtC, totSolD, totSolC] = [0, 0, 0, 0];

    Object.keys(balanceMap).sort().forEach(num => {
        let mvtD = balanceMap[num].debit;
        let mvtC = balanceMap[num].credit;
        
        // Règle comptable de compensation du solde
        let solD = mvtD > mvtC ? mvtD - mvtC : 0;
        let solC = mvtC > mvtD ? mvtC - mvtD : 0;
        // Cumul pour le bas de page
        totMvtD += mvtD; totMvtC += mvtC;
        totSolD += solD; totSolC += solC;
        let libelle = planComptable[num] || "Compte " + num;
        tableBody.innerHTML += `
            <tr>
                <td class="cellule-numerique">${num}</td>
                <td>${libelle}</td>
                <td class="val-cell">${mvtD ? mvtD.toLocaleString('fr-FR') : "-"}</td>
                <td class="val-cell">${mvtC ? mvtC.toLocaleString('fr-FR') : "-"}</td>
                <td class="val-cell" style="color: #a78bfa; font-weight: 600;">${solD ? solD.toLocaleString('fr-FR') : "-"}</td>
                <td class="val-cell" style="color: #f472b6; font-weight: 600;">${solC ? solC.toLocaleString('fr-FR') : "-"}</td>
            </tr>`;
    });
    // Étape C : Affichage des totaux finaux et gestion du statut d'équilibre
    document.getElementById("totalMouvementDebit").innerText = totMvtD.toLocaleString('fr-FR');
    document.getElementById("totalMouvementCredit").innerText = totMvtC.toLocaleString('fr-FR');
    document.getElementById("totalSoldeDebit").innerText = totSolD.toLocaleString('fr-FR');
    document.getElementById("totalSoldeCredit").innerText = totSolC.toLocaleString('fr-FR');

    // Vérification de l'égalité réglementaire (Débit === Crédit)
    const estEquilibre = (totMvtD === totMvtC) && (totSolD === totSolC) && totMvtD > 0;
    const barre = document.getElementById("barreTotaux");
    const corps = document.getElementById("corpsPrincipal");

    barre.className = `barre-totaux ${estEquilibre ? 'is-balanced' : 'is-unbalanced'}`;
    corps.classList.toggle("error-mode", !estEquilibre && totMvtD !== totMvtC);
}
// 3. Gestion du Menu Hamburger Responsif
document.addEventListener("DOMContentLoaded", () => {
    const btnMenu = document.getElementById('boutonMenu');
    const menu = document.querySelector('.menu-navigation');

    if (btnMenu && menu) {
        btnMenu.onclick = () => menu.classList.toggle('open');
        
        document.querySelectorAll('.lien-navigation').forEach(lien => {
            lien.onclick = () => {
                if (window.innerWidth <= 768) menu.classList.remove('open');
            };
        });
    }
});
window.onload = genererBalance;