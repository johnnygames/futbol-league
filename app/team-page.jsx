var React = require('react/addons');
var _ = require('underscore');
var mui = require('material-ui');
var ListItem = mui.ListItem;
var Paper = mui.Paper;
var Tabs = mui.Tabs;
var Tab = mui.Tab;
var Avatar = mui.Avatar;

var TeamPage = React.createClass({
  handleMatchCLick: function (matchId) {
    var matchEvent = new CustomEvent('matchChoice', {detail: matchId});
    window.dispatchEvent(matchEvent);
  },
  handlePlayerClick: function (playerId) {
    var playerEvent = new CustomEvent('playerChoice', {detail: playerId});
    window.dispatchEvent(playerEvent);
  },
   render: function() {
    var matches = this.props.teamMatches.map(function (match, i) {
      return (
        <ListItem onClick={this.handleMatchCLick.bind(this, match.id)}>
          {_.findWhere(this.props.teamGeneral, {id: match.teamIds[0]}).name} | {_.findWhere(this.props.teamGeneral, {id: match.teamIds[1]}).name}
        </ListItem>
      )
    }.bind(this))
    var players = this.props.teamPlayers.map(function (player) {
      return (
        <ListItem onClick={this.handlePlayerClick.bind(this, player.id)} leftAvatar={<Avatar src={player.avatarUrl} />}>{ player.name } | { player.position } </ListItem>
      )
    }.bind(this));
    return(
      <div>
        <Paper zDepth={1}>
          <img src={_.findWhere(this.props.teamGeneral, {id: this.props.currentId}).logoUrl} />
          <p><h1> {_.findWhere(this.props.teamGeneral, {id: this.props.currentId}).name} </h1></p>
          <p><h3> {_.findWhere(this.props.teamGeneral, {id: this.props.currentId}).wins} - {_.findWhere(this.props.teamGeneral, {id: this.props.currentId}).losses} </h3></p>
          <Tabs>
            <Tab label="Matches" >
              { matches }
            </Tab>
            <Tab label="Players" >
              { players }
            </Tab>
          </Tabs>
        </Paper>
      </div>
  )
  }
})

module.exports = TeamPage;
