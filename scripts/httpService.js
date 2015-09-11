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

		httpService.loadRealm = function() {
			var url = urlBase + keycloakService.get().realm;
			return $http.get(url).then(function(response) {
				realmService.set(response.data);
				return response;
			});
		};

		httpService.loadClient = function() {
			var url = urlBase + keycloakService.get().realm + '/clients/' + keycloakService.get().clientId;
			return $http.get(url).then(function(response) {
				clientService.set(response.data);
				return response;
			});
		};

		httpService.loadUser = function(parms) {
			var url = urlBase + keycloakService.get().realm + '/users/' + parms.id;
			log.info('httpService.searchUser: ' + url + '?search=' + parms.id);
			var json = { "search": parms.id };
			return $http.get(url , {params: json}).then(function(response) {
				selectedUserService.set(response.data);
				return response;
			});
		};

		httpService.searchUser = function(parms) {
			var url = urlBase + keycloakService.get().realm + '/users';
			log.info('httpService.searchUser: ' + url + '?search=' + parms.nome);
			var json = { "search": parms.nome };
			return $http.get(url , {params: json});
		};

		httpService.obtainRealmUsers = function() {
			var url = urlBase + keycloakService.get().realm + '/users';
			log.info('httpService.obtainRealmUsers: ' + url);
			return $http.get(url);
		};

		httpService.obtainRealmRoles = function() {
			var url = urlBase + keycloakService.get().realm + '/roles';
			log.info('httpService.obtainRealmRoles: ' + url);
			return $http.get(url);
		};

		httpService.obtainClientRoles = function() {
			var url = urlBase + keycloakService.get().realm + '/clients/' + clientService.get().clientId + '/roles';
			log.info('httpService.obtainClientRoles: ' + url);
			return $http.get(url);
		};

		httpService.obtainUserRoles = function() {
			var url = urlBase + keycloakService.get().realm +
				'/users/' + selectedUserService.get().username +
				'/role-mappings/clients-by-id/' + clientService.get().id;
			log.info('httpService.obtainUserRoles: ' + url);
			return $http.get(url);
		};

		return httpService;
	}
]);
