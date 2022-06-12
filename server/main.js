import { Meteor } from 'meteor/meteor';

Meteor.publish('Games', function gamesPublication() {
	return Games.find({ status: "waiting" }, {
		fields: {
			"status": 1,
			"player1": 1,
			"player2": 1
		}
	});
});

Meteor.publish('MyGame', function myGamePublication() {
	return Games.find({
		$or: [
			{ player1: this.userId },
			{ player2: this.userId }
		]
	})
})

