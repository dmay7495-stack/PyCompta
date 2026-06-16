 // Fonction pour gérer et animer les erreurs visuelles
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const card = document.getElementById('carte');
        const statusMessage = document.getElementById('messageStatut');
        const body = document.getElementById('corpsPrincipal');
        const btn = document.getElementById('boutonInscription');

        // Ajout des classes d'erreur
        input.classList.add('input-error');
        card.classList.add('shake');
        body.classList.add('error-mode');
        btn.classList.add('btn-error');
        
        statusMessage.textContent = message;
        statusMessage.style.color = 'var(--error-color)';

        // Retire le shake pour pouvoir le rejouer au prochain clic
        setTimeout(() => {
            card.classList.remove('shake');
        }, 500);

        // Réinitialisation après 3 secondes
        setTimeout(() => {
            input.classList.remove('input-error');
            body.classList.remove('error-mode');
            btn.classList.remove('btn-error');
            statusMessage.textContent = 'Création de compte';
            statusMessage.style.color = '#d9e88a';
        }, 3000);
    }

    // Gestion de l'inscription avec LocalStorage
    function handleRegister() {
        const user = document.getElementById('regNomUtilisateur').value.trim();
        const pass = document.getElementById('regMotDePasse').value;
        const confirmPass = document.getElementById('regConfirmMotDePasse').value;
        const statusMessage = document.getElementById('messageStatut');

        // Validations des champs
        if (!user) return showError('regNomUtilisateur', 'Nom d\'utilisateur requis');
        if (!pass) return showError('regMotDePasse', 'Mot de passe requis');
        if (pass !== confirmPass) return showError('regConfirmMotDePasse', 'Les mots de passe diffèrent');

        // Récupération de la liste d'utilisateurs existante
        let users = JSON.parse(localStorage.getItem('pycompta_users')) || {};
        
        // Vérification des doublons
        if (users[user]) {
            return showError('regNomUtilisateur', 'Cet utilisateur existe déjà');
        }

        // Sauvegarde du nouvel utilisateur
        users[user] = { password: pass };
        localStorage.setItem('pycompta_users', JSON.stringify(users));

        // Feedback de succès
        statusMessage.textContent = 'Inscription réussie ! Redirection...';
        statusMessage.style.color = '#a3e635';
        
        // Redirection vers ta page de connexion (login.html) après 1.5 seconde
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }