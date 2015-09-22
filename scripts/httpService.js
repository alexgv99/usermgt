angular
	.module('usermgt-app')
	.factory('httpService', service);

service.$inject = ['$http', 'logService', 'realmService', 'clientService', 'selectedUserService', 'keycloakService', 'debugServices'];

function service($http, logService, realmService, clientService, selectedUserService, keycloakService, debugServices) {

	'use strict';

	var urlBase = function () {
		return keycloakService.get() ? keycloakService.get().authServerUrl + '/admin/realms/' : '';
	};

	var httpService = {};

	httpService.loadRealm = function () {
		var url = urlBase() + keycloakService.get().realm;
		return $http.get(url).then(function (response) {
			realmService.set(response.data);
			if (debugServices) logService.debug('httpService.loadRealm("' + keycloakService.get().realm + '"):\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.loadClient = function () {
		var url = urlBase() + keycloakService.get().realm + '/clients/' + keycloakService.get().clientId;
		return $http.get(url).then(function (response) {
			clientService.set(response.data);
			if (debugServices) logService.debug('httpService.loadClient("' + keycloakService.get().clientId + '"):\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.loadUser = function (parms) {
		var url = urlBase() + keycloakService.get().realm + '/users/' + parms.id;
		logService.info('httpService.searchUser: ' + url + '?search=' + parms.id);
		var json = {
			"search": parms.id
		};
		return $http.get(url, {
			params: json
		}).then(function (response) {
			selectedUserService.set(response.data);
			if (debugServices) logService.debug('httpService.searchUser("' + parms.id + '"):\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.searchUser = function (parms) {
		var url = urlBase() + keycloakService.get().realm + '/users';
		logService.info('httpService.searchUser: ' + url + '?search=' + parms.nome);
		var json = {
			"search": parms.nome
		};
		return $http.get(url, { params: json }).then(function(response) {
			if (debugServices) logService.debug('httpService.searchUser("' + parms.nome + '"):\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.obtainRealmUsers = function () {
		if (urlBase() !== '') {
			var url = urlBase() + keycloakService.get().realm + '/users';
			logService.info('httpService.obtainRealmUsers: ' + url);
			return $http.get(url).then(function(response) {
			if (debugServices) logService.debug('httpService.obtainRealmUsers:\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
		}
	};

	httpService.obtainRealmRoles = function () {
		var url = urlBase() + keycloakService.get().realm + '/roles';
		logService.info('httpService.obtainRealmRoles: ' + url);
		return $http.get(url).then(function(response) {
			if (debugServices) logService.debug('httpService.obtainRealmRoles:\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.obtainClientRoles = function () {
		var url = urlBase() + keycloakService.get().realm + '/clients/' + clientService.get().clientId + '/roles';
		logService.info('httpService.obtainClientRoles: ' + url);
		return $http.get(url).then(function(response) {
			if (debugServices) logService.debug('httpService.obtainClientRoles:\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.obtainUserRolesRealm = function () {
		var url = urlBase() + keycloakService.get().realm +
			'/users/' + selectedUserService.get().username +
			'/role-mappings/realm';
		logService.info('httpService.obtainUserRolesRealm: ' + url);
		return $http.get(url).then(function(response) {
			if (debugServices) logService.debug('httpService.obtainUserRolesRealm:\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.obtainUserRolesClient = function () {
		var url = urlBase() + keycloakService.get().realm +
			'/users/' + selectedUserService.get().username +
			'/role-mappings/clients-by-id/' + clientService.get().id;
		logService.info('httpService.obtainUserRolesClient: ' + url);
		return $http.get(url).then(function(response) {
			if (debugServices) logService.debug('httpService.obtainUserRolesClient:\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	httpService.obtainCompositesFromRoleName = function(role) {
		var roleName = role.name;
		var url = urlBase() + keycloakService.get().realm +
			(role.context === 'client' ? '/clients/' + clientService.get().clientId : '') +
			'/roles/' + roleName + '/composites';
		logService.info('httpService.obtainCompositesFromRoleName("' + roleName + '"): ' + url);
		return $http.get(url).then(function(response) {
			if (debugServices) logService.debug('httpService.obtainCompositesFromRoleName("' + roleName + '"):\n'+ JSON.stringify(response.data, null, '\t'));
			return response;
		});
	};

	return httpService;
}
