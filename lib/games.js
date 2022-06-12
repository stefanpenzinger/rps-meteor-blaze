import { Meteor } from 'meteor/meteor';
import {gameLogic} from "./gameLogic";
import {check} from "meteor/check";

export const Games = new Mongo.Collection("games")

Meteor.methods({
	"games.play"() {
		const game = Games.findOne({
			status: "waiting"
		});

		// No game exists ->  create new game
		if (game === undefined) {
			gameLogic.newGame();
		}
		// You are not player 1 and there is still need for a player 2 -> join game
		else if (game.player1 !== this.userId && game.player2 === "") {
			gameLogic.joinGame(game);
		}
	},
	"games.makeMove"(action) {
		check(action, String);

		let game = Games.findOne(
			{
				status: this.userId
			}
		);

		if (game !== undefined) {
			gameLogic.addNewAction(action);

			if (gameLogic.checkIfGameWasWon()) {
				gameLogic.setGameResult(game._id, this.userId);
			} else {
				if (game.actions.length === 2) {
					gameLogic.setGameResult(game._id, "tie");
				}
				else {
					gameLogic.updateTurn(game);
				}
			}
		}
	}
})