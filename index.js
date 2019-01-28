'use strict';

const endPointMonster = 'http://www.dnd5eapi.co/api/monsters/';

function getMonsterArray(indexURL) {
  fetch (indexURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then (responseJson => {displayResults(responseJson); console.log(responseJson);})
    .catch (error => alert (`Error: ${error.message}`));
}

function displayResults(responseJson) {
  console.log(responseJson);
  //replace the existing image with the new one
  $('.results-img').replaceWith(
    `<p class="results-text">${responseJson.message}<p>`
  )

  $('.results').removeClass('hidden');
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    var index = document.getElementById("challenge-rating").value
    var indexURL = endPointMonster + index
    getMonsterArray(indexURL);
    console.log(indexURL)
  });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});