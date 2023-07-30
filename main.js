"use strict";
const modalWindow = document.querySelector('.modalWindow')
const mWImg = document.querySelector(".modalWindow_img")
const mWName = document.querySelector(".modalWindow_text_nameRes")
const mWStatus = document.querySelector(".modalWindow_text_statusRes")
const mWSpecies = document.querySelector(".modalWindow_text_speciesRes")
const mWOrigin = document.querySelector(".modalWindow_text_originRes")
const mWLocation = document.querySelector(".modalWindow_text_locationRes")
const mWEpisode = document.querySelector(".modalWindow_text_episodeRes")
const mWGender = document.querySelector(".modalWindow_text_genderRes")
const height = document.body.offsetHeight
const screenHeight = window.innerHeight
const scrolled = window.scrollY
const threshold = height - screenHeight / 4
const position = scrolled + screenHeight
const loadAnimation = document.querySelector(".ring")
const contener = document.querySelector('.contener');
const page = document.querySelector('.page')
const options = `{   month: 'long', day: 'numeric', , year: 'numeric'}`;
// pagination
const h3 = document.querySelector("h3")
h3.style.right = "2px"
const onOff = document.querySelector("#on_off")
const pagin = document.querySelector('.pagination')
pagin.style.display = 'none'
const toggle = document.querySelector('#toggle')
const back = document.querySelector("#back")
const next = document.querySelector("#next")
const p1 = document.querySelector("#p1")
let ArrayGetServerAll = [];
let ArrayGetEpisode = [];
let HowManyLoadedPage = 1;
let dataFirstEpisodes = []
let episode = ""
let mWImgstatus = true
let pageOnServer = 1
async function getAllArrayServer() {
   const AllDate = await fetch(`https://rickandmortyapi.com/api/character`, {
      method: 'GET'
   }).then(response => response.json()).then(data => {
      ArrayGetServerAll.push(data)
      pageOnServer = ArrayGetServerAll[0].info.pages
      return data
   }).catch(e => console.error(e));

}

