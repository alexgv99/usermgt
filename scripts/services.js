/* globals angular, app */
//var app = angular.module('usermgt-app');

app.factory('factory', ['$http', 'keycloakService', function($http, keycloakService) {

	'use strict';

	var urlBase = keycloakService.le().authServerUrl + '/admin/realms/';
	var factory = {};

	factory.pesquisa = {
		nome: ''
	};

	factory.users = [];
	factory.user = {};

	factory.pesquisaUser = function(parms) {
		factory.pesquisa.nome = parms.nome;

		var json = { "search": parms.nome };
		return $http.get(urlBase + keycloakService.le().realm + '/users' , {params: json}).then(function(response) {
			factory.users = response;
			return response;
		});

	};

	factory.selectUser = function(user) {
		factory.user = user;
	};

	factory.limpaFiltros = function() {
		factory.pesquisa.nome = '';
		factory.users = [];
	};

	return factory;

}]);