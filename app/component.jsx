var React = require('react');
var _ = require('underscore');
var helpers = require('./utils/api-utils.js');
var Navigation = require('./navigation.jsx');
var TeamPage = require('./team-page.jsx');
var MatchPage = require('./match-page.jsx');
var PlayerPage = require('./player-page.jsx');
var mui = require('material-ui');
var ListItem = mui.ListItem;
var List = mui.List;
var Avatar = mui.Avatar;
var Paper = mui.Paper;
var ThemeManager = new mui.Styles.ThemeManager();

var App = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getInitialState: function() {
    return {
      teams: [],
      totalWins: [],
      matchData: {},
      viewType: {league: true, team: false, match: false, player: false},
      currentTeam: 0,
      currentMatch: 0,
      currentPlayer: 0,
      players: {},
      goals: []
    };
  },
  componentDidMount: function() {
    helpers.getAllInfo()
      .then(function (returnObj) {
        this.setState({
          teams: returnObj.teams,
          totalWins: returnObj.matches,
          goals: returnObj.goals,
          players: returnObj.players
        });
        this.parsePlayers();
        this.calculateRanking();
        this.getMatchData();
      }.bind(this));
    window.addEventListener('matchChoice', this.renderMatch);
    window.addEventListener('playerChoice', this.renderPlayer);
  },
  componentWillUnmount: function() {
    window.removeEventListener('matchChoice', this.renderMatch);
    window.removeEventListener('playerChoice', this.renderPlayer);
  },
  renderMatch: function (match) {
    this.setState({
      viewType: {league: false, team: false, match: true, player: false},
      currentMatch: match.detail
    });
  },
  renderPlayer: function (player) {
    this.setState({
      viewType: {league: false, team: false, match: false, player: true},
      currentPlayer: player.detail
    });
    console.log(player.detail, 'this is after setting state in renderPlayer!');
  },
  parsePlayers: function () {
    var newState = {1: [], 2: [], 3: [], 4: []};
    console.log('hi parseplayers');
    for (var i = 1; i < 5; i++) {
      newState[i] = _.where(this.state.players, {teamId: i});
   }
    this.setState({
      players: newState
    });
  },
  calculateRanking: function() {
    var newState = [];
    var outerCount = {};
    for (var j = 1; j < 5; j++) {
      for (var i = 0; i < this.state.totalWins.length; i++) {
        if (this.state.totalWins[i]['winnerTeamId'] === j) {
          outerCount[j] ? outerCount[j].wins += 1 : outerCount[j] = {wins: 0, losses: 0, ties: 0, total: 0};
        } else if (!!this.state.totalWins[i].wasTie) {
          outerCount[j] ? outerCount[j].ties += 1 : outerCount[j] = {wins: 0, losses: 0, ties: 0, total: 0};
        } else if (this.state.totalWins[i]['teamIds'].indexOf(j) >= 0 && this.state.totalWins[i]['winnerTeamId'] !== j){
          outerCount[j] ? outerCount[j].losses += 1 : outerCount[j] = {wins: 0, losses: 0, ties: 0, total: 0};
        }
      }
    }
    this.mergeData(outerCount, newState);
  },
  getMatchData: function() {
    var newMatchData = {1: [], 2: [], 3: [], 4: []};
    // Iterate through the entire list of matches in totalWins
    for (var j = 1; j < 5; j++) {
      for (var i = 0; i < this.state.totalWins.length; i++) {
        if (this.state.totalWins[i].teamIds.indexOf(j) >= 0) {
          newMatchData[j].push(this.state.totalWins[i]);
        }
      }
    }
    this.setState({
      matchData: newMatchData
    })
  },
  mergeData: function(outerCount, newState) {
    for (var i = 1; i < 5; i++) {
      outerCount[i].total = outerCount[i].wins - outerCount[i].losses;
      _.extend(outerCount[i], this.state.teams[i-1]);
      newState.push(outerCount[i]);
    }
    this.setState({
      teams: newState
    })
  },
  handleTeamClick: function (teamId) {
    this.setState({
      viewType: {team: !this.state.viewType.team, league: !this.state.viewType.league},
      currentTeam: teamId.id
    })
  },
  render: function () {
    var stuff = this.state.teams.sort(function (a, b) {
      return b.total - a.total;
    });
    stuff = this.state.teams.map(function (item) {
      return (
        <ListItem leftAvatar={<Avatar src={item.logoUrl}/>} key={item.id} onClick={this.handleTeamClick.bind(this, item)}>{item.name}</ListItem>
      )
    }.bind(this));
    return (
      <div className="App">
        <Navigation />
        <Paper zDepth={1}>
          {this.state.viewType.league &&
            <List>
              {stuff}
            </List>
          }
          {this.state.viewType.team &&
            <TeamPage
              teamMatches={this.state.matchData[this.state.currentTeam]}
              teamGeneral={this.state.teams}
              teamPlayers={this.state.players[this.state.currentTeam]}
              currentId={this.state.currentTeam}
            />
          }
          {this.state.viewType.match &&
            <MatchPage
              matchStats={_.findWhere(this.state.matchData[this.state.currentTeam], {id: this.state.currentMatch})}
              teamGeneral={this.state.teams}
              goals={_.where(this.state.goals, {matchId: this.state.currentMatch})}
              allPlayers={this.state.players}
            />
          }
          {this.state.viewType.player &&
            <PlayerPage
              playerStats={_.findWhere(this.state.players[this.state.currentTeam], {id: this.state.currentPlayer})}
              playerGoals={_.where(this.state.goals, {playerId: this.state.currentPlayer})}
            />
          }
        </Paper>
      </div>
    );
  }
});

module.exports = App;
