// ==========================================================================
// 1. INITIALISATION ET CHARGEMENT DES DONNÉES
// ==========================================================================
// On utilise les clés que tu as définies pour la persistance
let lotsStock = JSON.parse(localStorage.getItem('py_stock_fifo')) || [];
let journal = JSON.parse(localStorage.getItem('py_compta_db')) || [];

// Fonction pour mettre à jour l'affichage
function actualiserInterface() {
    const tbody = document.getElementById('corpsTableauStock');
    tbody.innerHTML = "";
    
    let totalValeur = 0;
    let totalQuantite = 0;

    lotsStock.forEach((lot, index) => {
        const valeurLot = (lot.quantite * lot.prix);
        totalValeur += valeurLot;
        totalQuantite += lot.quantite;

        tbody.innerHTML += `
            <tr>
                <td><span class="batch-tag">#${lot.id || index + 1}</span></td>
                <td>${lot.date}</td>
                <td>${lot.libelle}</td>
                <td>${lot.quantite}</td>
                <td>${lot.prix.toLocaleString('fr-FR')}</td>
                <td style="font-weight:800">${valeurLot.toLocaleString('fr-FR')} Fc</td>
                <td>
                    <button class="bouton-supprimer" onclick="supprimerLot(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    // Mise à jour des cartes de synthèse
    document.getElementById('valeurTotale').innerHTML = `${totalValeur.toLocaleString('fr-FR')} <small>Fc</small>`;
    document.getElementById('quantiteTotale').innerHTML = `${totalQuantite} <small>Unités</small>`;
}

// ==========================================================================
// 2. ENTRÉE DE MARCHANDISES (DÉBIT 311)
// ==========================================================================
function traiterEntree() {
    const libelle = document.getElementById('entreeLibelle').value;
    const quantite = parseInt(document.getElementById('entreeQuantite').value);
    const prix = parseFloat(document.getElementById('entreePrix').value);

    if(!libelle || quantite <= 0 || prix <= 0) {
        return alert("Veuillez saisir des informations valides.");
    }

    const idEntree = "STK-" + Date.now();

    const nouveauLot = {
        id: idEntree,
        libelle: libelle,
        quantite: quantite,
        prix: prix,
        date: new Date().toLocaleDateString('fr-FR')
    };

    // Ajout au stock
    lotsStock.push(nouveauLot);
    localStorage.setItem('py_stock_fifo', JSON.stringify(lotsStock));

    // Enregistrement au journal
    journal.push({
        id: idEntree,
        date: new Date().toISOString().split('T')[0],
        libelle: "ENTRÉE STOCK: " + libelle,
        compte: "311",
        debit: quantite * prix,
        credit: 0
    });
    localStorage.setItem('py_compta_db', JSON.stringify(journal));

    actualiserInterface();
    alert("Entrée enregistrée avec succès !");
}

// ==========================================================================
// 3. SORTIE DE MARCHANDISES (FIFO - CRÉDIT 311)
// ==========================================================================
function traiterSortie() {
    let quantiteASortir = parseInt(document.getElementById('sortieQuantite').value);
    
    if(isNaN(quantiteASortir) || quantiteASortir <= 0) {
        return alert("Veuillez saisir une quantité valide.");
    }

    let valeurTotaleSortie = 0;
    let quantiteTotaleDisponible = lotsStock.reduce((acc, lot) => acc + lot.quantite, 0);

    if(quantiteASortir > quantiteTotaleDisponible) {
        return alert("Stock insuffisant !");
    }

    // Logique FIFO
    while(quantiteASortir > 0 && lotsStock.length > 0) {
        let lotActuel = lotsStock[0]; // On prend le plus ancien

        if(lotActuel.quantite <= quantiteASortir) {
            // On épuise le lot
            valeurTotaleSortie += (lotActuel.quantite * lotActuel.prix);
            quantiteASortir -= lotActuel.quantite;
            lotsStock.shift(); // Supprime le lot du tableau
        } else {
            // On prend une partie du lot
            valeurTotaleSortie += (quantiteASortir * lotActuel.prix);
            lotActuel.quantite -= quantiteASortir;
            quantiteASortir = 0;
        }
    }

    localStorage.setItem('py_stock_fifo', JSON.stringify(lotsStock));

    // Enregistrement de la sortie au journal
    journal.push({
        date: new Date().toISOString().split('T')[0],
        libelle: "SORTIE STOCK (VALEUR FIFO)",
        compte: "311",
        debit: 0,
        credit: valeurTotaleSortie
    });
    localStorage.setItem('py_compta_db', JSON.stringify(journal));

    actualiserInterface();
    alert(`Sortie validée ! Valeur créditée : ${valeurTotaleSortie.toLocaleString('fr-FR')} Fc`);
}

// ==========================================================================
// 4. SUPPRESSION
// ==========================================================================
function supprimerLot(index) {
    if(confirm("Supprimer ce lot ? Cette action annulera aussi l'écriture comptable associée.")) {
        const lotASupprimer = lotsStock[index];
        
        if (lotASupprimer.id) {
            journal = journal.filter(entree => entree.id !== lotASupprimer.id);
            localStorage.setItem('py_compta_db', JSON.stringify(journal));
        }

        lotsStock.splice(index, 1);
        localStorage.setItem('py_stock_fifo', JSON.stringify(lotsStock));
        actualiserInterface();
    }
}

// Lancement au chargement de la page
document.addEventListener("DOMContentLoaded", actualiserInterface);