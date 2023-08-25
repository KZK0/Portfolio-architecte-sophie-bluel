// Constante

const url = 'http://localhost:5678/api/';

let gallery = [];
const elemGallery = document.querySelector(".gallery");
const filtres = document.querySelector('.filtres');


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

// function init() {

// }

// init();