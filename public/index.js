'use strict';
//CORS NOT ENABLED server-side. URL must be HTTP, not HTTPS. Mixed content will not work. 
//For Dungeons and Dragons, the only functionable (open-source) monster API with documentation uses HTTP.
//See his site at http://www.dnd5eapi.co/.

const endPointMonsters = `https://cors-anywhere.herokuapp.com/http://www.dnd5eapi.co/api/monsters`;
const values = Object.values(STORE)
const keys = Object.keys(STORE)


// THE LOADUP...
function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
       var ratingInput = document.getElementById("challenge-rating").value
       checkMonsterList(ratingInput)
       });
}

function watchQuestion() {
    $('#question').click(event => {
        swal('Using the ProcrastiMonster',
        "This app is a companion tool for 5th edition Dungeons and Dragons, a tabletop game by Wizards of the Coast. To get started, enter a Combat Rating between 0 and 30. Enemies found should be worthy foes for 4 adventurers of equal level.")
    })
}
  
$(function() {
    watchForm();
    watchQuestion()
    swal('D&D 5e ProcrastiMonster',
    "Are you playing Dungeons and Dragons and need to whip up some monsters? Enter a Combat Rating between 0 and 30 at the top of the screen and hit GENERATE to find some random ones for your adventurers!")
    getAttention()
});

!function singleHomeImage(){
    var relevantLength = 325
    var randomIndex = Math.floor(Math.random() * (relevantLength - 0 + 1))
    var homeMonsterUrl = values[randomIndex]
    document.getElementById('random').src = homeMonsterUrl
    document.getElementById('random').alt = homeMonsterUrl
    document.getElementById('random').title = keys[randomIndex]
}()

document.getElementById('challenge-rating').oninput = function () {
    var max = parseInt(this.max);

    if (parseInt(this.value) > max) {
        this.value = max; 
    }
}

// WE'VE GOTTA CHECK THAT API FOR ALL THE MONSTERS...
function checkMonsterList(ratingInput) {
    fetch (endPointMonsters)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then (monsterListJson => {
        grabCount(monsterListJson.count);
        gatherRelevantMonsters(createUrlMonsterArray(monsterListJson), ratingInput)
    })
    .catch (error => somethingWentWrong(error.message));
}


function createUrlMonsterArray(monsterListJson) {
    var urlArray = []
    var arrayLength = monsterListJson.results.length
    var eachResult = monsterListJson.results
    for (let i = 0; i <= arrayLength - 1; i++){
        urlArray.push(eachResult[i].url)
    }
    return urlArray
}

function grabCount(count){
    console.log('Searching through ' + count + ' total monsters in Dungeons and Dragons 5th edition SRD content.')
}

// This is where the MAGIC happens.
async function gatherRelevantMonsters(theUrlArray, ratingInput) {
    onGenerateClick()
    var monsterObjectArray = []
    let searchedMonsters = 0
    var problem = setTimeout(function(){
        somethingWentWrong()
        }, 20000);
    var firstThing = () => {
        return new Promise((resolve, reject) => {
            monsterObjectArray.push(theUrlArray.forEach(function(eachUrl){
                fetch(eachUrl, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    }
                })
                .then(response => {
                    if (response.ok) {
                    return response.json();
                    }
                    throw new Error (response.statusText);
                })
                .then(singleMonsterResponse => {
                    monsterObjectArray.push(singleMonsterResponse)
                })
                .then(item => {
                    searchedMonsters++
                    if (searchedMonsters === theUrlArray.length){
                        clearTimeout(problem)
                        resolve()
                    }
                })
                .catch (error => {
                    clearTimeout(problem)
                    somethingWentWrong(error)
                });            
            }))
        })
    }
    await firstThing()
    var filteredMonsters = []
    for (let i = 1; i < monsterObjectArray.length; i++){
        var singleMonsterResponse = monsterObjectArray[i]
        if (filterMonsters(singleMonsterResponse, ratingInput) === true){
            filteredMonsters.push(singleMonsterResponse)
        }
    }
    var theSix = shuffleMonsters(filteredMonsters)
    assembleInfoOntoPage(theSix)
    afterwards()
}

function somethingWentWrong(error){
    if (!error){
        swal("Timed Out",
            "Connection too slow for practical use. Restarting app...", "error")
        setTimeout(function(){
            location.reload()
        }, 3500)
    }
    else {$(`#pane-note`).replaceWith(`
            <p id="pane-note">Connection trouble: ${error.message}. (Note: Connection to API is unsecure.)</p>`)
        var submitButton = document.getElementById("generate")
        var submitField = document.getElementById("challenge-rating")
        var loadingSwirl = document.getElementById("loading-gif")
        submitButton.classList.remove("hidden")
        submitField.classList.remove("hidden")
        loadingSwirl.classList.add("hidden")
    }
}

