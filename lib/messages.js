const GameFactory = require('./games/GameFactory');

const listOfGames = (req) => (()=>{
  let message = '';
  const games = GameFactory.getGames(req);

  games.forEach((Game, i) => {
    message += `${i + 1} - ${Game.name}\n`;
  });

  return message;
})();

const invalidInputMsg =
  '⚠️ Your message does not correspond to any command or game. ' +
  'Use */h* command to get additional help.';

const serverErrorMsg =
  '🚨 Uh, oh! We had some difficulties processing your message.' +
  'Could you please send it again?';

const singlePlayerWelcomeMsg = (req) => (() => {
  let message =
    'Welcome to TINGU SERVICE Chatbot \n\n' +
    listOfGames(req) +
    // '\nAlternatively, if you are brave enough, switch to multiplayer mode ' +
    // 'with */m* command and play with others! 😎\n' +
    'You can bring this guide again with */h* command 🆘';

  return message;
})();

const multiPlayerWelcomeMsg =
  'Welcome to Zim Whatsapp Gaming Multiplayer mode! 🎮\n' +
  'Create a game session with */c* command. 👨‍🚀\n' +
  'View available games to join with */g* command. 🔥\n' +
  "Once you've choosen a game, join it with */j* command. 🚀\n" +
  'Quit the game with */q* command. 🎈\n' +
  'Return back to single player mode with */s* command. ⭐\n' +
  'You can bring this guide again with */h* command. 🆘';

const getRootMenu = (req) => {
  const user = req || {};
  if (user.type == 'client') {
    return listOfGames(req)
  } else if (user.type == 'driver') {
    return 'DASHBOARD FOR DRIVER'
  } else {
    return "Welcome to Tingu Rides, To have a pleasant journey please :\n" + listOfGames(req)
  }

}

module.exports = {
  listOfGames,
  invalidInputMsg,
  serverErrorMsg,
  singlePlayerWelcomeMsg,
  multiPlayerWelcomeMsg,
  getRootMenu
};
