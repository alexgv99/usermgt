app.factory('httpService', [
	'$http',
	'logService',
	'realmService',
	'clientService',
	'selectedUserService',
	'keycloakService',
	function($http, log, realmService, clientService, selectedUserService, keycloakService) {

		'use strict';

		var urlBase = keycloakService.get().authServerUrl + '/admin/realms/';
		var httpService = {};

		httpService.users = [];
		httpService.user = selectedUserService.get();
		httpService.realm = realmService.get();
		httpService.client = clientService.get();
		httpService.realmUsers = [];
		httpService.realmRoles = [];
		httpService.clientRoles = [];
		httpService.userRoles = [];

		httpService.obtainRealm = function() {
			var url = urlBase + keycloakService.get().realm;
			return $http.get(url).then(function(response) {
				realmService.set(response.data);
				httpService.realm = realmService.get();
				return response.data;
			});
		};

		httpService.obtainClient = function() {
			///admin/realms/{realm}/clients/{id}
			var url = urlBase + keycloakService.get().realm + '/clients/' + keycloakService.get().clientId;
			return $http.get(url).then(function(response) {
				clientService.set(response.data);
				httpService.client = clientService.get();
				return response.data;
			});
		};

		httpService.searchUser = function(parms) {
			var url = urlBase + keycloakService.get().realm + '/users';
			log.info('httpService.searchUser: ' + url + '?search=' + parms.nome);
			var json = { "search": parms.nome };
			return $http.get(url , {params: json}).then(function(response) {
				httpService.users = response.data;
				return response.data;
			});
		};

		httpService.obtainRealmRoles = function() {
			var url = urlBase + keycloakService.get().realm + '/roles';
			log.info('httpService.obtainRealmRoles: ' + url);
			return $http.get(url).then(function(response) {
				httpService.realmRoles = response.data;
				return response.data;
			});
		};

		httpService.obtainClientRoles = function() {
			var url = urlBase + keycloakService.get().realm + '/clients/' + httpService.client.clientId + '/roles';
			log.info('httpService.obtainUserRoles: ' + url);
			return $http.get(url).then(function(response) {
				httpService.clientRoles = response.data;
				return response.data;
			});
		};

		httpService.obtainRealmUsers = function() {
			var url = urlBase + keycloakService.get().realm + '/users';
			log.info('httpService.obtainRealmUsers: ' + url);
			return $http.get(url).then(function(response) {
				httpService.realmUsers = response.data;
				return response.data;
			});
		};

		httpService.obtainUserRoles = function() {
			var url = urlBase + keycloakService.get().realm +
				'/users/' + httpService.user.username +
				'/role-mappings/clients-by-id/' + httpService.client.id;
			log.info('httpService.obtainUserRoles: ' + url);
			return $http.get(url).then(function(response) {
					httpService.userRoles = response.data;
				return response.data;
			});
		};

		httpService.selectUser = function(user) {
			httpService.user = user;
			selectedUserService.set(user);
		};

		return httpService;
	}
]);
