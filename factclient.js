const CLE_STOCKAGE = 'py_factures';
let filtreActuel = 'nouveau';

const facturesParDefaut = [
    {
        id: "F-99201", 
        date: "07/03/2026", 
        client: "Samuel Nsasi", 
        montant: 25000, 
        statut: "nouveau", 
        items: [
            { name: "Service Audit", qty: 1, price: 20000 },
            { name: "Frais Dossier", qty: 1, price: 5000 }
        ]
    }
];

// Récupération des données du LocalStorage
let factures = JSON.parse(localStorage.getItem(CLE_STOCKAGE)) || facturesParDefaut;

// Sauvegarde dans le stockage local
const sauvegarderDonnees = () => {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(factures));
};

// Rendu du tableau des factures
function afficherTableau() {
    const tableau = document.getElementById("tableauFactures");
    const champRecherche = document.getElementById("champRecherche");
    
    if (!tableau || !champRecherche) {
        return;
    }

    const recherche = champRecherche.value.toLowerCase();

    // Filtrage des factures selon l'onglet actif et la recherche
    const facturesFiltrees = factures.filter(facture => {
        const correspondAuFiltre = facture.statut === filtreActuel;
        const correspondAuClient = facture.client.toLowerCase().includes(recherche);
        return correspondAuFiltre && correspondAuClient;
    });

    // Génération propre des lignes du tableau
    tableau.innerHTML = facturesFiltrees.map(facture => `
        <tr>
            <td onclick="ouvrirModale('${facture.id}')">
                ${facture.date}
            </td>
            <td onclick="ouvrirModale('${facture.id}')">
                <strong>${facture.id}</strong>
            </td>
            <td onclick="ouvrirModale('${facture.id}')">
                ${facture.client}
            </td>
            <td onclick="ouvrirModale('${facture.id}')">
                ${facture.montant.toLocaleString()} FC
            </td>
            <td onclick="ouvrirModale('${facture.id}')">
                <span class="status-badge">${facture.statut}</span>
            </td>
            <td style="text-align: center;">
                <button onclick="supprimerFacture('${facture.id}')" style="background: none; color: red; border: none; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Ouverture de la modale de ticket
function ouvrirModale(id) {
    const facture = factures.find(f => f.id === id);
    if (!facture) {
        return;
    }
    
    // Fonction utilitaire pour assigner le texte en toute sécurité
    const injecterTexte = (idElement, valeur) => {
        const element = document.getElementById(idElement);
        if (element) {
            element.innerText = valeur;
        }
    };
    
    injecterTexte("numeroTicket", facture.id);
    injecterTexte("clientTicket", facture.client);
    injecterTexte("dateTicket", facture.date);
    injecterTexte("totalTicket", `${facture.montant.toLocaleString()} FC`);
    injecterTexte("taxeTicket", `${(facture.montant * 0.18).toLocaleString()} FC`);

    // Rendu de la liste des articles achetés
    const conteneurArticles = document.getElementById("articlesTicket");
    if (conteneurArticles) {
        conteneurArticles.innerHTML = facture.items.map(article => `
            <div class="ligne-info">
                <span>${article.name} x${article.qty}</span>
                <span>${(article.qty * article.price).toLocaleString()} FC</span>
            </div>
        `).join('');
    }

    const modale = document.getElementById("modaleFacture");
    if (modale) {
        modale.style.display = "flex";
    }
}

// Ajout d'une nouvelle facture
function ajouterFacture() {
    const nomClient = prompt("Nom du client :");
    if (!nomClient) {
        return;
    }

    const saisieNombre = prompt("Combien de types de marchandises ?");
    const nombreTypes = parseInt(saisieNombre);
    if (isNaN(nombreTypes) || nombreTypes <= 0) {
        return;
    }

    let listeArticles = [];
    let totalFacture = 0;

    for (let i = 1; i <= nombreTypes; i++) {
        const nomArticle = prompt(`Nom de la marchandise n°${i}`);
        const quantite = parseInt(prompt(`Quantité pour ${nomArticle}`));
        const prixUnitaire = parseFloat(prompt(`Prix unitaire pour ${nomArticle}`));

        if (nomArticle && !isNaN(quantite) && !isNaN(prixUnitaire)) {
            const sousTotal = quantite * prixUnitaire;
            totalFacture += sousTotal;
            
            listeArticles.push({ 
                name: nomArticle, 
                qty: quantite, 
                price: prixUnitaire 
            });
        }
    }

    // Ajout de la nouvelle facture générée
    factures.push({
        id: `F-${Math.floor(Math.random() * 90000)}`,
        date: new Date().toLocaleDateString(),
        client: nomClient,
        montant: totalFacture,
        statut: "nouveau",
        items: listeArticles
    });

    sauvegarderDonnees();
    afficherTableau();
}

// Suppression d'une facture
function supprimerFacture(id) {
    if (confirm("Supprimer cette facture ?")) {
        factures = factures.filter(f => f.id !== id);
        sauvegarderDonnees();
        afficherTableau();
    }
}

// Changement d'onglet de filtre (Nouveaux / Enregistrées)
function changerOnglet(statut, element) {
    filtreActuel = statut;
    
    document.querySelectorAll(".onglet").forEach(onglet => {
        onglet.classList.remove("active");
    });
    
    if (element) {
        element.classList.add("active");
    }
    
    afficherTableau();
}

// Fermeture de la modale
function fermerModale() { 
    const modale = document.getElementById("modaleFacture");
    if (modale) {
        modale.style.display = "none"; 
    }
}

// Initialisation globale des écouteurs d'événements
document.addEventListener("DOMContentLoaded", () => {
    const champRecherche = document.getElementById("champRecherche");
    if (champRecherche) {
        champRecherche.addEventListener("input", afficherTableau);
    }

    // Initialisation du tableau au premier chargement
    afficherTableau();

    // Gestion du menu mobile (Hamburger)
    const boutonHamburger = document.getElementById('boutonHamburger');
    const menuNavigation = document.querySelector('.menu-navigation');

    if (boutonHamburger && menuNavigation) {
        boutonHamburger.addEventListener('click', () => {
            menuNavigation.classList.toggle('open');
        });

        // Fermeture automatique du menu au clic sur un lien (sur mobile)
        document.querySelectorAll('.lien-navigation').forEach(lien => {
            lien.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuNavigation.classList.remove('open');
                }
            });
        });
    } else {
        console.error("Éléments de navigation manquants dans le DOM.");
    }
});