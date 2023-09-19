// ------------- Constante & Variable --------------

const form = document.querySelector('form');

// ------------- Connexion des utilisateurs --------------

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const user = {};
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;
    console.log(user);
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers:{
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)       
    }).then((result) => {
        console.log(result);
        if(result.status != 200){
           console.log(result)
        }
        return result.json()
    }).then(data => {       
        localStorage.setItem('token',data.token)
        window.location.href = 'indexOut.html'
    })


})




