const { nanoid } = require('nanoid');

class GameFactory {
  static #games = [
    require('./tingurides/taxi'),
    require('./tingurides/delivery'),
    require('./tingurides/partners'),
    require('./tingurides/auth/register'),
    require('./tingurides/help'),
    require('./tingurides/complaints')
  ];

  static #main_menu = [
    require('./tingurides/auth/login'),
    require('./tingurides/auth/register'),
  ];
  static #client_menu = [
    require('./tingurides/taxi'),
    require('./tingurides/delivery'),
    require('./tingurides/help'),
    require('./tingurides/complaints')
  ];
  static #driver_menu = [
    require('./tingurides/help'),
    require('./tingurides/complaints')
  ];

  static createGame(index, req) {
    const gameId = nanoid();
    const user = req.session.user || {}
    
    if (user.type == 'client') {
      const Game = GameFactory.#client_menu[index];
      return new Game(gameId);
    }
    else if(user.type == 'client') {
      const Game = GameFactory.#driver_menu[index];
      return new Game(gameId);
    } else {
      const Game = GameFactory.#main_menu[index];
      return new Game(gameId);
    }
    
    
  }

  static getGames(req) {
    const user = req || {}
    if (user.type == 'client') {
      return GameFactory.#client_menu
    }
    else if(user.type == 'client') {
      return GameFactory.#driver_menu
    } else {
      return GameFactory.#main_menu;
    }
    
  }
}

module.exports = GameFactory;
