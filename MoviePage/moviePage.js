// // Script for open side menu and hide menu when you click on Icon
var sideOption = document.getElementById("side");
function showMenu() {
  sideOption.style.left = "0";
}
function hideMenu() {
  sideOption.style.left = "-300px";
}

// we access Element by DOM Api and stores element in variable
var container = document.getElementById("movies");
var search = document.getElementById("searchMovie");

// this is Api key we get it from TMDb website(IMDb Api)
const API_KEY = "api_key=49e3be45df1c1a483b5eb9560e3c73ab";
// base Url of Api
const BASE_URL = "https://api.themoviedb.org/3";
// image url of Api
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// geting the movie id and details
let id = "";
const urlParams = new URLSearchParams(location.search);
for (const [key, value] of urlParams) {
  id = value;
  // console.log('id', id)
}
// we create link of single movie item by IMDb Api
let link = `/movie/${id}?language=en-US&append_to_response=videos&`;
let find_url = BASE_URL + link + API_KEY;
// console.log(find_url);

// call apiCall function with find_url Arguments
apiCall(find_url);

// function to create element
function apiCall(url) {
  console.log(url);
  // Sending a ‘GET’ request involves three steps — creating XMLHttpRequest, opening the HTTP request, and sending the request. Use the below code to use the XHR object:
  const x = new XMLHttpRequest();
  // open a get request with the remote server URL
  x.open("get", url);
  // send the http request
  x.send();
  // Once the request is sent, then we can use the event handlers to handle XHR object responses.
  x.onload = function () {
    document.getElementById("movie-display").innerHTML = "";
    var res = x.response;
    var Json = JSON.parse(res);
    getMovies(Json);
  };
  x.onerror = function () {
    window.alert("cannot get");
  };
}

// filter video in array
function filterArray(obj) {
  var vtitle = obj.name;
  var rg = /Official Trailer/i;
  if (vtitle.match(rg)) {
    return obj;
  }
}

function getMovies(myJson) {
  // get the movie youtube link
  var MovieTrailer = myJson.videos.results.filter(filterArray);
  // get the background image for the page
  document.body.style.backgroundImage = `url(${
    IMAGE_URL + myJson.backdrop_path
  })`;
  var movieDiv = document.createElement("div");
  movieDiv.classList.add("each-movie-page");

  // setting the youtube link
  var youtubeURL;
  if (MovieTrailer.length == 0) {
    if (myJson.videos.results.length == 0) {
      youtubeURL = "";
    } else {
      youtubeURL = `https://www.youtube.com/embed/${myJson.videos.results[0].key}`;
    }
  } else {
    youtubeURL = `https://www.youtube.com/embed/${MovieTrailer[0].key}`;
  }

  // html for the movie details page
  movieDiv.innerHTML = `
        <div class="movie-poster">
            <img src=${IMAGE_URL + myJson.poster_path} alt="Poster">
        </div>
        <div class="movie-details">
            <div class="title">
                ${myJson.title}
            </div>

            <div class="tagline">${myJson.tagline}</div>

            <div style="display: flex;"> 
                <div class="movie-duration">
                    <b><i class="fas fa-clock">&nbsp;</i></b> ${myJson.runtime}m
                </div>
                <div class="release-date">
                <i class="fa-solid fa-clapperboard">&nbsp;</i> ${
                  myJson.release_date
                }
                </div>
            </div>

            <div class="rating">
                <b><small>IMDb RATING</small></b>: <b>${
                  myJson.vote_average
                }</b> <small>/10</small>
            </div>

            <div class="trailer-div" id="trailer-div-btn">
                <span>Watch Trailer&emsp;</span> <i class="fa-solid fa-film"></i>
            </div>
              <span><iframe width="560" height="300" src=${youtubeURL} title="YouTube video player" frameborder="0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ></iframe ></span >
          
            <div class="plot">
                ${myJson.overview}
            </div>
        </div>
    `;
  //    now append this upcoming html in movie display container
  document.getElementById("movie-display").appendChild(movieDiv);
}
