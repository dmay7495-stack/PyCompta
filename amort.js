// Initialisation des bases de données locales
let actifs = JSON.parse(localStorage.getItem('py_actifs')) || [];
let journal = JSON.parse(localStorage.getItem('py_compta_db')) || [];

// Fonction pour ajouter une immobilisation
function ajouterActif() {
    const nom = document.getElementById('nomActif').value;
    const valeur = parseFloat(document.getElementById('valeurActif').value);
    const duree = parseInt(document.getElementById('dureeActif').value);
    const date = document.getElementById('dateActif').value;

    // Validation stricte des données
    if (!nom || isNaN(valeur) || isNaN(duree) || !date) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
    }

    // Ajout de l'actif
    actifs.push({ 
        id: "AST-" + Date.now(), 
        name: nom, 
        value: valeur, 
        life: duree, 
        date: date 
    });

    localStorage.setItem('py_actifs', JSON.stringify(actifs));
    afficherActifs();
    
    // Réinitialisation propre des champs de saisie
    document.getElementById('nomActif').value = "";
    document.getElementById('valeurActif').value = "";
}

// Fonction pour afficher la liste des actifs dans le tableau principal
function afficherActifs() {
    const corpsTableau = document.getElementById('corpsTableauActifs');
    if (!corpsTableau) {
        return;
    }

    // Utilisation de map pour de meilleures performances de rendu DOM
    corpsTableau.innerHTML = actifs.map((actif, index) => `
        <tr>
            <td>
                <b style="color: #38bdf8;">${actif.name}</b>
            </td>
            <td>
                ${actif.value.toLocaleString()} FC
            </td>
            <td>
                ${actif.life} ans
            </td>
            <td>
                ${new Date(actif.date).toLocaleDateString('fr-FR')}
            </td>
            <td>
                <button class="bouton-action" onclick="genererFiche(${index})">
                    <i class="fas fa-file-invoice"></i> Fiche
                </button>
                <button class="bouton-action point" onclick="enregistrerAuJournal(${index})">
                    <i class="fas fa-check-double"></i> Doter
                </button>
                <button class="bouton-action" onclick="supprimerActif(${index})" style="background: rgba(255, 0, 0, 0.3);">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Calcule le prorata temporis (limité à 360 jours max pour l'année commerciale)
function calculerJoursDansAnnee(dateStr) {
    const dateDebut = new Date(dateStr);
    const finAnnee = new Date(dateDebut.getFullYear(), 11, 31);
    
    // Différence brute en millisecondes convertie en jours
    const differenceJours = Math.floor((finAnnee - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
    
    return Math.min(360, differenceJours); 
}

// Génération complète du tableau/fiche d'amortissement
function genererFiche(index) {
    const actif = actifs[index];
    const corpsFiche = document.getElementById('corpsFiche');
    const zoneImpression = document.getElementById('zoneImpression');
    
    if (!actif || !corpsFiche || !zoneImpression) {
        return;
    }

    // Mise à jour des en-têtes de la fiche
    document.getElementById('titreFiche').innerText = "FICHE D'AMORTISSEMENT : " + actif.name.toUpperCase();
    document.getElementById('infoFiche').innerHTML = `
        <div>
            <b>Valeur brute :</b> ${actif.value.toLocaleString()} FC<br>
            <b>Mise en service :</b> ${new Date(actif.date).toLocaleDateString('fr-FR')}
        </div>
        <div style="text-align: right;">
            <b>Mode :</b> Linéaire<br>
            <b>Durée :</b> ${actif.life} Ans
        </div>
    `;
    
    let cumul = 0;
    let vcn = actif.value;
    let anneeCourante = new Date(actif.date).getFullYear();
    
    const taux = 1 / actif.life;
    const joursPremiereAnnee = calculerJoursDansAnnee(actif.date);
    let lignesHtml = [];

    // Boucle de calcul sur la durée de vie + l'éventuelle année de reliquat (prorata)
    for (let i = 0; i <= actif.life; i++) {
        let annuite = 0;

        if (i === 0) {
            annuite = actif.value * taux * (joursPremiereAnnee / 360);
            if (joursPremiereAnnee >= 360) {
                i++; 
            }
        } else if (i === actif.life) {
            annuite = actif.value * taux * ((360 - joursPremiereAnnee) / 360);
        } else {
            annuite = actif.value * taux;
        }

        if (annuite <= 0) {
            continue;
        }

        cumul += annuite; 
        vcn -= annuite;

        lignesHtml.push(`
            <tr>
                <td>31/12/${anneeCourante + i}</td>
                <td>${actif.value.toLocaleString()}</td>
                <td>${Math.round(annuite).toLocaleString()}</td>
                <td>${Math.round(cumul).toLocaleString()}</td>
                <td style="font-weight: bold;">${Math.round(Math.max(0, vcn)).toLocaleString()}</td>
            </tr>
        `);
    }
    
    // Injection propre en une seule fois
    corpsFiche.innerHTML = lignesHtml.join('');
    
    // Affichage et défilement fluide
    zoneImpression.style.display = "block";
    zoneImpression.scrollIntoView({ behavior: 'smooth' });
}

// Enregistrement des écritures de dotation dans le journal comptable (Syscohada)
function enregistrerAuJournal(index) {
    const actif = actifs[index];
    if (!actif) {
        return;
    }

    const anneeCible = prompt("Pour quelle année générer la dotation ?", new Date().getFullYear());
    if (!anneeCible) {
        return;
    }

    const anneeDebut = new Date(actif.date).getFullYear();
    const joursPremiereAnnee = calculerJoursDansAnnee(actif.date);
    let montantDotation = actif.value / actif.life;

    // Ajustement de l'annuité si c'est la première année d'acquisition (prorata)
    if (anneeCible == anneeDebut) {
        montantDotation = actif.value * (1 / actif.life) * (joursPremiereAnnee / 360);
    }
    
    const idEcriture = "AMOR-" + actif.id + "-" + anneeCible;
    const montantArrondi = Math.round(montantDotation);

    // Écriture Débit : Compte 681 (Dotations aux amortissements)
    journal.push({
        id: idEcriture,
        date: anneeCible + "-12-31",
        label: `DOTATION AMORT. : ${actif.name}`,
        account: "681",
        debit: montantArrondi,
        credit: 0
    });

    // Écriture Crédit : Compte 28 (Amortissements des immobilisations)
    journal.push({
        id: idEcriture,
        date: anneeCible + "-12-31",
        label: `AMORTISSEMENT : ${actif.name}`,
        account: "28", 
        debit: 0,
        credit: montantArrondi
    });

    localStorage.setItem('py_compta_db', JSON.stringify(journal));
    alert(`Succès ! La dotation de ${montantArrondi.toLocaleString()} FC a été enregistrée au journal.`);
}

// Suppression d'un actif
function supprimerActif(index) {
    if (confirm("Supprimer cet actif ?")) {
        actifs.splice(index, 1);
        localStorage.setItem('py_actifs', JSON.stringify(actifs));
        afficherActifs();
    }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", afficherActifs);