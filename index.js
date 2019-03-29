'use strict';
//CORS NOT ENABLED server-side. URL must be HTTP, not HTTPS. Mixed content will not work. 
//For Dungeons and Dragons, the only functionable (open-source) monster API with documentation uses HTTP.
//See his site at http://www.dnd5eapi.co/.

const endPointMonsters = `http://www.dnd5eapi.co/api/monsters`;
const values = Object.values(STORE)
const keys = Object.keys(STORE)


// THE LOADUP...
function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      onGenerateClick()
       var ratingInput = document.getElementById("challenge-rating").value
       checkMonsterList(ratingInput)
       });
  }
  
$(function() {
    console.log('App loaded! Waiting for submit!');
    watchForm();
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
    .catch (error => alert (`Error in checkMonsterList: ${error.message}`));
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
    console.log(count + ' total monsters searched in Dungeons and Dragons 5th edition SRD content.')
}

// This is where the MAGIC happens. Gotta wait a few seconds, though.
function gatherRelevantMonsters(theUrlArray, ratingInput) {
    var monsterObjectArray = []
    monsterObjectArray.push(theUrlArray.forEach(function(theUrlArray){
            fetch(theUrlArray, {
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
            .then (singleMonsterResponse => {
                monsterObjectArray.push(singleMonsterResponse)
            })
            .catch (error => console.log(`Error in gatherRelevantMonsters: ${error.message}`));            
        })
    )
    setTimeout(function(){
        console.log(monsterObjectArray.length + ` monsters checked.`)
        var filteredMonsters = []
        for (let i = 1; i < monsterObjectArray.length; i++){
            var singleMonsterResponse = monsterObjectArray[i]
            if (filterMonsters(singleMonsterResponse, ratingInput) === true){
                filteredMonsters.push(singleMonsterResponse)
            }
        }
        var theSix = shuffleMonsters(filteredMonsters)
        assembleInfoOntoPage(theSix)
        }, 7150)
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
        console.log(arrayOfMonsters)
        return arrayOfMonsters
    }
    console.log(arrayOfMonsters.length + ` total worthy monsters found.`)
    var theSix = new Set()        
    while (theSix.size < 6){
        var randomNumber = Math.floor(Math.random() * relevantLength)
        if (arrayOfMonsters[randomNumber] != undefined )
            {
                theSix.add(arrayOfMonsters[randomNumber])
        }
    }
    console.log(Array.from(theSix))
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
            `<div id="box${w}" class="boxes clickable">
                <img src="${STORE[theName]}" alt="${theName}" title="${theName}"></img>
            </div>`
          )
          document.getElementsByClassName("clickable")[w-1].addEventListener("click", function(){getDetails(theSix[w-1])});
    }
}

function onGenerateClick(){
    var submitButton = document.getElementById("generate")
    var submitField = document.getElementById("challenge-rating")
    var loadingSwirl = document.getElementById("loading-gif")
    var homeMonster = document.getElementById("random")
    submitButton.classList.add("hidden")
    submitField.classList.add("hidden")
    loadingSwirl.classList.remove("hidden")
    setTimeout(function(){
        var grid = document.getElementById("grid-container")
        grid.classList.add("grid-container")
        grid.classList.remove("hidden")
        submitButton.classList.remove("hidden")
        submitField.classList.remove("hidden")
        loadingSwirl.classList.add("hidden")
        if (homeMonster != null){
            homeMonster.removeAttribute("id")
            homeMonster.classList.add("hidden")
        }
    }, 7350)
}