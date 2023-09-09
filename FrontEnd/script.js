// ------------- Constante & Variable --------------

const url = 'http://localhost:5678/api/';

let gallery = [];
let galleryFilter = [];
let categories = [];
const elemGallery = document.querySelector(".gallery");
const filtres = document.getElementById('filtres');
const login = document.getElementById('login');

login.addEventListener('click', ()=>{

    // window.open('tonurl','_blank')
    window.location.href='./login.html';
    login.style.fontWeight = '600';
})

// ------------- Affichage des projets --------------

fetch(url + "works", {
    method: "GET"
}).then((result) => {
    return result.json()
}).then(data => {
    gallery  = data;
    galleryFilter = data;
    displayGallery(gallery)
})

function displayGallery(pgallery) {
    elemGallery.innerHTML = '';
    for (let i = 0; i < pgallery.length; i++) {
        let fig = document.createElement('figure');
        let img = document.createElement('img');
        let caption = document.createElement('figcaption');
        img.src = pgallery[i].imageUrl;
        caption.textContent = pgallery[i].title;
        fig.appendChild(img)
        fig.appendChild(caption)
        elemGallery.appendChild(fig);
    }
}

// ------------- Affichage des catégories --------------
fetch(url + "categories", {
    method: "GET"
}).then((result) => {
    return result.json()
}).then(data => {
    categories = data;
    displayCategories()
})

function displayCategories() {
    let btn = document.createElement('button')
    btn.textContent = 'Tous'
    btn.setAttribute('data-id', 0);    
    btn.addEventListener('click', (e) => {
        sortProjects(e)
    });
    
    filtres.appendChild(btn)
    for (let i = 0; i < categories.length; i++) {
        btn = document.createElement('button');
        btn.textContent = categories[i].name;
        btn.setAttribute('data-id', categories[i].id);
        btn.addEventListener('click', (e) => {
            sortProjects(e)
        });
        filtres.appendChild(btn)
    }
}
const sortProjects = (e) => {
     galleryFilter = gallery.filter(item => item.categoryId == e.target.getAttribute('data-id'));
     if(galleryFilter.length == 0){       
        displayGallery(gallery);
     }else{
        displayGallery(galleryFilter);
     }    
}
