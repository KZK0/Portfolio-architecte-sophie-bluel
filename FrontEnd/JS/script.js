// ------------- Constante & Variable --------------

const url = 'http://localhost:5678/api/';

let gallery = [];
let galleryFilter = [];
let categories = [];
const elemGallery = document.querySelector(".gallery");
const filtres = document.getElementById('filtres');
const conteneurGalleryModal = document.querySelector('.bloc-project-modal');
const SecondConteneurGalleryModal = document.querySelector('.bloc-project-modal-two');

const isConnected = localStorage.getItem('isConnected') == 'true' ? true : false;


login.addEventListener('click', () => {

    // window.open('tonurl','_blank')
    localStorage.removeItem('token')
    localStorage.setItem('isConnected', false)
    window.location.href = '../pages/login.html';
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


        displayGallery(gallery, elemGallery)
    }
})

function displayGallery(pgallery, elm) {

    elm.innerHTML = '';
    for (let i = 0; i < pgallery.length; i++) {
        let fig = document.createElement('figure');
        let img = document.createElement('img');
        img.src = pgallery[i].imageUrl;
        fig.appendChild(img)
        if (!isConnected) {
            let caption = document.createElement('figcaption');
            caption.textContent = pgallery[i].title;
            fig.appendChild(caption)
        }

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
        displayGallery(gallery, elemGallery);
    } else {
        displayGallery(galleryFilter, elemGallery);
    }
}


// ---------------- Ouverture / Fermeture de la modal ------------------

const openModal = document.querySelector('.goModify');
const closeModal = document.querySelector('.modal');
const crossModal = document.getElementById('crossModal')


if (isConnected) {

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

    // ---------------- Ajouter un projet / Supprimer un projet ------------------

    const addProject = document.getElementById('addProject');

    addProject.addEventListener('click', (event) => {
        conteneurGalleryModal.innerHTML = '';

        conteneurGalleryModal.classList.remove('bloc-project-modal');
        conteneurGalleryModal.classList.add('bloc-project-modal-two');

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('conteneurImg');
        // Création du conteneur de l'image

        const img = document.createElement('img');
        img.src = '../assets/icons/add Picture.svg'
        // Création de l'image à l'intérieur du conteneur

        const AddPicture = document.createElement('button');
        AddPicture.textContent = '+ Ajouter photo';
        AddPicture.classList.add('AddPicModal');
        AddPicture.classList.add('picModalIn');
        // Création du bouton permettant d'ajouter une photo

        AddPicture.addEventListener('mouseenter', () => {
            img.classList.add('picModalIn');
            AddPicture.classList.add('picModalIn');
        })
        AddPicture.addEventListener('mouseout', () => {
            img.classList.remove('picModalIn');
            AddPicture.classList.remove('picModalIn');
        })
        // Effet d'opacity sur le bouton et l'image

        const UnderButtonText = document.createElement('p');
        UnderButtonText.textContent = 'JPG, PNG: 4mo max';
        UnderButtonText.classList.add('UnderButton');
        // Création du paragraphe sous le bouton d'ajout de photo

        const TitreProjet = document.createElement('form');
        TitreProjet.setAttribute("method", "post");


        imgDiv.appendChild(img)
        imgDiv.appendChild(AddPicture)
        imgDiv.appendChild(UnderButtonText)
        conteneurGalleryModal.appendChild(imgDiv)
        conteneurImg.appendChild(AddPicture)
        conteneurImg.appendChild(UnderButtonText)

        //TODO : ici ajouter la fleche de retour, ne pas oublier de mettre l'event sur la fleche
        const contenerArrow = document.querySelector('#crossModal');
        const arrow = document.createElement('i');
        arrow.classList.add('fa-solid')
        arrow.classList.add('fa-arrow-left')
        arrow.classList.add('fa-xl')
        contenerArrow.appendChild(arrow)

        arrow.addEventListener('click', () => {
            console.log('retour')
        })

    })
}