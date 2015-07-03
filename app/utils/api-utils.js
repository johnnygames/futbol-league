var axios = require('axios');

// These functions all return promises
function getTeams () {
  return axios.get('https://futbol-api.goguardian.com/teams');
}

function getMatches () {
  return axios.get('https://futbol-api.goguardian.com/matches');
}

function getPlayers () {
  return axios.get('https://futbol-api.goguardian.com/players');
}

function getGoals () {
  return axios.get('https://futbol-api.goguardian.com/goals');
}

// This is what I will export and use in my App component
var helpers = {
  // This method will return an object with all the data from the API, the .all method waits until all promises are resolved to execute .then
  getAllInfo: function () {
    return axios.all([getTeams(), getMatches(), getPlayers(), getGoals()])
      .then(function (promiseArray) {
        return {
          teams: promiseArray[0].data,
          matches: promiseArray[1].data,
          players: promiseArray[2].data,
          goals: promiseArray[3].data
        };
      });
  }
};

module.exports = helpers;
