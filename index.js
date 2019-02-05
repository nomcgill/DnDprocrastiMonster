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
        console.log(monsterObjectArray)
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
        console.log(theSix[1].name + ` has an index of ` + theSix[1].index + ` which can be found at ` + theSix[1].url)


    }, 3850)

}

//There's only 6, and they shouldn't be the same ones!
function shuffleMonsters(arrayOfMonsters) {
    // console.log(`shuffleMonsters is happening`)
    var relevantLength = arrayOfMonsters.length
    var theSix = []
    for (let i=0; i<=5; i++){
        theSix.push(arrayOfMonsters[Math.floor(Math.random() * (relevantLength - 0 + 1))])
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

// function displayResults(responseJson) {
//   console.log(responseJson);
//   //replace the existing image with the new one
//   $('.results-img').replaceWith(
//     `<p class="results-text">${responseJson.message}<p>`
//   )

//   $('.results').removeClass('hidden');
// }


// const photoUrl = 'https://jsonplaceholder.typicode.com/'

// function getImages() { 
//     const imgArr = [] 
//     for(let i=1;i<=10;i++){ 
//         var imgUrl = fetch(photoUrl+'photos/'+i) 
//         imgArr.push(imgUrl.url) } 
//         console.log(imgArr) 
//     }

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    loadingIcon()
        var element = document.getElementById("myDIV")
     var ratingInput = document.getElementById("challenge-rating").value
    //  console.log(ratingInput)
     checkMonsterList(ratingInput)
     });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

function loadingIcon(ratingInput){
    var submitButton = document.getElementById("generate")
    var submitField = document.getElementById("challenge-rating")
    var loadingSwirl = document.getElementById("loading-gif")
    submitButton.classList.add("hidden")
    submitField.classList.add("hidden")
    loadingSwirl.classList.remove("hidden")
    setTimeout(function(){
        // var element = document.getElementById("generate")
        submitButton.classList.remove("hidden")
        submitField.classList.remove("hidden")
        loadingSwirl.classList.add("hidden")
    }, 4200)
}

