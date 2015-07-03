var React = require('react');
var mui = require('material-ui');
var _ = require('underscore');
var ListItem = mui.ListItem;
var List = mui.List;
/****
  What we need here: DONE names/logos of the two teams that played --> easy to get from teamGeneral prop
                     Needs polish - Date and time of match played --> need to parse timestamp, also easy to get from matchStats prop
                     DONE Final score of the match --> Easy to get from matchStats.teamGoals array
                     Who scored which goals in the game and when --> hard part, make AJAX for /goals, filter out goals by game, maybe update state objects with goal data array
****/
var MatchPage = React.createClass({
  componentDidMount: function () {

  },
  organizeMatchData: function () {

  },
  render: function () {
    // (player name) scored a goal at the _ minute of the game from _ feet out from the _
    var goals = this.props.goals.map(function (goal) {
      return (
        <ListItem>
          {(_.findWhere(this.props.allPlayers[goal.teamId], {id: goal.playerId}).name)}
            scored a goal at the {goal.matchMinute} minute mark from {goal.shot.distance} feet out from the {goal.shot.location}
        </ListItem>
      )
    }.bind(this));
    var match = this.props.matchStats;
    var date = new Date(match.timestamp*1000);
    var hours = date.getHours();
    // minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return (
      <div>
        <div>
          <img src={_.findWhere(this.props.teamGeneral, {id: match.teamIds[0]}).logoUrl} />
          VS
          <img src={_.findWhere(this.props.teamGeneral, {id: match.teamIds[1]}).logoUrl} />
        </div>
        <div>
          {_.findWhere(this.props.teamGeneral, {id: match.teamIds[0]}).name}
          {_.findWhere(this.props.teamGeneral, {id: match.teamIds[1]}).name}
        </div>
        {formattedTime}
        <div>
          {match.teamGoals[match.teamIds[0]]} - {match.teamGoals[match.teamIds[1]]}
        </div>
        <div>
          Match Goals!
          <List>
            { goals }
          </List>
        </div>
      </div>
    );
  }
});

module.exports = MatchPage;
