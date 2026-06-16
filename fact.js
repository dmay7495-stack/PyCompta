// ==========================================================================
// 1. VARIABLES GLOBALES & ÉLÉMENTS DU DOM
// ==========================================================================
const chargeur = document.getElementById("chargeurSmash");

// Factures de démonstration chargées si le LocalStorage est vide
const facturesParDefaut = [
    { id: "FAC-001", date: "07/03/2026", fournisseur: "Lucioles Digitales", montant: "144.000", statut: "nouveau" },
    { id: "FAC-002", date: "03/03/2026", fournisseur: "Encraje SARL", montant: "539.000", statut: "enregistre" },
];

let factures = [];
let filtreCourant = "nouveau"; // Filtre par défaut ('nouveau' ou 'enregistre')
let indexSelectionne = null;    // Stocke l'index de la facture ouverte dans la modale

// ==========================================================================
// 2. GESTION DU STOCKAGE (LOCALSTORAGE)
// ==========================================================================

// Récupère les données enregistrées dans le navigateur
function chargerFactures() {
    const donnees = localStorage.getItem('invo'); // Utilise bien ta clé 'invo'
    if (donnees) {
        try {
            const donneesAnalysees = JSON.parse(donnees);
            if (Array.isArray(donneesAnalysees) && donneesAnalysees.length > 0) {
                factures = donneesAnalysees;
            } else {
                factures = [...facturesParDefaut];
            }
        } catch (erreur) {
            console.error("Erreur lors de la lecture du JSON :", erreur);
            factures = [...facturesParDefaut];
        }
    } else {
        factures = [...facturesParDefaut];
        sauvegarderFactures();
    }
}

// Sauvegarde l'état actuel du tableau dans le navigateur
function sauvegarderFactures() {
    localStorage.setItem('invo', JSON.stringify(factures));
}

// ==========================================================================
// 3. AFFICHAGE DYNAMIQUE (TABLEAU HTML)
// ==========================================================================

// Filtre et insère les lignes de factures dans le tbody HTML
function générerTableau() {
    const tableau = document.getElementById("tableauFactures");
    const champRecherche = document.getElementById("champRecherche");
    if (!tableau || !champRecherche) return;

    tableau.innerHTML = ""; // On vide le tableau avant de le reconstruire
    const recherche = champRecherche.value.toLowerCase();

    factures.forEach((facture, index) => {
        const nomFournisseur = facture.fournisseur || "Inconnu";
        const statutFacture = facture.statut || "nouveau";
        
        // Validation des filtres (Onglet actif + Barre de recherche)
        const correspondAuFiltre = statutFacture === filtreCourant;
        const correspondALaRecherche = nomFournisseur.toLowerCase().includes(recherche);

        if (correspondAuFiltre && correspondALaRecherche) {
            tableau.innerHTML += `
                <tr>
                    <td onclick="ouvrirModal(${index})">${facture.date}</td>
                    <td onclick="ouvrirModal(${index})" style="font-weight: 800;">${nomFournisseur}</td>
                    <td onclick="ouvrirModal(${index})">${facture.montant} FC</td>
                    <td onclick="ouvrirModal(${index})"><span class="statut-badge">${statutFacture}</span></td>
                    <td>
                        <div class="bouton-supprimer" style="display: flex; gap: 15px; align-items: center;">
                            <i class="fas fa-trash-alt" onclick="supprimerFacture(${index})" style="cursor:pointer; color: red;"></i>
                        </div>
                    </td>
                </tr>
            `;
        }
    });
}

// Change de filtre ('nouveau' / 'enregistre') lors du clic sur un onglet
function changerOnglet(statut, elementClique) {
    filtreCourant = statut;
    document.querySelectorAll(".onglet").forEach(onglet => onglet.classList.remove("actif"));
    elementClique.classList.add("actif");
    générerTableau();
}

// ==========================================================================
// 4. INTERACTION MODALE & OPERATIONS CRUDS (AJOUT, MODIF, SUPPR)
// ==========================================================================

// Ouvre la fenêtre modale et y injecte les détails textuels de la facture
function ouvrirModal(index) {
    indexSelectionne = index;
    const facture = factures[index];
    const zoneInfo = document.getElementById("detailsModal");
    
    if (zoneInfo && facture) {
        zoneInfo.innerHTML = `
            <strong>ID :</strong> ${facture.id}<br>
            <strong>Fournisseur :</strong> ${facture.fournisseur}<br>
            <strong>Montant :</strong> ${facture.montant} FC<br>
            <strong>Date :</strong> ${facture.date}
        `;
        document.getElementById("modalFacture").style.display = "flex";
    }
}

