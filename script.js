let btn = document.forms.film_search.film_search_button;
let modal = document.querySelector('.modal');
let modalCover = document.querySelector('.modalCover');
let index = 1;
async function create() {
    let inde = index;
    let name = await document.forms.film_search.film_name.value;
    let nameStr = await name.split(' ').map(elem => elem + '+').join('').slice(0, -1);
    getFilms(nameStr, inde);
};
btn.addEventListener('click', create);
async function getFilms(str, ind) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${str}&page=${ind}&apikey=de231e10`);
        const data = await response.json();
        showFilms(data);
    } catch (err) {
        return console.error(err);
    }
};

function showFilms(data) {
    document.querySelector('.films').innerHTML = '';
    for (let i = 0; i < data.Search.length; i++) {
        document.querySelector('.films').insertAdjacentHTML('beforeend',
            `<div class="blockInfo">
        <div class="block" style="background-image:url(${data.Search[i].Poster});"></div>
        <div class="title">${data.Search[i].Title}</div>
        <div>${data.Search[i].Type}</div>
        <div>${data.Search[i].Year}</div>
        <div class="id">${data.Search[i].imdbID}</div>
        <input class="moreInfo"type="button" name="film_moreInfo" onclick="showModalWindow()" value="More details">
        </div>`)
    }
};
async function showModalWindow() {
    modalCover.style.display = 'flex';
    let name = event.target.previousElementSibling.textContent;
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${name}&plot=full&apikey=de231e10`);
        const data = await response.json();
        return showInfoAboutFilm(data);
    } catch (err) {
        return console.error(err);
    }
};

function showInfoAboutFilm(data) {
    let boxOffice;
    modal.innerHTML = '';
    document.body.classList.add('stopScrolling');
    if (!data.BoxOffice) {
        boxOffice = 'N/A';
    } else {
        boxOffice = data.BoxOffice;
    }
    modal.insertAdjacentHTML('beforeend',
        ` <div class="img" style="background-image:url(${data.Poster};"></div>
        <div class="textInfo">
        <div class="modalTitle">${data.Title}</div>
        <div>${data.Genre}</div>
        <div>${data.Plot}</div>
        <div><span>Written by:</span>${data.Writer}</div>
        <div><span>Directed by:</span>${data.Director}</div>
        <div><span>Staring:</span>${data.Actors}</div>
        <div><span>Box Office:</span>${boxOffice}</div>
        <div><span>Awards:</span>${data.Awards}</div>
        <div><span>Ratings:</span></div>
        </div>`);
    for (let i = 0; i < data.Ratings.length; i++) {
        document.querySelector('.textInfo').insertAdjacentHTML('beforeend', `<div>${data.Ratings[i].Source}: ${data.Ratings[i].Value}</div>`)
    }
};
window.addEventListener('click', function (e) {
    document.body.classList.remove('stopScrolling');
    if (e.target == modalCover) {
        modalCover.style.display = 'none';
    }
});

function plus() {
    if (index >= 1 && index < 99) {
        index++;
        return create();
    }
};

function minus() {
    if (index >= 2 && index < 99) {
        index--;
        return create();
    }
}