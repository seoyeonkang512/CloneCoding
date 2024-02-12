// Consts
const apikey = "7543524441a260664a97044b8e2dc621";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}&language=ko&region=ko`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}&language=ko&region=ko`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=ko&region=ko`,

  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`,
};

// Boots up the app
function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPaths.fetchTrending, "지금 뜨는 콘텐츠")
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}

function buildBannerSection(movie) {
  const bannerCont = document.getElementById("banner-section");

  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

  const div = document.createElement("div");

  div.innerHTML = `
            <h2 class="banner__title">${movie.title}</h2>
            <p class="banner__overview">${
              movie.overview && movie.overview.length > 200
                ? movie.overview.slice(0, 200).trim() + "..."
                : movie.overview
            }</p>
            <div class="action-buttons-cont">
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; 재생</button>
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp;&nbsp; 상세 정보</button>
            </div>
        `;
  div.className = "banner-content container";

  bannerCont.append(div);
}

function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndbuildMovieSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          );
        });
      }
      // console.table(movies);
    })
    .catch((err) => console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      // console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies.slice(0, 20), categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}
let currentSlideIndex = 0;

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);

  const moviesCont = document.getElementById("movies-cont");

  const moviesListHTML = list
    .map((item) => {
      return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    })
    .join("");

    const moviesSectionHTML = `
    <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">전체 탐색</span></h2>
    <div class="movies-slider-container">
      <button class="slider-button slider-prev" onclick="changeSlide('${categoryName.replace(/\s+/g, '-').toLowerCase()}', -1)">
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-chevron-left">
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
      </button>
      <div class="movies-row" id="${categoryName.replace(/\s+/g, '-').toLowerCase()}-slider">
        ${moviesListHTML}
      </div>
      <button class="slider-button slider-next" onclick="changeSlide('${categoryName.replace(/\s+/g, '-').toLowerCase()}', 1)">
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-chevron-right">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
    </div>
  `;
  
  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;
  
  // append html into movies container
  moviesCont.append(div);  
}


// 슬라이드 변경 함수
function changeSlide(sliderId, direction) {
  const slides = document.querySelectorAll(`#${sliderId}-slider .movie-item`);

  // 현재 슬라이드 인덱스를 증가 또는 감소시킴
  currentSlideIndex += direction * 5;

  // 처음 슬라이드로 되돌아가기 위해 음수로 될 경우 보정
  if (currentSlideIndex < 0) {
    currentSlideIndex = 0;
  }

  // 마지막 슬라이드를 벗어나면 처음 슬라이드로
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  }

  // 모든 슬라이드 숨기고 현재 슬라이드부터 5개 표시
  slides.forEach((slide, index) => {
    if (index >= currentSlideIndex && index < currentSlideIndex + 5) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });
}



function searchMovieTrailer(movieName, iframId) {
  if (!movieName) return;

  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const bestResult = res.items[0];

      const elements = document.getElementById(iframId);
      console.log(elements, iframId);

      const div = document.createElement("div");
      div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`;

      elements.append(div);
    })
    .catch((err) => console.log(err));
}

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    // header ui update
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});
