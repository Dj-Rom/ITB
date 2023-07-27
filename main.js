"use strict";
const modalWindow = document.querySelector('.modalWindow')
const mWImg = document.querySelector(".modalWindow_img")
const mWName = document.querySelector(".modalWindow_text_nameRes")
const mWStatus = document.querySelector(".modalWindow_text_statusRes")
const mWSpecies = document.querySelector(".modalWindow_text_speciesRes")
const mWOrigin = document.querySelector(".modalWindow_text_originRes")
const mWLocation = document.querySelector(".modalWindow_text_locationRes")
const mWGender = document.querySelector(".modalWindow_text_genderRes")
const height = document.body.offsetHeight
const screenHeight = window.innerHeight
const scrolled = window.scrollY
const threshold = height - screenHeight / 4
const position = scrolled + screenHeight
const loadAnimation = document.querySelector(".ring")
const contener = document.querySelector('.contener');
let ArrayGetServerAll = [];
let HowManyLoadedPage = 1;
async function getAllArrayServer() {
    const AllDate = await fetch(`https://rickandmortyapi.com/api/character`, { method: 'GET' })
        .then(response => response.json())
        .then(data => { ArrayGetServerAll.push(data) });
    console.log(ArrayGetServerAll[0].info.pages)

} getAllArrayServer()
async function fetchMovies(num) {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${num}`, { method: 'GET' })
        .then(data => {
            loadAnimation.style.display = 'block';
            return data
        })
        .then(response => {
            loadAnimation.innerHTML = "Loading"
            return response.json()
        })
        .then(data => {
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

            } return data
        })
        .then(data => {
            loadAnimation.style.display = 'none';
            return data
        })
        .then(data => {
            window.addEventListener('click', (eo) => {
                console.log(event.target.className);
                eo = eo || window.event;
                data.results.forEach(element => {


                    if (mWImg.status === "active" && eo.target.alt === undefined || event.target.className == "modalWindow" || event.target.className == "modalWindow_img") {
                        modalWindow.style.display = 'none'
                        mWImg.status = "none"

                    }
                    if (element.name == eo.target.alt) {
                        mWImg.style.top = 0
                        modalWindow.style.display = 'block'
                        mWImg.alt = element.name
                        mWName.innerHTML = element.name
                        mWStatus.innerHTML = element.status
                        mWGender.innerHTML = element.gender
                        mWLocation.innerHTML = element.location.name
                        mWOrigin.innerHTML = element.origin.name
                        mWSpecies.innerHTML = element.species
                        mWImg.src = element.image
                        mWImg.status = "active"

                    }
                });
            }, true)
        })
        .catch(error => {
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
}


; (() => {
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
