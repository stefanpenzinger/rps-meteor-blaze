import { Meteor } from 'meteor/meteor';
export const gameLogic = new GameLogic();

class GameLogic {
	/**
	 * Creates a new RPS-Game
	 */
	newGame() {
		if (!this.userIsAlreadyPlaying()) {
			Games.insert({
				player1: Meteor.userId(),
				player2: "",
				actions: [],
				status: "waiting",
				result: ""
			})
		}
	}

	/**
	 * Checks if the user is already playing
	 * @returns {boolean}
	 */
	userIsAlreadyPlaying() {
		const game = Games.findOne( {
			$or: [
				{ player1: Meteor.userId() },
				{ player2: Meteor.userId() }
			]
		});

		return game !== undefined;
	}

	/**
	 * Join a game as player 2
	 * @param game The game to join
	 */
	joinGame(game) {
		if (game.player2 === "" && Meteor.userId() !== undefined) {
			Games.update(
				{
					_id: game._id
				},
				{
					$set: {
						"player2": Meteor.userId(),
						"status": game.player1
					}
				}
			);
		}
	}

	addNewAction(action) {
		Games.update(
			{
				status: Meteor.userId()
			},
			{
				$push: {
					action: { playerID: Meteor.userId(), action: action }
				}
			}
		);
	}

	setGameResult(gameId, result) {
		Games.update(
			{_id: gameId},
			{
				$set: {
					"result": result,
					"status": "end"
				}
			}
		);
	}

	updateTurn(game) {
		let nextPlayer;

		if(game.player1 === Meteor.userId())
			nextPlayer = game.player2;
		else
			nextPlayer = game.player1;

		Games.update(
			{status: Meteor.userId()},
			{
				$set: {
					"status": nextPlayer
				}
			}
		);
	}

	/**
	 * schere, stein, papier
	 * @returns {boolean}
	 */
	checkIfGameWasWon() {
		const game = Games.findOne({
			status: Meteor.userId()
		})

		if (game.actions.length < 2 || game.actions[0].action === game.actions[1].action) {
			return false;
		}



		if (game.actions[0].action === "Schere") {
			if (game.actions[1].action === "Stein") {
				return false;
			}
			else if (game.actions[1].action === "Papier") {
				return true;
			}
		}
		if (game.actions[0].action === "Stein") {
			if (game.actions[1].action === "Papier") {
				return false;
			}
			else if (game.actions[1].action === "Schere") {
				return true;
			}
		}
		if (game.actions[0].action === "Papier") {
			if (game.actions[1].action === "Schere") {
				return false;
			}
			else if (game.actions[1].action === "Stein") {
				return true;
			}
		}
	}
}