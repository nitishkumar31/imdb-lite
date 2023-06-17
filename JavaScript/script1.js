    // Script1 is script for Home(index.html) page 

// Script for open side menu and hide menu when you click on Icon 
var sideOption = document.getElementById("side");
function showMenu() {
    sideOption.style.left = "0";
}
function hideMenu() {
    sideOption.style.left = "-300px";
}

// java script for fetching the API
// this is Api key we get it from TMDb website(IMDb Api)
const API_KEY = 'api_key=49e3be45df1c1a483b5eb9560e3c73ab';
// const API_URL = 'https://api.themoviedb.org/3/movie/550?api_key=49e3be45df1c1a483b5eb9560e3c73ab';
const API_URL = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
// this is the image url of Api
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// we access Element by DOM Api and stores element in variable 
var container = document.getElementById('movies');
var search = document.getElementById('searchMovie');
// this is the previous button
var prevBtn = document.getElementById('prev-page');
// this is the next button
var nextBtn = document.getElementById('next-page');

// count of pages 
let pageNumber = 1;


// calling function to request api 
apiCall(API_URL);
// this is the function to get api data 
function apiCall(url) {
    // Sending a ‘GET’ request involves three steps — creating XMLHttpRequest, opening the HTTP request, and sending the request. Use the below code to use the XHR object:
    const x = new XMLHttpRequest();
    // open a get request with the remote server URL 
    x.open('get', url);
    // send the http request 
    x.send();
    // Once the request is sent, then we can use the event handlers to handle XHR object responses.
    x.onload = function () {
        container.innerHTML="";
        var res = x.response;
        // resp to JSON data 
        var conJson = JSON.parse(res);
        // array of movies 
        var moviesArray = conJson.results;
        // console.log(moviesArray)
        // create the movie cards here 
        moviesArray.forEach(movie => moviesElement(movie));
        // addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
    }
}


// create the home page elements
function moviesElement(movie) {
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    // console.log(movie.poster_path)
    movieElement.innerHTML = `
    <a href="./MoviePage/moviePage.html?id=${movie.id}"><img src=${IMAGE_URL + movie.poster_path} alt="{movie.id}"></a>
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <div class="star-fab">
      <div class="add-movie-to-list" id="${movie.id}" onclick="addMovie(${movie.id})">
      <span class="icon-color"><i class="fas fa-plus"></i></span>
      </div>
        <span class="icon-color"><i class="fa-solid fa-star">&nbsp;</i>${movie.vote_average}</span>
      </div>
    </div>
    <div class="overview">${movie.overview}</div>
    `;
    //  now append this upcoming html in movieElement Container 
    container.appendChild(movieElement);
}

// array to store fav movies 
var favMovies = [];
// this old Movie list array kept previous local storage favorite Movie 
var oldLocalsMov=[];

// function to add movie to fav list 
function addMovie(btnId){
    document.getElementById(btnId).innerHTML = '<span class="icon-color"><i class="fas fa-check"></i></span>';
    // to avoid duplicate movies 
    if(!favMovies.includes(btnId.toString())){
        favMovies.push(btnId.toString());
    }
    // getting array from local storage  
    oldLocalsMov = JSON.parse(localStorage.getItem('MovieArray'));
    if(oldLocalsMov==null){
        // if empty 
        localStorage.setItem('MovieArray', JSON.stringify(favMovies));
    }else{
        // if not empty 
        favMovies.forEach(item=>{
            if(!oldLocalsMov.includes(item)){
                oldLocalsMov.push(item);
            }
        })
        // adding the movie in local storage 
        localStorage.setItem('MovieArray', JSON.stringify(oldLocalsMov));
    }
}


// this is the search function 
search.addEventListener('keyup', function(){
    // input char in the search box
    var input = search.value;
    console.log(input)
    // getting all the movies related to the input in the search option 
    var inputUrl = `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${input}`;
    // https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
    if(input.length !=0){
        apiCall(inputUrl);
    }else{
        window.location.reload();
    }
})


// disable the prev btn when the page is 1
prevBtn.disabled = true;
function disablePBtn() {
    if (pageNumber == 1) prevBtn.disabled = true;
    else prevBtn.disabled = false;
}

// got to next page 
// when pageNumber is greater then 1 then call APi for acceess next page 
nextBtn.addEventListener('click', () => {
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

// got to prev page
//   when page number is 1 then disable btn 
// otherWise call Api Access for prev page 
prevBtn.addEventListener('click', () => {
    if (pageNumber == 1) return;

    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
})
