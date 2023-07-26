let modalWindow = document.querySelector('.modalWindow')
let mWImg = document.querySelector(".modalWindow_img")
let mWName = document.querySelector(".modalWindow_text_nameRes")
let mWStatus = document.querySelector(".modalWindow_text_statusRes")
let mWSpecies = document.querySelector(".modalWindow_text_speciesRes")
let mWOrigin = document.querySelector(".modalWindow_text_originRes")
let mWLocation = document.querySelector(".modalWindow_text_locationRes")
let mWGender = document.querySelector(".modalWindow_text_genderRes")

const height = document.body.offsetHeight
const screenHeight = window.innerHeight
const scrolled = window.scrollY
const threshold = height - screenHeight / 6
const position = scrolled + screenHeight
const loadAnimation = document.querySelector(".ring")
const contener = document.querySelector('.contener');
let ArrayGetServerAll = [];

let HowManyLoadedPage = 2;
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

            }
        }).then(() => { loadAnimation.style.display = 'none'; })
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
            console.log(HowManyLoadedPage);

        } else HowManyLoadedPage = 1
    }
}


; (() => {
    window.addEventListener('scrollend', checkPosition, true)
    window.addEventListener('resize', checkPosition)
    window.addEventListener('click', (eo) => {
        eo = eo || window.event;
        console.log(eo.target.alt);
        ArrayGetServerAll[0].results.forEach(element => {

            if (modalWindow.style.display == 'block') {
                if (eo.target.alt == undefined) {
                    modalWindow.style.display = 'none'
                }
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
                
            }
        });
    })
})()