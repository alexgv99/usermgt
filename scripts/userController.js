app.controller('userController', ['$scope', 'logService', 'factory', function($scope, log, factory) {
	'use strict';

	var ctrl = this;

	ctrl.pesquisa = {
		nome : ''
	};

	ctrl.users = [];

	ctrl.selectUser = function(user) {
		factory.selectUser(angular.copy(user));
	};

	ctrl.searchUser = function() {
		factory.searchUser(ctrl.pesquisa).then(
			function(users) {
				ctrl.users = users;
				log.debug('userController.js - objeto users obtido na pesquisa pelo nome "' + ctrl.pesquisa.nome + '": \n' + JSON.stringify(users, null, '\t'));
			}
		);
	};

	ctrl.limpaFiltros = function() {
		ctrl.pesquisa.nome = '';
		ctrl.users = [];
		factory.limpaFiltros();
	};

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		log.debug("userController.js - tá rodando o evento no controller users");
	});



}]);
