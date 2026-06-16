/* ==========================================================================
   1. CONFIGURATION & DONNÉES INITIALES (OHADA 2018)
   ========================================================================== */
const comptesParDefaut = [
    { code: "10", titre: "Capital" }, 
    { code: "101", titre: "Capital social" }, 
    { code: "11", titre: "Réserves" },
    { code: "12", titre: "Report à nouveau" }, 
    { code: "13", titre: "Résultat net de l'exercice" },
    { code: "131", titre: "Résultat net de l'exercice Bénéfices" }, 
    { code: "139", titre: "Résultat net de l'exercice Perte" },
    { code: "14", titre: "Subventions d'investissement" }, 
    { code: "15", titre: "Provisions réglementées et fonds assimilés" },
    { code: "16", titre: "Emprunts et dettes assimilées" }, 
    { code: "162", titre: "Emprunts et dettes auprès des établissements de crédit" },
    { code: "17", titre: "Dettes de crédit - bail et contrats assimilés" }, 
    { code: "18", titre: "Dettes liées à des participations et comptes de liaison" },
    { code: "19", titre: "Provisions financières pour risques et charges" }, 
    { code: "20", titre: "Charges immobilisées" },
    { code: "21", titre: "Immobilisations incorporelles" }, 
    { code: "211", titre: "Frais de recherche et de développement" },
    { code: "22", titre: "Terrains" }, 
    { code: "221", titre: "Terrains agricoles et forestiers" },
    { code: "23", titre: "Bâtiments, installations techniques et agencements" }, 
    { code: "24", titre: "Matériel" },
    { code: "241", titre: "Matériel et outillage industriel et commercial" }, 
    { code: "244", titre: "Matériel et mobilier" },
    { code: "25", titre: "Avances et acomptes versés sur immobilisations" }, 
    { code: "26", titre: "Titres de participation" },
    { code: "27", titre: "Autres immobilisations financières" }, 
    { code: "28", titre: "Amortissements" },
    { code: "29", titre: "Provisions pour dépréciation" }, 
    { code: "31", titre: "Marchandises" },
    { code: "311", titre: "Marchandises a" }, 
    { code: "32", titre: "Matières premières et fournitures liées" },
    { code: "33", titre: "Autres approvisionnements" }, 
    { code: "34", titre: "Produits en cours" },
    { code: "35", titre: "Services en cours" }, 
    { code: "36", titre: "Produits finis" },
    { code: "37", titre: "Produits intermédiaires et résiduels" }, 
    { code: "38", titre: "Stocks en cours de route" },
    { code: "39", titre: "Dépréciations des stocks" }, 
    { code: "40", titre: "Fournisseurs et comptes rattachés" },
    { code: "401", titre: "Fournisseurs, dettes en compte" }, 
    { code: "41", titre: "Clients et comptes rattachés" },
    { code: "411", titre: "Clients" }, 
    { code: "42", titre: "Personnel" }, 
    { code: "43", titre: "Organismes sociaux" },
    { code: "44", titre: "État et collectivités publiques" }, 
    { code: "442", titre: "État, autres impôts et taxes" },
    { code: "443", titre: "État, tva facturée" }, 
    { code: "445", titre: "État, tva récupérable" },
    { code: "45", titre: "Organismes internationaux" }, 
    { code: "46", titre: "Associés-groupe" },
    { code: "47", titre: "Débiteurs et créditeurs divers" }, 
    { code: "48", titre: "Créances et dettes hors activités ordinaires (h.a.o.)" },
    { code: "49", titre: "Dépréciations et risques provisionnés (tiers)" }, 
    { code: "50", titre: "Titres de placement" },
    { code: "51", titre: "Valeurs à encaisser" }, 
    { code: "52", titre: "Banques" }, 
    { code: "521", titre: "Banques locales" },
    { code: "53", titre: "Établissements financiers et assimilés" }, 
    { code: "54", titre: "Instruments de trésorerie" },
    { code: "56", titre: "Banques, crédits de trésorerie et d'escompte" }, 
    { code: "57", titre: "Caisse" },
    { code: "571", titre: "Caisse siège social" }, 
    { code: "58", titre: "Régies d'avances, accréditifs et virements internes" },
    { code: "59", titre: "Dépréciations et risques provisionnés" }, 
    { code: "60", titre: "Achats et variations de stocks" },
    { code: "601", titre: "Achats de marchandises" }, 
    { code: "61", titre: "Transports" },
    { code: "611", titre: "Transports sur achats" }, 
    { code: "62", titre: "Services extérieurs a" },
    { code: "63", titre: "Services extérieurs b" }, 
    { code: "64", titre: "Impôts et taxes" },
    { code: "65", titre: "Autres charges" }, 
    { code: "66", titre: "Charges de personnel" },
    { code: "661", titre: "Rémunérations directes versées au personnel national" }, 
    { code: "67", titre: "Frais financiers et charges assimilées" },
    { code: "68", titre: "Dotations aux amortissements" }, 
    { code: "69", titre: "Dotations aux provisions" },
    { code: "70", titre: "Ventes" }, 
    { code: "701", titre: "Ventes de marchandises" }, 
    { code: "702", titre: "Ventes de produits finis" },
    { code: "707", titre: "Produits accessoires" }, 
    { code: "71", titre: "Subventions d'exploitation" },
    { code: "72", titre: "Production immobilisée" }, 
    { code: "73", titre: "Variations de stocks de biens et services" },
    { code: "75", titre: "Autres produits" }, 
    { code: "77", titre: "Revenus financiers et assimilés" },
    { code: "78", titre: "Transferts de charges" }, 
    { code: "79", titre: "Reprises de provisions" },
    { code: "81", titre: "Valeurs comptables des cessions d'immobilisations" }, 
    { code: "82", titre: "Produits des cessions d'immobilisations" },
    { code: "83", titre: "Charges hors activités ordinaires" }, 
    { code: "84", titre: "Produits hors activités ordinaires" },
    { code: "85", titre: "Dotations hors activités ordinaires" }, 
    { code: "86", titre: "Reprises hors activités ordinaires" },
    { code: "87", titre: "Participation des travailleurs" }, 
    { code: "88", titre: "Subventions d'équilibre" },
    { code: "89", titre: "Impôts sur le résultat" }, 
    { code: "90", titre: "Engagements obtenus et accordés" },
    { code: "91", titre: "Contreparties des engagements" }, 
    { code: "92", titre: "Comptes réfléchis" },
    { code: "93", titre: "Comptes de reclassements" }, 
    { code: "94", titre: "Comptes de coûts" },
    { code: "95", titre: "Comptes de stocks" }, 
    { code: "96", titre: "Comptes d'écarts sur coûts préétablis" },
    { code: "97", titre: "Comptes de différences de traitement comptable" }, 
    { code: "98", titre: "Comptes de résultats" },
    { code: "99", titre: "Comptes de liaisons internes" }
];

