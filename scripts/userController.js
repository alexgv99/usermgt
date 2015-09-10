app.controller('userController', ['$scope', 'logService', 'httpService', function($scope, log, httpService) {
	'use strict';

	var ctrl = this;

	ctrl.pesquisa = {
		nome : ''
	};

	ctrl.users = [];

	ctrl.selectUser = function(user) {
		httpService.selectUser(angular.copy(user));
	};

	ctrl.searchUser = function() {
		httpService.searchUser(ctrl.pesquisa).then(
			function(users) {
				ctrl.users = users;
				log.debug('userController.js - objeto users obtido na pesquisa pelo nome "' + ctrl.pesquisa.nome + '": \n' + JSON.stringify(users, null, '\t'));
			}
		);
	};

	ctrl.obtainRealmUsers = function() {
		httpService.obtainRealmUsers().then(
			function(users) {
				ctrl.realmUsers = users;
				log.debug('userController.js - objeto realmUsers: \n' + JSON.stringify(users, null, '\t'));
			}
		);
	};
	ctrl.obtainRealmUsers();

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		log.debug("userController.js - tá rodando o evento no controller users");
	});



}]);
