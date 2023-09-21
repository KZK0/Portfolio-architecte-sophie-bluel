// ------------- Constante & Variable --------------

const form = document.querySelector('form');

// ------------- Connexion des utilisateurs --------------

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const user = {};
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;
   
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers:{
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)       
    }).then((result) => {
        return result.json()
    }).then(data => {       
       console.log(data)
        if(data.message){
            let elm =  document.querySelector('.error');
            elm.innerHTML = data.message;
            elm.style.display = 'flex';  
        }else{
            localStorage.setItem('token',data.token)
            window.location.href = 'indexOut.html'
        }
       
       
    })


})


document.getElementById('email').addEventListener('focus',() =>{
    let elm =  document.querySelector('.error');
   
    elm.style.display = 'none';

})
document.getElementById('password').addEventListener('focus',() =>{
    let elm =  document.querySelector('.error');
   
    elm.style.display = 'none';

})

document.getElementById('login').style.fontWeight = "900";



