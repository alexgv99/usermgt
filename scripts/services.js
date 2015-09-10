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
			factory.users = response.data;
			return response.data;
		});
	};

	factory.obtainRealmRoles = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/roles').then(function(response) {
			factory.realmRoles = response.data;
			return response.data;
		});
	};

	factory.obtainClientRoles = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/clients/' + keycloakService.get().clientId + '/roles').then(function(response) {
			factory.clientRoles = response.data;
			return response.data;
		});
	};

	factory.obtainRealmUsers = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/users').then(function(response) {
			factory.realmUsers = response.data;
			return response.data;
		});
	};

	factory.obtainUserRoles = function() {
		return $http.get(urlBase + keycloakService.get().realm + '/users/' + factory.user.username + '/role-mappings').then(function(response) {
			factory.userRoles = response.data;
			return response.data;
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

app.service('keycloakService', ['$localStorage', function($localStorage) {
	this.set = function(keycloakObject) {
		$localStorage.keycloakObject = keycloakObject;
	};
	this.get = function() {
		return $localStorage.keycloakObject;
	};
	this.reset = function() {
		delete $localStorage.keycloakObject;
	};
}]);

app.service('selectedUserService', ['$localStorage', function($localStorage) {
	this.set = function(selectedUser) {
		$localStorage.selectedUser = selectedUser;
	};
	this.get = function() {
		return $localStorage.selectedUser;
	};
	this.reset = function() {
		delete $localStorage.selectedUser;
	};
}]);

app.service('logService', ['$log', function($log) {
	this.debug = function(msg) {
		$log.debug(msg);
	};
	this.info = function(msg) {
		$log.info(msg);
	};
	this.error = function(msg) {
		$log.error(msg);
	};
	this.warn = function(msg) {
		$log.warn(msg);
	};
}]);