function newPage() {
   const nowPage = document.createElement('div')
   nowPage.className = 'page'
   contener.appendChild(nowPage)
}
getAllArrayServer()
async function fetchMovies(num) {
   const page = document.querySelector('.page')
   const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${num}`, {
      method: 'GET'
   }).then(data => {
      pagination()
      loadAnimation.style.display = 'block';
      return data
   }).then(response => {
      loadAnimation.innerHTML = "Loading"
      return response.json()
   }).then(data => {
      for (let i = 0; i < data.results.length; i++) {
         const personage = document.createElement('div');
         const backgroundImg = document.createElement('div');
         const img = document.createElement('img');
         const bGText = document.createElement('h5');
         bGText.className = 'bGText';
         backgroundImg.className = "backgroundImg"
         backgroundImg.id = data.results[i].name;
         personage.className = "personage"
         personage.id = data.results[i].name;
         img.src = data.results[i].image;
         img.alt = data.results[i].name;
         bGText.innerHTML = data.results[i].name
         backgroundImg.appendChild(bGText);
         personage.appendChild(backgroundImg);
         backgroundImg.appendChild(img);
         page.append(personage)

      }
      return data
   }).then(data => {
      loadAnimation.style.display = 'none';
      return data
   }).then(data => {
      window.addEventListener('click', (eo) => {
         eo = eo || window.event;
         data.results.forEach(element => {
            if (mWImgstatus === true && eo.target.alt === undefined || event.target.className === "modalWindow" || event.target.className === "modalWindow_img" || eo.target.className === "XClosed") {
               modalWindow.style.display = 'none'
               mWImgstatus = false
            }
            if (element.name == eo.target.alt || element.name === eo.target.id ) {
               async function fetchLocation(num) {
                  const location = await fetch(element.location.url, {
                     method: 'GET'
                  }).then(data => {
                     return data
                  }).then(response => response.json()).then(response => mWLocation.innerHTML = response.name).catch(e => console.error("error loading location from server", e))
               }
               async function fetchEpisode() {
                  for (let i = 0; i < element.episode.length; i++) {
                     loadArrayEpisodes(i)
                  }
                  async function loadArrayEpisodes(i) {
                     const arrayEpisode = await fetch(element.episode[i], {
                           method: 'GET'
                        }).then(data => data).then(response => {
                           return response.json()
                        }).then(data => {
                           ArrayGetEpisode.push(data)
                           return data
                        }).then(d => {
                           // sort Array for first episode
                           if (ArrayGetEpisode.length > 0) {
                              ArrayGetEpisode.forEach(elem => {
                                 let data = new Date(elem.air_date)
                                 dataFirstEpisodes.push(data.getTime())
                                 dataFirstEpisodes = dataFirstEpisodes.sort((a, b) => a = b)
                                 let firstDate = new Date()
                                 firstDate.setTime(dataFirstEpisodes[0])
                                 firstDate = firstDate.toLocaleDateString('en', options)
                                 if (data.toLocaleDateString('en', options) === firstDate) {
                                    mWEpisode.innerHTML = elem.name
                                 }
                              });
                           }
                           loadAnimation.style.display = 'block';
                           return d
                        }).then(elem => fetchLocation()).then(elem => {
                           fetchOrigin(), loadAnimation.style.display = 'none'
                        })
                        .catch(e => console.error(e));
                  }
               }
               async function fetchOrigin() {
                  const episode = await fetch(element.origin.url, {
                        method: 'GET'
                     }).then(data => {
                        return data
                     }).then(response => response.json())
                     .then(response => {
                        mWOrigin.innerHTML = response.name
                        return response
                     })
                     .catch(e => console.error("error loading Episode from server", e), mWOrigin.innerHTML = "Unknow")
                  modalWindow.style.display = 'block'

               }
               fetchEpisode()
               modalWindow.style.bottom = innerWidth / 2 - 302 + 'px'
               mWImg.style.top = 0
               mWImg.name = element.name
               mWName.innerHTML = element.name
               mWStatus.innerHTML = element.status
               mWGender.innerHTML = element.gender
               mWSpecies.innerHTML = element.species
               mWImg.src = element.image
               mWImg.name = "true"
               mWImg.style.top = "0px"
               mWImg.style.left = "0px"
               ArrayGetEpisode.length = 0
               dataFirstEpisodes.length = 0

            }
         });
      }, true)
   }).catch(error => {
      loadAnimation.innerHTML = error.message
      loadAnimation.style.fontSize = "10px"
      loadAnimation.style.color = "red"
      console.error(error);
   });
}
fetchMovies(1)
// load function for new page
function checkPosition() {
   if (position >= threshold) {
      if (!toggle.checked) {
         if (HowManyLoadedPage < ArrayGetServerAll[0].info.pages) {
            HowManyLoadedPage++
            fetchMovies(HowManyLoadedPage)
         } else HowManyLoadedPage = 0
      }
   }
};

// slow loading feature for scrolling
function throttle(callee, timeout) {
   let timer = null
   return function perform(...args) {
      if (timer) return
      timer = setTimeout(() => {
         callee(...args)
         clearTimeout(timer)
         timer = null
      }, timeout)
   }
}
// pagination

function pagination() {
   p1.innerHTML = HowManyLoadedPage
}


window.addEventListener('scroll', throttle(checkPosition, 550))
window.addEventListener('resize', throttle(checkPosition, 550))

window.addEventListener('click', (eo) => {

   eo = eo || window.event;
   const page = document.querySelector('.page')
   //    pagination switcher
   if (!toggle.checked) {
      h3.style.right = "2px"
      h3.style.left = ""
      pagin.style.display = 'none'
      onOff.innerHTML = "Pagination OFF"
   } else if (toggle.checked) {

      h3.style.left = "2px"
      h3.style.right = ""
      contener.removeChild(page)
      newPage()
      fetchMovies(HowManyLoadedPage)
      pagin.style.display = 'block'
      onOff.innerHTML = "Pagination ON"
   }


   if (eo.target.id === "back") {
      const page = document.querySelector('.page')
      contener.removeChild(page)
      newPage()

      if (HowManyLoadedPage > 1) {
         HowManyLoadedPage--
      } else if (HowManyLoadedPage < 1) {
         HowManyLoadedPage = 1
      }
      fetchMovies(HowManyLoadedPage)
      pagination()
   } else if (eo.target.id === "next") {
      const page = document.querySelector('.page')
      if (pageOnServer > HowManyLoadedPage) {
         contener.removeChild(page)
         newPage()
         HowManyLoadedPage++;
         fetchMovies(HowManyLoadedPage)
         pagination()
      }
   }
});
// scroll up function with animation
function up() {
   let timer
   let top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
   if (top > 0) {
      window.scrollBy(0, ((top + 100) / -10));
      timer = setTimeout('up()', 20);
   } else clearTimeout(timer);
   return false;
}
