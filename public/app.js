const flagDisplay = document.querySelector('.flag-container')
const flag = document.createElement("img")
flagDisplay.appendChild(flag)
const messageDisplay = document.querySelector('.message-container')
flag.classList.add('filter')

const input = document.getElementById('inputCountry')
const sugestoes = document.querySelector('.sugestoes')
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
let countries
let gameOver = false

let getFlag = () => {
    fetch('https://restcountries.com/v3.1/all')
    .then(response => {
        return response.json()
    })
    .then(json => {
        debugger
        countries = json
        countryData = json[index]
        console.log(countryData)
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
    
    let currencies = JSON.stringify(countryData.currencies)
    let currenciesArray = currencies.split('"')
    countryInfo.push(formatNameCurrency(currenciesArray[5]))
    
    let fronteiras = countryData.borders ? countryData.borders : 'No Borders'
    if (fronteiras != 'No Borders'){
        countryInfo.push(formatBorders(fronteiras))
    }else{
        countryInfo.push(fronteiras)
    }
    
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
        gameOver = true
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
    clearInput()
    debugger
    if (numberOfGuesses < 5){
        let label = document.getElementById(`label-${numberOfGuesses}`)
        let input = document.createElement('input')
        input.value = countryInfo[numberOfGuesses]
        input.readOnly = true
        label.appendChild(input)
        label.classList.remove('label-hide')
        numberOfGuesses++
    } else {
        if (!gameOver){
            bttn.disabled = true
            showMessage("Deveu!")
        }
    }
}

let formatNameCurrency = (currency) => {
    let currencyArr = currency.split(" ")
    return currencyArr.pop()
}

let formatBorders = (borders) => {
    let bordersArr =[]
    for (let border of borders){
        countries.forEach(el => {
            if (el.cca3 == border){
                bordersArr.push(el.name.common)
            }
        })
    }
    return bordersArr.join(', ')
}

let autocomplete = (country) => {
    return countriesNames.filter(el => {
        let elUpper = el.toUpperCase()
        let countryUpper = country.toUpperCase()

        return elUpper.includes(countryUpper)
    })
}

let clearInput = () => {
    sugestoes.innerHTML = ""
    input.value = ""
}

let clickSugestion = (e) =>{
    input.value = e.target.textContent
    sugestoes.innerHTML = ""
}

let generateListAutoComplete = (value) => {
    debugger
    let itemLista = document.createElement('li')
    let botao = document.createElement('button')
    botao.textContent = value
    botao.setAttribute('onclick', "clickSugestion(event)")
    itemLista.appendChild(botao)
    return itemLista
}

input.addEventListener('input', ({ target }) => {
    const dadosDoCampo = target.value
    sugestoes.innerHTML=""
    if(dadosDoCampo.length) {
       const autoCompleteValores = autocomplete(dadosDoCampo)
       autoCompleteValores.map((value) => {
           sugestoes.appendChild(generateListAutoComplete(value))
        })
        
     }
})

getFlag()
console.log(index)