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

	httpService.obtainRealmRoles = function () {
		var url = urlBase() + '/roles';
		logService.info('httpService.obtainRealmRoles: ' + url);
		return $http.get(url);
	};

	httpService.loadClient = function () {
		var url = urlBase() + '/clients/' + keycloakService.get().clientId;
		logService.info('httpService.loadClient: ' + url);
		return $http.get(url);
	};

	httpService.obtainClientRoles = function (client) {
		var url = urlBase() + '/clients/' + client.clientId + '/roles';
		logService.info('httpService.obtainClientRoles: ' + url);
		return $http.get(url);
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

	httpService.obtainUserRolesRealm = function (user) {
		var url = urlBase() +
			'/users/' + user.username +
			'/role-mappings/realm';
		logService.info('httpService.obtainUserRolesRealm: ' + url);
		return $http.get(url);
	};

	httpService.obtainUserRolesClient = function (user, client) {
		var url = urlBase() +
			'/users/' + user.username +
			'/role-mappings/clients/' + client.clientId;
		logService.info('httpService.obtainUserRolesClient: ' + url);
		return $http.get(url);
	};

	httpService.obtainCompositesFromRoleName = function (role) {
		var roleName = role.name;
		var url = urlBase() +
			(role.context === 'client' ? '/clients/' + keycloakService.get().clientId : '') +
			'/roles/' + roleName + '/composites';
		logService.info('httpService.obtainCompositesFromRoleName("' + roleName + '"):\n' + url);
		return $http.get(url);
	};

	httpService.isKeycloakInitialized = function () {
		return keycloakService.get();
	};

	return httpService;
}
