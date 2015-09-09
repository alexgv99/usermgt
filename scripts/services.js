/* globals angular, app */
//var app = angular.module('usermgt-app');

app.factory('factory', ['$http', 'selectedUserService', 'keycloakService', function($http, selectedUserService, keycloakService) {

	'use strict';

	var urlBase = keycloakService.get().authServerUrl + '/admin/realms/';
	var factory = {};

	factory.users = [];
	factory.user = selectedUserService.get();
	factory.realmUsers = [];
	factory.realmRoles = [];
	factory.clientRoles = [];
	factory.userRoles = [];

	factory.searchUser = function(parms) {
		var json = { "search": parms.nome };
		return $http.get(urlBase + keycloakService.get().realm + '/users' , {params: json}).then(function(response) {
			factory.users = response;
			return response;
		});
	};

	factory.obtainRealmRoles = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/roles').then(function(response) {
			factory.realmRoles = response;
			return response;
		});
	};

	factory.obtainClientRoles = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/clients/' + keycloakService.get().clientId + '/roles').then(function(response) {
			factory.clientRoles = response;
			return response;
		});
	};

	factory.obtainRealmUsers = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/users').then(function(response) {
			factory.realmUsers = response;
			return response;
		});
	};

	factory.obtainUserRoles = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/users/' + factory.user.username + '/role-mappings').then(function(response) {
			factory.userRoles = response;
			return response;
		});
	};

	factory.selectUser = function(user) {
		factory.user = user;
		selectedUserService.set(user);
	};

	factory.limpaFiltros = function() {
		factory.users = [];
	};

	return factory;

}]);
