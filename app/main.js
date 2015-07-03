var React = require('react');
var App = require('./component.jsx');
var injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

React.render(<App
  source="https://futbol-api.goguardian.com/teams"
  matches="https://futbol-api.goguardian.com/matches"
  players="https://futbol-api.goguardian.com/players"
  goals="https://futbol-api.goguardian.com/goals"
/>, document.body);
