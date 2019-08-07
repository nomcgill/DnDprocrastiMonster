

//Let's get those Monster Details and organize them!
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

function monsterActions(input){
    var actionNames = []
    if (input === undefined){
        return 'None.'
    }
    for (let i=0; i < input.length; i++){
        actionNames.push(input[i].name)
    }
    return actionNames.join(', ')
}

function monsterLegendary(input){
    var legendaryNames = []
    if (input === undefined){
        return 'None.'
    }
    for (let i=0; i < input.length; i++){
        legendaryNames.push(input[i].name)
    }
    return legendaryNames.join(', ')
}

function monsterSpecial(input){
    var specialNames = []
    if (input === undefined){
        return 'None.'
    }
    for (let i=0; i < input.length; i++){
        specialNames.push(input[i].name)
    }
    return specialNames.join(', ')
}

//After the click...
function getDetails(monster){
    console.log('Monster', monster)
    var monstActions = monsterActions(monster.actions)
    var monstLegendary = monsterLegendary(monster.legendary_actions)
    var monstSpecial = monsterSpecial(monster.special_abilities)
    var monsterKeys = Object.keys(monster)
        if (monster.intelligence_save === undefined){
            Object.assign(monster, {intelligence_save: 0});
        }
        if (monster.strength_save === undefined){
            Object.assign(monster, {strength_save: 0});
        }
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

    for (let z = 0; z < monsterKeys.length; z++){
        var key = monsterKeys[z]
        if (monster[key] === "" || monster[key] === undefined){
            monster[key] = 'None.'
        }
    }

    $(`#box1`).replaceWith(
        `<div id="box1" class="boxes">
        <img src="${STORE[monster.name]}" alt="${monster.name}" title="${monster.name}"</img>
        </div>`
    )
    $(`#box2`).replaceWith(
        `<div id="box2" class="boxes">
        <h3>${monster.name.toUpperCase()}</h3>
        <ul>
            <li>Challenge Rating: ${monster.challenge_rating}</li>
            <li>Type: ${monster.type}</li>
            <li>Size: ${monster.size}</li>
            <li>Speed: ${monster.speed}</li>
            <li>Alignment: ${monster.alignment}</li>
            <li>Hit Dice: ${monster.hit_dice}</li>
        <ul>
        </div>`
    )
    $(`#box3`).replaceWith(
        `<div id="box3" class="boxes">
        <h4>STATS AND BONUSES</h4>
        <ul>
            <li>Strength: ${monster.strength}</li>
            <li>Dexterity: ${monster.dexterity}</li>
            <li>Constitution: ${monster.constitution}</li>
            <li>Intelligence: ${monster.intelligence}</li>
            <li>Wisdom: ${monster.wisdom}</li>
            <li>Charisma: ${monster.charisma}</li>
        </ul>
        </div>`
    )
    $(`#box4`).replaceWith(
        `<div id="box4" class="boxes">
        <h4>DEFENSES</h4>
        <ul>
            <li>Hit Points: ${monster.hit_points}</li>
            <li>AC: ${monster.armor_class}</li>
            <li>Vulnerabilities: ${monster.damage_vulnerabilities}</li>
            <li>Resistances: ${monster.damage_resistances}</li>
            <li>Immunites: ${monster.damage_immunities}</li>
        </ul>
        <h4>SAVE BONUSES</h4>
        <ul>
            <li>STR: ${monster.strength_save + modifierCalculator(monster.strength)} / DEX: ${monster.dexterity_save + modifierCalculator(monster.dexterity)}</li>
            <li>CON: ${monster.constitution_save + modifierCalculator(monster.constitution)} / INT: ${monster.intelligence_save + modifierCalculator(monster.intelligence)}</li>
            <li>WIS: ${monster.wisdom_save + modifierCalculator(monster.wisdom)} / CHA: ${monster.charisma_save + modifierCalculator(monster.charisma)}</li>
        </ul>
        </div>`
    )
    $(`#box5`).replaceWith(
        `<div id="box5" class="boxes">
        <h4>OTHER</h4>
        <ul>
            <li>Perception: ${monster.perception}</li>
            <li>Languages: ${monster.languages}</li>
            <li>Stealth: ${monster.stealth}</li>
            <li>Immune to: ${monster.condition_immunities}</li>
            <li>Senses: ${monster.senses}</li>
        </ul>
        </div>`
    )
    $(`#box6`).replaceWith(
        `<div id="box6" class="boxes">
        <h4>ACTIONS:</h4> 
        <ul>
            <li>${monstActions}</li>
        </ul>
        <h4>LEGENDARY ACTIONS:</h4>
        <ul>
            <li>${monstLegendary}</li>
        </ul> 
        <h4>SPECIAL ABILITIES:</h4> 
        <ul>
            <li>${monstSpecial}</li>
        </ul>
        </div>`
    )
}