// Ferme la fenêtre modale
function fermerModal() { 
    document.getElementById("modalFacture").style.display = "none"; 
}

// Crée une nouvelle facture via deux invites (Prompts) successives
function ajouterFacture() {
    const fournisseurSaisi = prompt("Nom du fournisseur :");
    const montantSaisi = prompt("Montant (FC) :");
    
    if (fournisseurSaisi && montantSaisi) {
        const nouvelleFacture = {
            id: "FAC-" + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toLocaleDateString('fr-FR'),
            fournisseur: fournisseurSaisi,
            montant: montantSaisi,
            statut: "nouveau"
        };
        factures.push(nouvelleFacture);
        sauvegarderFactures();
        générerTableau();
    }
}

// Modifie les valeurs d'une facture existante
function modifierFacture() {
    if (indexSelectionne === null) return;
    const facture = factures[indexSelectionne];
    
    const nouveauNom = prompt("Nouveau nom :", facture.fournisseur);
    const nouveauMontant = prompt("Nouveau montant :", facture.montant);
    
    if (nouveauNom && nouveauMontant) {
        facture.fournisseur = nouveauNom;
        facture.montant = nouveauMontant;
        sauvegarderFactures();
        générerTableau();
        fermerModal();
    }
}

// Enlève une facture du tableau (depuis l'icône de la ligne ou depuis la modale)
function supprimerFacture(indexDepuisTableau = null) {
    const indexASupprimer = indexDepuisTableau !== null ? indexDepuisTableau : indexSelectionne;

    if (indexASupprimer !== null) {
        const facture = factures[indexASupprimer];
        
        if (confirm(`Es-tu sûr de vouloir supprimer la facture de ${facture.fournisseur} ?`)) {
            factures.splice(indexASupprimer, 1);
            sauvegarderFactures();
            générerTableau();
            fermerModal();
            indexSelectionne = null;
        }
    }
}

// ==========================================================================
// 5. IMPRESSION & TRANSITIONS DE NAVIGATION
// ==========================================================================

// Remplis les balises de la zone d'impression fantôme avant d'appeler l'imprimante
function imprimerFacture() {
    if (indexSelectionne === null) return;
    const facture = factures[indexSelectionne];
    
    const champsImpression = {
        "impressionFournisseur": facture.fournisseur,
        "impressionDate": facture.date,
        "impressionMontant": facture.montant + " FC",
        "impressionTotal": facture.montant + " FC",
        "impressionID": facture.id
    };

    // Assigne dynamiquement chaque valeur à son conteneur HTML respectif
    for (let idElement in champsImpression) {
        const elementHtml = document.getElementById(idElement);
        if (elementHtml) {
            elementHtml.innerText = champsImpression[idElement];
        }
    }
    window.print();
}

// Déclenche l'animation visuelle du loader avant de changer de page
function naviguerVers(url) {
    if (chargeur) {
        chargeur.classList.add("actif");
        setTimeout(() => { window.location.href = url; }, 1000);
    } else {
        window.location.href = url;
    }
}

// ==========================================================================
// 6. INITIALISATION DIRECTE ET ÉCOUTEURS D'ÉVÉNEMENTS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 6.1 Branchement de la barre de recherche en temps réel
    const champRecherche = document.getElementById("champRecherche");
    if (champRecherche) {
        champRecherche.addEventListener("input", générerTableau);
    }
    
    // Chargement initial des vues de données
    chargerFactures();
    générerTableau();

    // 6.2 Logique de contrôle responsive pour le Menu Hamburger Mobile
    const boutonHamburger = document.getElementById('boutonHamburger');
    const menuNavigation = document.querySelector('.menu-navigation');

    if (boutonHamburger && menuNavigation) {
        // Ouvre / Ferme le menu au clic sur l'icône burger
        boutonHamburger.addEventListener('click', () => {
            menuNavigation.classList.toggle('ouvert');
        });

        // Replie automatiquement le menu après sélection d'un lien en vue mobile
        document.querySelectorAll('.lien-navigation').forEach(lien => {
            lien.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuNavigation.classList.remove('ouvert');
                }
            });
        });
    } else {
        console.warn("Éléments de navigation mobile manquants dans le DOM.");
    }
});