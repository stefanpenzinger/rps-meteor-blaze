Template.register.events({
	'submit form': function(event){
		event.preventDefault();
		const username = $('[name=username]').val();
		const password = $('[name=password]').val();

		Accounts.createUser({
			username: username,
			password: password
		});
	}
});