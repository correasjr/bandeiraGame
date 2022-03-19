const flagDisplay = document.querySelector('.flag-container')
const flag = document.createElement("img")
flagDisplay.appendChild(flag)
const messageDisplay = document.querySelector('.message-container')
flag.classList.add('filter')

const input = document.getElementById('inputCountry')
const bttn = document.getElementById('idButton')
const hints = document.querySelector('.hints-container')


let randomIntFromInterval = (min, max) => { 
    return Math.floor(Math.random() * (max - min + 1) + min -1)
}

let index = randomIntFromInterval(1, 251)
let nameCountry
let numberOfGuesses = 0

let countriesNames = []
let countryData
let countryInfo = []

let getFlag = () => {
    fetch('https://restcountries.com/v3.1/all')
    .then(response => {
        return response.json()
    })
    .then(json => {
        console.log(json)
        countryData = json[index]
        flag.src = json[index].flags.svg
        nameCountry = json[index].name.common
        console.log(nameCountry)
        
        json.forEach((el, index) => {
            countriesNames[index] = el.name.common
        })

        getCountryInfo(countryData)
        console.log(`As informações do pais ${countryInfo}`)
        console.log(countriesNames)
    }).catch(err => console.log(err))
}

let getCountryInfo = (countryData) => {
    countryInfo.push(countryData.continents[0])
    
    debugger
    let currencies = JSON.stringify(countryData.currencies)
    let currenciesArray = currencies.split('"')
    countryInfo.push(currenciesArray[5])

    countryInfo.push(countryData.borders)
    
    debugger
    let lang = JSON.stringify(countryData.languages)
    let langArry = lang.split('"')
    countryInfo.push(langArry[3])

    countryInfo.push(countryData.capital)
}

let checkCountry = () => {
    let guessedCountry = input.value

    if (guessedCountry == nameCountry){
        bttn.disabled = true
        showMessage("Parabéns!")
    }
}

let showMessage = (message) => {
    let messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.appendChild(messageElement)
}

let isGameOver = () => {
    return bttn.disabled
}

let guess = () => {
    checkCountry()
    debugger
    if (numberOfGuesses < 5 && !isGameOver()){
        let label = document.getElementById(`label-${numberOfGuesses}`)
        let input = document.createElement('input')
        input.value = countryInfo[numberOfGuesses]
        input.readOnly = true
        label.appendChild(input)
        numberOfGuesses++
        return
    } else {
        bttn.disabled = true
        showMessage("Deveu!")
    }
}

getFlag()
console.log(index)