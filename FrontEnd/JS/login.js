// ==============================================================================
// ------------- Constante & Variable --------------
// ==============================================================================

const form = document.querySelector('form');
// On récupère le formulaire de connexion dans la page login

// ==============================================================================
// ------------- Connexion des utilisateurs --------------
// ==============================================================================

form.addEventListener('submit', async (e) => {
    // Écouteur d'événement sur la soumission du formulaire
    e.preventDefault();
    // Empêche le comportement par défaut du formulaire (rechargement de la page)
    const user = {};
    // Création d'un objet utilisateur vide
    user.email = document.getElementById('email').value;
    // Récupération de la valeur du champ 'email' et assignation à la propriété 'email' de l'objet utilisateur
    user.password = document.getElementById('password').value;
    // Récupération de la valeur du champ 'password' et assignation à la propriété 'password' de l'objet utilisateur

    await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        // Utilisation de l'API Fetch pour effectuer une requête POST vers l'endpoint de connexion du serveur local
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
        // Envoi des données de l'utilisateur au serveur au format JSON
    }).then(async (result) => {
        // Vérification de la réponse du serveur
        if (200 != result.status) {
            throw new Error('Adresse email et/ou mot de passe invalide')
            // En cas de code de statut différent de 200, une erreur est lancée
        }
        return await result.json()
        // Récupération des données JSON de la réponse
    }).then(data => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('isConnected', true)
        // Stockage du jeton (token) et du statut de connexion dans le stockage local
        window.location.href = 'indexOut.html'
        // Redirection vers la page 'indexOut.html' après une connexion réussie
    }).catch((error) => {
        let elm = document.querySelector('.error');
        elm.innerHTML = error.message;
        elm.style.display = 'flex';
        // En cas d'erreur, affichage du message d'erreur dans un élément avec la classe 'error'
    })


})


document.getElementById('email').addEventListener('focus', () => {
    // Ajout d'un écouteur d'événement 'focus' au champ 'email' pour masquer le message d'erreur lorsqu'il gagne le focus
    let elm = document.querySelector('.error');
    // Sélection de l'élément avec la classe 'error'

    elm.style.display = 'none';
    // Masquer l'élément d'erreur en modifiant sa propriété de style

})
document.getElementById('password').addEventListener('focus', () => {
    // Ajout d'un écouteur d'événement 'focus' au champ 'password' pour masquer le message d'erreur lorsqu'il gagne le focus
    let elm = document.querySelector('.error');
    // Sélection de l'élément avec la classe 'error'

    elm.style.display = 'none';
    // Masquer l'élément d'erreur en modifiant sa propriété de style

})

document.getElementById('login').style.fontWeight = "900";
// Modification du style de l'élément avec l'ID 'login' en changeant la fontweight


const SeConnecter = document.querySelector('.btn-connect-base');
// Sélection de l'élément avec la classe 'btn-connect-base'
form.addEventListener('input', (e) => {
    // Ajout d'un écouteur d'événement 'input' au formulaire pour activer/désactiver le bouton de connexion en fonction de la longueur du texte dans les champs

    if (e.target.value.length > 0) {
        // Vérification de la longueur du texte dans le champ actuel
        SeConnecter.classList.replace('btn-connect-base', 'btn-connect');
        // Modification de la classe pour activer le style du bouton de connexion
        SeConnecter.disabled = false;
        // Activation du bouton de connexion
    } else {
        SeConnecter.classList.replace('btn-connect', 'btn-connect-base');
        // Modification de la classe pour désactiver le style du bouton de connexion
        SeConnecter.disabled = true;
        // Désactivation du bouton de connexion
    }
})