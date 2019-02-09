'use strict';
//Url must be http, not https. For Dungeons and Dragons, the only functionable API with documentation uses HTTP.
//See their site at http://www.dnd5eapi.co/.

const endPointMonsters = `http://www.dnd5eapi.co/api/monsters`;
const values = Object.values(STORE)
const keys = Object.keys(STORE)

// console.log(STORE.Aboleth)

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
        // console.log(theSix[0].name + ` has an index of ` + theSix[0].index + ` which can be found at ` + theSix[0].url)
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
    // console.log(theSix)
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
    // console.log(`That includes a ` + theSix[0].name + `.`)
    if (theSix[0].name == theSix[1].name || theSix[0].name == theSix[2].name || theSix[0].name == theSix[3].name || theSix[0].name == theSix[4].name || theSix[0].name == theSix[5].name || theSix[1].name == theSix[2].name|| theSix[1].name == theSix[3].name|| theSix[1].name == theSix[4].name|| theSix[1].name == theSix[5].name){
        console.log(`Duplicates! Maybe the foe doesn't have many peers?`)
        var notice = document.getElementById("duplicate-notice")
        notice.classList.remove("hidden")
        setTimeout(function(){
            notice.classList.add("hidden")
        }, 7000)
    }
    for (let w = 1; w <= 6; w++){
        var theName = theSix[w-1].name
        $(`#box${w}`).replaceWith(
            `<div id="box${w}" class="boxes clickable">
            <img src="${STORE[theName]}" alt="Picture of a(n) ${theName} needs updated." title="${theName}"></img>
            <p>${theName}</p>
            </div>`
          )
          document.getElementsByClassName("clickable")[w-1].addEventListener("click", function(){getDetails(theSix[w-1])});
    }
    
}

// console.log(STORE)
function singleHomeImage(){
    var relevantLength = 133
    // relevantLength = STORE.length WHEN MY STORE ARRAY IS COMPLETE
    var randomIndex = Math.floor(Math.random() * (relevantLength - 0 + 1))
    var homeMonsterUrl = values[randomIndex]
    document.getElementById('random').src = homeMonsterUrl
    document.getElementById('random').alt = homeMonsterUrl
    document.getElementById('random').title = keys[randomIndex]
    console.log(`homeMonsterUrl:` + homeMonsterUrl + `, randomIndex:` + randomIndex)
}

singleHomeImage(STORE)

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    onGenerateClick()
     var ratingInput = document.getElementById("challenge-rating").value
    //  console.log(ratingInput)
     checkMonsterList(ratingInput)
     });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

function onGenerateClick(ratingInput){
    var submitButton = document.getElementById("generate")
    var submitField = document.getElementById("challenge-rating")
    var loadingSwirl = document.getElementById("loading-gif")
    var homeMonster = document.getElementById("random")
    submitButton.classList.add("hidden")
    submitField.classList.add("hidden")
    loadingSwirl.classList.remove("hidden")
    homeMonster.classList.add("hidden")
    setTimeout(function(){
        submitButton.classList.remove("hidden")
        submitField.classList.remove("hidden")
        loadingSwirl.classList.add("hidden")
    }, 4400)
}

function modifierCalculator(score){
    if (score < 4){return -4}
    if (score == 4 || score == 5){return -3}
    if (score == 6 || score == 7){return -2}
    if (score == 8 || score == 9){return -1}
    if (score == 10 || score == 11){return 0}
    if (score == 12 || score == 13){return 1}
    if (score == 14 || score == 15){return 2}
    if (score == 16 || score == 17){return 3}
    if (score == 18 || score == 19){return 4}
    if (score == 20 || score == 21){return 5}
    if (score == 22 || score == 23){return 6}
    if (score == 24 || score == 25){return 7}
    if (score == 26 || score == 27){return 8}
    if (score == 28 || score == 29){return 9}
    if (score == 30 || score > 30){return 10}
}

function savingThrow(modifier, throwProficiency){
    return modifier + throwProficiency 
}

function getDetails(monster){
    console.log(`dex save:` + monster.dexterity_save)
    var monsterKeys = Object.keys(monster)
        if (monster.dexterity_save === undefined){
            Object.assign(monster, {dexterity_save: 0});
        }
        if (monster.constitution_save === undefined){
            Object.assign(monster, {constitution_save: 0});
        }
        if (monster.wisdom_save === undefined){
            Object.assign(monster, {wisdom_save: 0});
        }
        if (monster.charisma_save === undefined){
            Object.assign(monster, {charisma_save: 0});
        }
        if (monster.special_abilities === undefined){
            Object.assign(monster, {special_abilities: "None."});
        }
    for (let z = 0; z < monsterKeys.length; z++){
        var key = monsterKeys[z]
        if (monster[key] === "" || monster[key] === undefined){
            monster[key] = 0
        }
    }
    console.log(`DEX save: ` + monster.dexterity_save)
    console.log(monster)
    for (let w = 1; w <= 6; w++){
        $(`#box${w}`).replaceWith(
            `<div id="box${w}" class="boxes"></div>`
          )
    }
    $(`#box1`).replaceWith(
        `<div id="box1" class="boxes">
        <img src="${STORE[monster.name]}" alt="A picture of a(n) ${monster.name}" title="${monster.name}"</img>
        </div>`
    )
    $(`#box2`).replaceWith(
        `<div id="box2" class="boxes">
        <h2>${monster.name}</h2>
        <p>Challenge Rating: ${monster.challenge_rating}</p>
        <p>Type: ${monster.type}</p>
        <p>Size: ${monster.size}</p>
        <p>Speed: ${monster.speed}</p>
        <p>Alignment: ${monster.alignment}</p>
        <p>Hit Dice: ${monster.hit_dice}</p>
        </div>`
    )
    $(`#box3`).replaceWith(
        `<div id="box3" class="boxes">
        <p>DEFENSES</p>
        <p>Hit Points: ${monster.hit_points}</p>
        <p>AC: ${monster.armor_class}</p>
        <p>Vulnerabilities: ${monster.damage_vulnerabilities}</p>
        <p>Resistances: ${monster.damage_resistances}</p>
        <p>Immunites: ${monster.damage_immunities}</p>
        <p>SAVE BONUSES</p>
        <p>DEX: ${monster.dexterity_save}</p>
        <p>CON: ${monster.constitution_save}</p>
        <p>WIS: ${monster.wisdom_save}</p>
        <p>CHA: ${monster.charisma_save}</p>
        </div>`
    )
    $(`#box4`).replaceWith(
        `<div id="box4" class="boxes">
        <p>OTHER</p>
        <p>Perception: ${monster.perception}</p>
        <p>Languages: ${monster.languages}</p>
        <p>Stealth: ${monster.stealth}</p>
        <p>Immune to: ${monster.condition_immunities}</p>
        <p>Senses:${monster.senses}</p>
        </div>`
    )
    $(`#box5`).replaceWith(
        `<div id="box5" class="boxes">
        <p>Special Abilities: ${monster.special_abilities}</p>
        </div>`
    )
    $(`#box6`).replaceWith(
        `<div id="box6" class="boxes"></div>`
    )
        // console.log(monster.special_abilities[1].attack_bonus + ` is the attack bonus!`)
}