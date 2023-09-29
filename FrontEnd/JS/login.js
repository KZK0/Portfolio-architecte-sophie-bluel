// ------------- Constante & Variable --------------

const form = document.querySelector('form');

// ------------- Connexion des utilisateurs --------------

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = {};
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;

    await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(async (result) => {
        if (200 != result.status) {
            throw new Error('ne peut pas se connecter')
        }
        return await result.json()
    }).then(data => {
        localStorage.setItem('token', data.token)
        window.location.href = 'indexOut.html'
    }).catch((error) => {
        let elm = document.querySelector('.error');
        elm.innerHTML = error.message;
        elm.style.display = 'flex';
    })


})


document.getElementById('email').addEventListener('focus', () => {
    let elm = document.querySelector('.error');

    elm.style.display = 'none';

})
document.getElementById('password').addEventListener('focus', () => {
    let elm = document.querySelector('.error');

    elm.style.display = 'none';

})

document.getElementById('login').style.fontWeight = "900";



