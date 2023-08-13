//! (fetch refactor dari project db film latihan): async await
const searchButton = document.querySelector('.search-button')
searchButton.addEventListener('click', async function (){
    try {
        const inputKeyword = document.querySelector('.input-keyword')
        const movies = await getMovies(inputKeyword.value)
        updateUI(movies)
    } catch (err) {
        alert(err);
    }
})

function getMovies(keyword) {
    return fetch('http://www.omdbapi.com/?apikey=38e96c2c&s=' +keyword) 
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)            
        }
        return response.json() 
    }) 
    .then(response => {
        if (response.Response === "False") {
            throw new Error(response.Error)
        }
        return response.Search
    })
}

function updateUI(movies){
    let cards = ''
    movies.forEach(m => cards += showCards(m))
    const movieContainer = document.querySelector('.movie-container')
    movieContainer.innerHTML = cards

}

// ! event binding (supaya modal-detail-button masih bisa digunakan meskipun getMovies telah Asynchronous)
document.addEventListener('click', async function(e){
    if(e.target.classList.contains('modal-detail-button')){
        const imdbid = e.target.dataset.imdbid
        const movieDetail = await getMovieDetail(imdbid)
        updateUIDetail(movieDetail)
    }
})
function getMovieDetail(imdbid){
    return fetch('http://www.omdbapi.com/?apikey=38e96c2c&i='+imdbid) 
    .then(response => response.json()) 
    .then(m => m)
}
function updateUIDetail(m){
    const moviedetail = showMovieDetail(m)
    const modalBody = document.querySelector('.modal-body')
    modalBody.innerHTML = moviedetail
}

// ! kumpulan fungsi html fragment
function showCards(m){
    return `<div class="col-md-3">
    <div class="card m-3 justify-content-center" >
        <img src="${m.Poster}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${m.Title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary text-muted">${m.Year}</h6>
            <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">show details</a>
        </div>
    </div>
    </div>`
    
}
function showMovieDetail(m){
    return `
    <div class="">
    <div class="row">
        <div class="col-md-3">
        <img src="${m.Poster}" alt="" class="img-fluid ">

        </div>
        <div class="col-md">
        <ul class="list-group">
            <li class="list-group-item"><h4>${m.Title}</h4></li>
            <li class="list-group-item"><strong>Released : </strong>${m.Released}</li>
            <li class="list-group-item"><strong>Director : </strong>${m.Director}</li>
            <li class="list-group-item"><strong>Actors : </strong>${m.Actors}</li>
            <li class="list-group-item"><strong>Writer : </strong>${m.Writer}</li>
            <li class="list-group-item"><strong>Plot : </strong> <br>${m.Plot}</li>
        </ul>
        </div>
    </div>
    </div>`
}