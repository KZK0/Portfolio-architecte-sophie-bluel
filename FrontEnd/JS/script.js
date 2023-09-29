// ------------- Constante & Variable --------------

const url = 'http://localhost:5678/api/';

let gallery = [];
let galleryFilter = [];
let categories = [];
const elemGallery = document.querySelector(".gallery");
const filtres = document.getElementById('filtres');
const conteneurGalleryModal = document.querySelector('.bloc-project-modal')

const isConnected = localStorage.getItem('token') ? true : false;

login.addEventListener('click', () => {

    // window.open('tonurl','_blank')
    window.location.href = './login.html';
})

// ------------- Affichage des projets --------------

fetch(url + "works", {
    method: "GET"
}).then((result) => {
    return result.json()
}).then(data => {
    gallery = data;
    galleryFilter = data;
    if (isConnected) {
        // console.log("je suis connecté")
        displayGallery(gallery, elemGallery)
        displayGallery(gallery, conteneurGalleryModal)
    } else {
        // console.log("je ne suis pas connecté")
        displayGallery(gallery, elemGallery)
    }
})

function displayGallery(pgallery, elm) {
    elm.innerHTML = '';
    for (let i = 0; i < pgallery.length; i++) {
        let fig = document.createElement('figure');
        let img = document.createElement('img');
        if (!isConnected) {
            let caption = document.createElement('figcaption');
            caption.textContent = pgallery[i].title;
            fig.appendChild(caption)
        }
        img.src = pgallery[i].imageUrl;
        fig.appendChild(img)
        elm.appendChild(fig);
    }
}

// ------------- Affichage des catégories --------------

// if (!isConnected) {
fetch(url + "categories", {
    method: "GET"
}).then((result) => {
    return result.json()
}).then(data => {
    categories = data;
    if (filtres != null && filtres != undefined) {
        displayCategories()
    }

})
// }

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
    if (galleryFilter.length == 0) {
        displayGallery(gallery);
    } else {
        displayGallery(galleryFilter);
    }
}


// ---------------- Ouverture / Fermeture de la modal ------------------
// faire se code uniquement si tu es connecté, sinon ça va buguer
const openModal = document.querySelector('.goModify');
const closeModal = document.querySelector('.modal');
const crossModal = document.getElementById('crossModal')
// const conteneurGalleryModal = document.querySelector('.bloc-project-modal')
// loadGallerieModal();


// function loadGallerieModal() {
//     conteneurGalleryModal.innerHTML = '';

//     for (let i = 0; i < gallery.length; i++) {
//         let fig = document.createElement('figure');
//         let img = document.createElement('img');
//         let caption = document.createElement('figcaption');
//         img.src = gallery[i].imageUrl;
//         caption.textContent = gallery[i].title;
//         fig.appendChild(img)
//         fig.appendChild(caption)
//         conteneurGalleryModal.appendChild(fig);
//     }

// }

crossModal.addEventListener('click', () => {
    closeModale();
})
openModal.addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'flex';
})

closeModal.addEventListener('click', (event) => {
    if (event.target == closeModal)
        closeModale();
})

function closeModale() {
    document.querySelector('.modal').style.display = 'none';
}