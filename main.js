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
const options = `{   month: 'long', day: 'numeric', , year: 'numeric'}`;
let ArrayGetServerAll = [];
let ArrayGetEpisode = [];
let HowManyLoadedPage = 1;
let dataFirstEpisodes = []
let episode = ""
let mWImgstatus = true
async function getAllArrayServer() {
    const AllDate = await fetch(`https://rickandmortyapi.com/api/character`, {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        ArrayGetServerAll.push(data)
    });
    // ///////////////////////////////////////////////////////////////
}
getAllArrayServer()
async function fetchMovies(num) {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${num}`, {
        method: 'GET'
    }).then(data => {
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
            personage.id = data.results[i].name;
            img.src = data.results[i].image;
            img.alt = data.results[i].name;
            bGText.innerHTML = data.results[i].name
            backgroundImg.appendChild(bGText);
            personage.appendChild(backgroundImg);
            backgroundImg.appendChild(img);
            contener.appendChild(personage)
        }
        return data
    }).then(data => {
        loadAnimation.style.display = 'none';
        return data
    }).then(data => {
        window.addEventListener('click', (eo) => {
            eo = eo || window.event;
            data.results.forEach(element => {
                if (mWImgstatus === true && eo.target.alt === undefined || event.target.className == "modalWindow" || event.target.className == "modalWindow_img") {
                    modalWindow.style.display = 'none'
                    mWImgstatus = false
                }
                if (element.name == eo.target.alt) {
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
                                return d
                            }).then(elem => fetchLocation()).then(elem => fetchOrigin())
                        }
                    }
                    async function fetchOrigin() {
                        const episode = await fetch(element.origin.url, {
                            method: 'GET'
                        }).then(data => {
                            return data
                        }).then(response => response.json()).then(response => mWOrigin.innerHTML = response.name, ).catch(e => console.error("error loading Episode from server", e), mWOrigin.innerHTML = "Sorry, I don't know")
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
                    console.log(mWImgstatus);
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

function checkPosition() {
    if (position >= threshold) {
        if (HowManyLoadedPage < ArrayGetServerAll[0].info.pages) {
            HowManyLoadedPage++
            fetchMovies(HowManyLoadedPage)
        } else HowManyLoadedPage = 1
    }
};
(() => {
    window.addEventListener('scroll', throttle(checkPosition, 550))
    window.addEventListener('resize', throttle(checkPosition, 550))
})()

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
