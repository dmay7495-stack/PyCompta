function generateAll() {
    const journal = JSON.parse(localStorage.getItem('py_compta_db')) || [];
    const balances = {};

    // Calcul des soldes par compte
    journal.forEach(e => {
        if(!balances[e.account]) balances[e.account] = { d: 0, c: 0 };
        balances[e.account].d += parseFloat(e.debit || 0);
        balances[e.account].c += parseFloat(e.credit || 0);
    });

    let tActif = 0, tPassif = 0, tCharges = 0, tProduits = 0;
    let encaissements = 0, decaissements = 0;

    const bodyActif = document.getElementById('bodyActif');
    const bodyPassif = document.getElementById('bodyPassif');
    const bodyRes = document.getElementById('bodyResultat');

    bodyActif.innerHTML = ""; 
    bodyPassif.innerHTML = ""; 
    bodyRes.innerHTML = "";

    Object.keys(balances).sort().forEach(acc => {
        const solde = balances[acc].d - balances[acc].c;
        const absSolde = Math.abs(solde);
        const classe = acc.charAt(0);

        // Répartition Bilan (Classes 1 à 5)
        if ("12345".includes(classe)) {
            if (solde >= 0 && !"1".includes(classe)) {
                tActif += absSolde;
                bodyActif.innerHTML += `<tr><td>${acc}</td><td class="valeur">${absSolde.toLocaleString()}</td></tr>`;
            } else { 
                tPassif += absSolde;
                bodyPassif.innerHTML += `<tr><td>${acc}</td><td class="valeur">${absSolde.toLocaleString()}</td></tr>`;
            }
        }
        
        // Répartition Compte de Résultat (Classes 6 et 7)
        if (classe === '6') {
            tCharges += absSolde;
            bodyRes.innerHTML += `<tr><td>${acc} - Charges</td><td class="valeur">${absSolde.toLocaleString()}</td><td class="valeur">-</td></tr>`;
        }
        if (classe === '7') {
            tProduits += absSolde;
            bodyRes.innerHTML += `<tr><td>${acc} - Produits</td><td class="valeur">-</td><td class="valeur">${absSolde.toLocaleString()}</td></tr>`;
        }

        // Flux de trésorerie (Classe 5)
        if (classe === '5') {
            encaissements += balances[acc].d;
            decaissements += balances[acc].c;
        }
    });

    // Calcul du résultat net
    const resultatNet = tProduits - tCharges;
    
    // Mise à jour des totaux du Bilan
    document.getElementById('totalActif').innerText = tActif.toLocaleString();
    document.getElementById('totalPassif').innerText = (tPassif + resultatNet).toLocaleString(); 

    // Affichage du résultat net avec style dynamique
    const resEl = document.getElementById('valFinalResultat');
    resEl.innerText = resultatNet.toLocaleString() + " FC";
    resEl.className = resultatNet >= 0 ? "valeur resultat-positif" : "valeur resultat-negatif";

    // Mise à jour du tableau des flux
    document.getElementById('fluxPlus').innerText = "+ " + encaissements.toLocaleString();
    document.getElementById('fluxMoins').innerText = "- " + decaissements.toLocaleString();
    document.getElementById('tresoFin').innerText = (encaissements - decaissements).toLocaleString() + " FC";
}

// Gestion du changement d'onglets
function showTab(id) {
    document.querySelectorAll('.section-rapport').forEach(s => s.classList.remove('actif'));
    document.querySelectorAll('.bouton-onglet').forEach(b => b.classList.remove('actif'));
    
    document.getElementById(id).classList.add('actif');
    event.currentTarget.classList.add('actif');
}

window.onload = generateAll;