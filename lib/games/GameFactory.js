const { nanoid } = require('nanoid');

class GameFactory {
  static #games = [
    require('./tingurides/taxi'),
    require('./tingurides/delivery'),
    require('./tingurides/partners'),
    require('./tingurides/register'),
    require('./tingurides/help'),
    require('./tingurides/complaints')
  ];

  static createGame(index) {
    const gameId = nanoid();
    const Game = GameFactory.#games[index];
    
    return new Game(gameId);
  }

  static getGames() {
    return GameFactory.#games;
  }
}

module.exports = GameFactory;
