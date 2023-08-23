const url = 'http://localhost:5678/api/';

let gallery = [];
const elemGallery = document.querySelector(".gallery");


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
        img.src = gallery[i].imageUrl;
        fig.appendChild(img)
        elemGallery.appendChild(fig);
    }
}

// function init() {

// }

// init();