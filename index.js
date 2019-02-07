'use strict';
//Url must be http, not https. For my idea, the only usable API with documentation uses HTTP.
//See their site at http://www.dnd5eapi.co/.

const endPointMonsters = `http://www.dnd5eapi.co/api/monsters`;

//GET THOSE MONSTER OBJECTS BELOW!
//----------------------------------
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
        // console.log(monsterListJson);
        //createUrlMonsterArray(monsterListJson);
        gatherRelevantMonsters(createUrlMonsterArray(monsterListJson), ratingInput)
    })
    .catch (error => alert (`Error in checkMonsterList: ${error.message}`));
}


function grabCount(count){
    console.log(count + ' total monsters searched in Dungeons and Dragons 5th edition SRD content.')
}


function createUrlMonsterArray(monsterListJson) {
    var urlArray = []
    var arrayLength = monsterListJson.results.length
    var eachResult = monsterListJson.results
    // console.log(eachResult[0].url)
    for (let i = 0; i <= arrayLength - 1; i++){
        urlArray.push(eachResult[i].url)
    }    return urlArray
}

// This is where the MAGIC happens. Gotta wait a few seconds, though.
function gatherRelevantMonsters(theUrlArray, ratingInput) {
    var monsterObjectArray = []
    monsterObjectArray.push(theUrlArray.forEach(function(theUrlArray){
            // console.log(theUrlArray + ` in the forEach function`)
            fetch(theUrlArray)
            .then(response => {
                if (response.ok) {
                return response.json();
                }
                throw new Error (response.statusText);
            })
            .then (singleMonsterResponse => {
                // console.log(singleMonsterResponse)
                monsterObjectArray.push(singleMonsterResponse)
            })
            .catch (error => alert (`Error in getRelevantMonsters: ${error.message}`));            
        })
    )
    setTimeout(function(){
        // console.log(monsterObjectArray)
        var filteredMonsters = []
        for (let i = 1; i < monsterObjectArray.length; i++){
            var singleMonsterResponse = monsterObjectArray[i]
            if (filterMonsters(singleMonsterResponse, ratingInput) === true){
                // console.log(singleMonsterResponse.name + ` was true.`)
                filteredMonsters.push(singleMonsterResponse)
            }
        }
        var theSix = shuffleMonsters(filteredMonsters)
        //Now that we've got theSix, what are we going to do with them? (BELOW)
        console.log(theSix[0].name + ` has an index of ` + theSix[0].index + ` which can be found at ` + theSix[0].url)
        assembleInfoOntoPage(theSix)
        }, 4150)
}

//There's only 6, and they shouldn't be the same ones!
function shuffleMonsters(arrayOfMonsters) {
    // console.log(`shuffleMonsters is happening`)
    var relevantLength = arrayOfMonsters.length
    console.log(arrayOfMonsters.length + ` total monsters are worthy.`)
    var theSix = []
    while (theSix.length < 6){
        var randomNumber = Math.floor(Math.random() * (relevantLength - 0 + 1))
        // console.log(randomNumber)
        if (arrayOfMonsters[randomNumber] != undefined )
            {theSix.push(arrayOfMonsters[randomNumber])
        }
    }
    console.log(theSix)
    return theSix
}

// Let's find some worthy foes!
function filterMonsters(singleMonsterResponse, ratingInput) {
    var monsterRating = singleMonsterResponse.challenge_rating
    // console.log(ratingInput)
    // console.log(monsterRating)
    if (monsterRating - ratingInput <= 1 && ratingInput - monsterRating <= 1){
        return true
    }
    else {
        return false
    }
}

function assembleInfoOntoPage(theSix){
    console.log(`That includes a ` + theSix[0].name + `.`)
    if (theSix[0].name == theSix[1].name || theSix[0].name == theSix[2].name || theSix[0].name == theSix[3].name || theSix[0].name == theSix[4].name || theSix[0].name == theSix[5].name){
        console.log(`Why the duplicates? Because not many foes are that powerful!`)
    }
  $('#box1').replaceWith(
    `<div id="box1" class="boxes">${theSix[0].name}</div>`
  )
  $('#box2').replaceWith(
    `<div id="box2" class="boxes">${theSix[1].name}</div>`
  )
  $('#box3').replaceWith(
    `<div id="box3" class="boxes">${theSix[2].name}</div>`
  )
  $('#box4').replaceWith(
    `<div id="box4" class="boxes">${theSix[3].name}</div>`
  )
  $('#box5').replaceWith(
    `<div id="box5" class="boxes">${theSix[4].name}</div>`
  )
  $('#box6').replaceWith(
    `<div id="box6" class="boxes">${theSix[5].name}</div>`
  )

}

// console.log(STORE)
function singleHomeImage(STORE){
    var relevantLength = 50
    // relevantLength = STORE.length WHEN MY STORE ARRAY IS COMPLETE
    var randomIndex = Math.floor(Math.random() * (relevantLength - 0 + 1))
    var homeMonsterUrl = STORE[randomIndex]
    // var homeMonsterUrl = STORE["Ape"]
    document.getElementById('random').src = homeMonsterUrl
    document.getElementById('random').alt = homeMonsterUrl
    document.getElementById('random').title = randomIndex
    console.log(homeMonsterUrl)
}

singleHomeImage(STORE)

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    onClickFunction()
     var ratingInput = document.getElementById("challenge-rating").value
    //  console.log(ratingInput)
     checkMonsterList(ratingInput)
     });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

function onClickFunction(ratingInput){
    var submitButton = document.getElementById("generate")
    var submitField = document.getElementById("challenge-rating")
    var loadingSwirl = document.getElementById("loading-gif")
    var homeMonster = document.getElementById("random")
    var boxes = document.getElementsByClassName("boxes")
    console.log(boxes)
    submitButton.classList.add("hidden")
    submitField.classList.add("hidden")
    loadingSwirl.classList.remove("hidden")
    homeMonster.classList.add("hidden")
    setTimeout(function(){
        var element = document.getElementById("generate")
        submitButton.classList.remove("hidden")
        submitField.classList.remove("hidden")
        loadingSwirl.classList.add("hidden")
    }, 4400)
}

