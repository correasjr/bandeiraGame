import { traduzir } from "./translate.js"

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
//let index = 72
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
        countries = json
        countryData = json[index]
        //console.log(countryData)
        flag.src = json[index].flags.svg
        nameCountry = json[index].translations.por.common
        //console.log(nameCountry)
        
        json.forEach((el, index) => {
            countriesNames[index] = el.translations.por.common
        })
        
        getCountryInfo(countryData)
        //console.log(`As informações do pais ${countryInfo}`)
        //console.log(countriesNames)
        return traduzir(countryInfo[1])
    })
    .then(tradCurrency => {
        countryInfo[1] = tradCurrency
        return traduzir(countryInfo[4])
    })
    .then(tradCapital => {
        //console.log("tradução funfou? " + tradCapital)
        countryInfo[4] = tradCapital

        return traduzir(countryInfo[3])
        
    })
    .then(tradLang => {
        //console.log("tradução lang funfou?" + tradLang)
        countryInfo[3] = tradLang
    })
    .catch(err => console.log(err))
}

let getCountryInfo = (countryData) => {
    let continent
    switch (countryData.continents[0]){
        case 'North America':
            continent = 'América do Norte'
            break
        case 'South America':
            continent = 'América do Sul'
            break
        case 'Europe':
            continent = 'Europa'
            break
        case 'Asia':
            continent = 'Ásia'
            break
        case 'Africa':
            continent = 'África'
            break
        default:
            continent = countryData.continents[0]
    }
    countryInfo.push(continent)
    
    let currencies = JSON.stringify(countryData.currencies)
    let currenciesArray = currencies.split('"')
    countryInfo.push(formatNameCurrency(currenciesArray[5]))
    
    let fronteiras = countryData.borders ? countryData.borders : 'Sem Fronteiras'
    if (fronteiras != 'Sem Fronteiras'){
        countryInfo.push(formatBorders(fronteiras))
    }else{
        countryInfo.push(fronteiras)
    }
    
    let lang = JSON.stringify(countryData.languages)
    let langArry = lang.split('"')
    countryInfo.push(langArry[3])
    debugger
    countryInfo.push(countryData.capital[0])
}

let checkCountry = () => {
    let guessedCountry = input.value

    if (guessedCountry == nameCountry){
        bttn.disabled = true
        showMessage("right", "Parabéns!", 60000)
        gameOver = true
        input.readOnly = true
    }
}

let showMessage = (typeMessage, message, time) => {
    let messageContainer = document.querySelector('.message-container')
    let messageElement = document.createElement('p')

    messageElement.textContent = message
    messageContainer.classList.add(typeMessage)

    messageDisplay.appendChild(messageElement)

    setTimeout(() => messageContainer.removeChild(messageElement), time)
}

let isGameOver = () => {
    return bttn.disabled
}

let showHint = () => {
    if(!gameOver){
        let label = document.getElementById(`label-${numberOfGuesses}`)
        let input = document.createElement('input')
        input.value = countryInfo[numberOfGuesses]
        input.readOnly = true
        label.appendChild(input)
        label.classList.remove('label-hide')
        numberOfGuesses++
    }
}

let guess = () => {
    if (isVazio()){
        checkCountry()
        clearInput()
        if (numberOfGuesses < 5){
            showHint()
        } else {
            if (!gameOver){
                bttn.disabled = true
                showMessage("wrong", nameCountry, 10000)
                input.readOnly = true
            }
        }
    }else{
        showMessage("warning", "Insira um país válido", 2000)
    }
}

let formatNameCurrency = (currency) => {
    let currencyArr = currency.split(" ")
    let currencyName = currencyArr.pop()
    let currencyNameArr = currencyName.split("")
    currencyNameArr[0] = currencyNameArr[0].toUpperCase()
    return currencyNameArr.join("")
}

let formatBorders = (borders) => {
    let bordersArr =[]
    for (let border of borders){
        countries.forEach(el => {
            if (el.cca3 == border){
                bordersArr.push(el.translations.por.common)
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
    let itemLista = document.createElement('li')
    let botao = document.createElement('button')
    botao.classList.add('botaoSugest')
    botao.textContent = value
    itemLista.appendChild(botao)
    return itemLista
}

//executa a ação dos botões de sugestão de país
document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains('botaoSugest')){
          clickSugestion(e)
     }
 });

let isVazio = () => {
    if(!input.value || !countriesNames.includes(input.value)){
        return false
    }
    return true
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

input.addEventListener('keypress', (event) => {
    if (event.key == "Enter"){
        guess()
    }
})
bttn.addEventListener('click', guess)

getFlag()
console.log(index)