/* ==========================================================================
   2. ÉTAT DE L'APPLICATION (VARIABLES GLOBALES)
   ========================================================================== */
let modeModification = false;
let ancienCode = "";

/* ==========================================================================
   3. GESTION DE LA BASE DE DONNÉES (LOCALSTORAGE)
   ========================================================================== */
// Charger ou initialiser la base de données locale
function obtenirComptes() {
    const stockes = localStorage.getItem('py_compta_comptes_db');
    if (!stockes) {
        localStorage.setItem('py_compta_comptes_db', JSON.stringify(comptesParDefaut));
        return comptesParDefaut;
    }
    return JSON.parse(stockes);
}

/* ==========================================================================
   4. RENDU VISUEL & AFFICHAGE DOM
   ========================================================================== */
// Afficher proprement les comptes à l'écran
function afficherComptes() {
    const comptes = obtenirComptes();
    const listeDOM = document.getElementById('listeComptesDOM');
    
    if (!listeDOM) return;
    listeDOM.innerHTML = "";

    // Tri automatique par ordre de code numérique
    comptes.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));

    comptes.forEach(c => {
        listeDOM.innerHTML += `
            <li>
                <div class="bloc-gauche">
                    <span class="code">${c.code}</span> 
                    <span class="titre">${c.titre}</span>
                </div>
                <div class="bloc-actions">
                    <button class="btn-op editer" onclick="preparerModification('${c.code}', '${c.titre.replace(/'/g, "\\'")}')" title="Modifier">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-op supprimer" onclick="supprimerCompte('${c.code}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
}

/* ==========================================================================
   5. ACTIONS DU FORMULAIRE (AJOUTER / MODIFIER / ANNULER)
   ========================================================================== */
// Enregistrer (Création d'un compte ou validation de la mise à jour)
function enregistrerCompte() {
    const codeInput = document.getElementById('saisieCode').value.trim();
    const titreInput = document.getElementById('saisieTitre').value.trim();

    if (!codeInput || !titreInput) {
        alert("Oups ! Remplis le code et l'intitulé d'abord. 😉");
        return;
    }

    let comptes = obtenirComptes();

    if (modeModification) {
        // Mode Édition : Mettre à jour le compte existant
        comptes = comptes.map(c => c.code === ancienCode ? { code: codeInput, titre: titreInput } : c);
        annulerModification();
    } else {
        // Mode Création : Empêcher les doublons de code
        if (comptes.some(c => c.code === codeInput)) {
            alert("Ce code de compte existe déjà ! Utilise le bouton crayon pour le modifier.");
            return;
        }
        // Ajouter la nouvelle ligne
        comptes.push({ code: codeInput, titre: titreInput });
    }

    // Sauvegarde et nettoyage
    localStorage.setItem('py_compta_comptes_db', JSON.stringify(comptes));
    document.getElementById('saisieCode').value = "";
    document.getElementById('saisieTitre').value = "";
    
    afficherComptes();
}

// Charger les données d'une ligne dans les champs de saisie pour modification
function preparerModification(code, titre) {
    document.getElementById('saisieCode').value = code;
    document.getElementById('saisieTitre').value = titre;
    
    modeModification = true;
    ancienCode = code;

    document.getElementById('btnEnregistrer').innerHTML = `<i class="fas fa-check"></i> Mettre à jour`;
    document.getElementById('btnAnnuler').style.display = "inline-block";
    document.getElementById('saisieCode').focus();
}

// Réinitialiser les champs et quitter le mode édition
function annulerModification() {
    modeModification = false;
    ancienCode = "";
    document.getElementById('saisieCode').value = "";
    document.getElementById('saisieTitre').value = "";
    document.getElementById('btnEnregistrer').innerHTML = `<i class="fas fa-save"></i> Enregistrer`;
    document.getElementById('btnAnnuler').style.display = "none";
}

/* ==========================================================================
   6. ACTIONS DE SUPPRESSION
   ========================================================================== */
// Retirer un compte définitivement
function supprimerCompte(code) {
    if (confirm(`Es-tu sûr de vouloir supprimer le compte ${code} ?`)) {
        let comptes = obtenirComptes();
        comptes = comptes.filter(c => c.code !== code);
        
        localStorage.setItem('py_compta_comptes_db', JSON.stringify(comptes));
        afficherComptes();
        
        // Si l'élément supprimé était en cours d'édition, on annule l'édition
        if (modeModification && ancienCode === code) {
            annulerModification();
        }
    }
}

/* ==========================================================================
   7. NAVIGATION & LIFECYCLE (CYCLE DE VIE)
   ========================================================================== */
// Retourner au tableau de bord avec un léger délai d'animation
function goBack() {
    setTimeout(() => { 
        window.location.href = "par.html"; 
    }, 200);
}

// Lancer le chargement initial dès que la page est prête
window.onload = afficherComptes;