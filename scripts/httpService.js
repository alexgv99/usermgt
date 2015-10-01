angular
	.module('usermgt-app')
	.factory('httpService', service);

service.$inject = ['$http', '$httpParamSerializer', 'logService', 'keycloakService'];

function service($http, $httpParamSerializer, logService, keycloakService) {

	'use strict';

	var urlBase = function () {
		var kc = keycloakService.get();
		if (kc) {
			return kc.authServerUrl + '/admin/realms/' + kc.realm;
		}
		return "AINDA NÃO TEM A URL DO KEYCLOAK!!!!!";
	};

	var httpService = {};

	httpService.loadRealm = function () {
		var url = urlBase();
		logService.info('httpService.loadRealm: ' + url);
		return $http.get(url);
	};

	httpService.loadClient = function (client) {
		var url = urlBase() + '/clients/' + client.id;
		logService.info('httpService.loadClient: ' + url);
		return $http.get(url);
	};

	httpService.selectClient = function () {
		var url = urlBase() + '/clients';
		logService.info('httpService.obtainClients: ' + url);
		return $http.get(url).then(function (response) {
			var clientOut = null;
			angular.forEach(response.data, function (client, key) {
				if (client.clientId === keycloakService.get().clientId) {
					clientOut = client;
				}
			});
			return httpService.loadClient(clientOut);
		});
	};

	httpService.loadUser = function (username) {
		var url = urlBase() + '/users/' + username;
		logService.info('httpService.loadUser: ' + url);
		return $http.get(url);
	};

	httpService.searchUser = function (parms) {
		var url = urlBase() + '/users';
		var json = {
			"params": {
				"search": parms.nome
			}
		};
		logService.info('httpService.searchUser: ' + url + '?' + $httpParamSerializer(json));
		return $http.get(url, json);
	};

	httpService.obtainRealmRoles = function () {
		var url = urlBase() + '/roles';
		logService.info('httpService.obtainRealmRoles: ' + url);
		return $http.get(url);
	};

	httpService.obtainClientRoles = function (client) {
		var url = urlBase() + '/clients/' + client.id + '/roles';
		logService.info('httpService.obtainClientRoles: ' + url);
		return $http.get(url);
	};

	httpService.obtainUserRolesRealm = function (user) {
		var url = urlBase() +
			'/users/' + user.id +
			'/role-mappings/realm';
		logService.info('httpService.obtainUserRolesRealm: ' + url);
		return $http.get(url);
	};

	httpService.obtainUserRolesClient = function (user, client) {
		var url = urlBase() +
			'/users/' + user.id +
			'/role-mappings/clients/' + client.id;
		logService.info('httpService.obtainUserRolesClient: ' + url);
		return $http.get(url);
	};

	httpService.obtainCompositesFromRoleName = function (role) {
		var roleName = role.name;
		var url = urlBase() +
			(role.context === 'client' ? '/clients/' + keycloakService.get().clientId : '') +
			'/roles/' + roleName + '/composites';
		logService.info('httpService.obtainCompositesFromRoleName("' + roleName + '"): ' + url);
		return $http.get(url);
	};

	httpService.isKeycloakInitialized = function () {
		return keycloakService.get();
	};

	return httpService;
}
