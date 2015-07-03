var React = require('react/addons');
var _ = require('underscore');
var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;

var PlayerPage = React.createClass({
  render: function () {
    var goals = this.props.playerGoals.map(function (goal) {
      return (
        <ListItem> Goal at { goal.matchMinute} </ListItem>
      )
    });
    return (
      <div>
        {this.props.playerStats}
        <List>
          {goals}
        </List>
      </div>
    )
  }
});

module.exports = PlayerPage;