// Let's find some worthy foes!
function filterMonsters(singleMonsterResponse, ratingInput) {
    var monsterRating = singleMonsterResponse.challenge_rating
    if (monsterRating - ratingInput <= 1 && ratingInput - monsterRating <= 1){
        return true
    }
    else {
        return false
    }
}

//There's only 6, and they shouldn't be the same ones!
function shuffleMonsters(arrayOfMonsters) {
    var relevantLength = arrayOfMonsters.length
    if(relevantLength <= 6) {
        return arrayOfMonsters
    }
    var theSix = new Set()        
    while (theSix.size < 6){
        var randomNumber = Math.floor(Math.random() * relevantLength)
        if (arrayOfMonsters[randomNumber] != undefined )
            {
                theSix.add(arrayOfMonsters[randomNumber])
        }
    }
    return Array.from(theSix)
}

// NOW LET'S MANIPULATE THAT DOM!
function assembleInfoOntoPage(theSix){
    for (let w = 1; w <= 6; w++){
        $(`#box${w}`).replaceWith(
            `<div id="box${w}" class="boxes"></div>`
          )
    }
    for (let w = 1; w <= theSix.length; w++){
        var theName = theSix[w-1].name
        $(`#box${w}`).replaceWith(
            `<div id="box${w}" class="boxes clickable"
            onmouseover="activateName(${w})" onmouseout="deactivateName(${w})"
            >
                <img src="${STORE[theName]}" alt="${theName}"></img>
                <div class="monster-name" id="monster${w}">${theName}</div>`)
        document.getElementsByClassName("clickable")[w-1].addEventListener("click", function(){getDetails(theSix[w-1])});
    }
}

function activateName(ID){
    var monsterID = document.getElementById(`monster${ID}`)
    monsterID.classList.add('selecting')    
}

function deactivateName(ID){
    var monsterID = document.getElementById(`monster${ID}`)
    if (monsterID.classList[1] == "selecting"){
        monsterID.classList.remove('selecting')  
    }
}

function onGenerateClick(){
    $(`#pane-note`).replaceWith(`
        <p id="pane-note">Maximum: 30</p>`)
    var submitButton = document.getElementById("generate")
    var submitField = document.getElementById("challenge-rating")
    var loadingSwirl = document.getElementById("loading-gif")
    var paneNote = document.getElementById("pane-note")
    paneNote.classList.add("hidden")
    submitButton.classList.add("hidden")
    submitField.classList.add("hidden")
    loadingSwirl.classList.remove("hidden")
}

function afterwards(){
    var submitButton = document.getElementById("generate")
    var submitField = document.getElementById("challenge-rating")
    var loadingSwirl = document.getElementById("loading-gif")
    var questionTool = document.getElementById("question")
    var homeMonster = document.getElementById("random")
    var grid = document.getElementById("grid-container")
    var questionTool = document.getElementById("question")
    var paneNote = document.getElementById("pane-note")
    paneNote.classList.remove("hidden")
    questionTool.classList.add("hidden")
    grid.classList.add("grid-container")
    grid.classList.remove("hidden")
    submitButton.classList.remove("hidden")
    submitField.classList.remove("hidden")
    questionTool.classList.remove("hidden")
    loadingSwirl.classList.add("hidden")
    if (homeMonster != null){
        homeMonster.removeAttribute("id")
        homeMonster.classList.add("hidden")
    }
}

function getAttention(){
    var questionTool = document.getElementById("question")
    var startFlash = setInterval(function(){
        flash(questionTool)
    },4000)
    $('#question').hover(function(){
        clearInterval(startFlash)
    })
    $('#form').submit(function(){
        clearInterval(startFlash)
    })
}

function flash(item){
    item.classList.add("flash")
    setTimeout(function(){
        item.classList.remove("flash")
    }, 200)
    setTimeout(function(){
        item.classList.add("flash")
    }, 400)
    setTimeout(function(){
        item.classList.remove("flash")
    }, 600)
}

// USE THE BELOW TO MANUALLY UPDATE OUTDATED IMAGES
function checkForBrokenImages(){
    for (let i = 0; i < values.length; i++){
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        wait(1000)
        .then(() => {
            console.log(`${keys[i]}:`)
            $('#random').replaceWith(
                `<img id="random" alt="random-home-image" src="${values[i]}" onerror="imgError(${keys[i]});"></img>`
            )
        }).catch(e => {console.log(e)})
    }
}

function imgError(image){
    console.log(image)
}


