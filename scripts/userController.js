/* globals angular, console */
var app = angular.module('usermgt-app');

app.controller('userController', ['factory', function(factory) {
	'use strict';

	var ctrl = this;

	ctrl.pesquisa = {
		nome : ''
	};

	ctrl.users = [];

	ctrl.selectUser = function(user) {
		factory.selectUser(angular.copy(user));
	};

	ctrl.pesquisaUser = function() {
		factory.pesquisaUser(ctrl.pesquisa).then(
			function(users) {
				ctrl.users = users.data;
				console.log(JSON.stringify(users.data, null, '\t'));
			}
		);
	};

	ctrl.limpaFiltros = function() {
		ctrl.pesquisa.nome = '';
		ctrl.users = [];
		factory.limpaFiltros();
	};

}]);
