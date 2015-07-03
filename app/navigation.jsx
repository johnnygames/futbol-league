var React = require('react');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;

var Navigation = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  render: function() {
    return (
      <div>
        <AppBar zDepth={0} title='GoGuardian Soccer League' iconClassNameRight="muidocs-icon-navigation-expand-more" />
      </div>
    )
  }
});

module.exports = Navigation;
