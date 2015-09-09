/* globals angular, console */
var app = angular.module('usermgt-app');

app.controller('userController', ['$scope', 'factory', function($scope, factory) {
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
				console.log(JSON.stringify(users.data, null, '\t'));
			}
		);
	};

	ctrl.limpaFiltros = function() {
		ctrl.pesquisa.nome = '';
		ctrl.users = [];
		factory.limpaFiltros();
	};

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		console.log("tá rodando o evento no controller users");
	});



}]);
