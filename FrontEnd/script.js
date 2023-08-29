// ------------- Constante & Variable --------------

const url = 'http://localhost:5678/api/';

let gallery = [];
let categories = [];
const elemGallery = document.querySelector(".gallery");
const filtres = document.getElementById('filtres');

// ------------- Affichage des projets --------------

fetch(url + "works", {
    method: "GET"
}).then((result) => {
    return result.json()
}).then(data => {
    gallery = data;
    displayGallery()
})

function displayGallery() {
    for (let i = 0; i < gallery.length; i++) {
        let fig = document.createElement('figure');
        let img = document.createElement('img');
        let caption = document.createElement('figcaption');
        img.src = gallery[i].imageUrl;
        caption.textContent = gallery[i].title;
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
    btn.setAttribute('data-id', 0)
    filtres.appendChild(btn)
    for (let i = 0; i < categories.length; i++) {
        btn = document.createElement('button')
        btn.textContent = categories[i].name
        btn.setAttribute('data-id', categories[i].id)
        filtres.appendChild(btn)
    }
}