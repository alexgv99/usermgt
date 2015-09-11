app.controller('userController', [
	'logService',
	'httpService',
	'realmUsers',
	function(log, httpService, realmUsers) {
		'use strict';

		var ctrl = this;
		ctrl.users = [];
		ctrl.realmUsers = realmUsers.data;
		ctrl.pesquisa = {
			nome : ''
		};

		ctrl.searchUser = function() {
			httpService.searchUser(ctrl.pesquisa).then(
				function(users) {
					ctrl.users = users.data;
					log.debug('userController.js - objeto users obtido na pesquisa pelo nome "' + ctrl.pesquisa.nome + '": \n' + JSON.stringify(ctrl.users, null, '\t'));
				}
			);
		};

	}
]);
