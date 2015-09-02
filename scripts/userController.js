/* globals angular, console */
var app = angular.module('usermgt-app');

app.controller('userController', ['factory', '$log', function(factory, $log) {
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
				ctrl.users = users.data;
				$log.log(JSON.stringify(users.data, null, '\t'));
			}
		);
	};

	ctrl.limpaFiltros = function() {
		ctrl.pesquisa.nome = '';
		ctrl.users = [];
		factory.limpaFiltros();
	};

}]);
