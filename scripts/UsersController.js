angular
	.module('usermgt-app')
	.controller('Users', Users);

Users.$inject = ['$q', 'logService', 'httpService', 'lodash'];

function Users($q, logService, httpService, lodash) {
	'use strict';

	var ctrl = this;
	ctrl.users = [];
	ctrl.user = {};
	ctrl.realm = {};
	ctrl.client = {};
	ctrl.realmRoles = [];
	ctrl.clientRoles = [];
	ctrl.roles = [];
	ctrl.pesquisa = {
		nome: ''
	};
	ctrl.searchUsers = searchUsers;
	ctrl.selectUser = selectUser;
	ctrl.showFilhas = showFilhas;
	ctrl.resetSelectedUser = resetSelectedUser;

	if (httpService.isKeycloakInitialized()) {
	}
		activate();

	function activate() {
		httpService.loadRealm().then(function (response) {
			ctrl.realm = response.data;
		});
		httpService.loadClient().then(function (response) {
			ctrl.client = response.data;
		});
		httpService.obtainRealmRoles(ctrl.realm).then(function (response) {
			ctrl.realmRoles = response.data;
		});
		httpService.obtainClientRoles(ctrl.client).then(function (response) {
			ctrl.clientRoles = response.data;
		});

		logService.debug('Users view ativada');
	}

	function searchUsers() {
		return httpService.searchUser(ctrl.pesquisa).then(function (response) {
			ctrl.users = response.data;
			logService.debug('UsersController.js - users obtido na pesquisa pelo nome "' + ctrl.pesquisa.nome + '"', ctrl.users);
		});
	}

	function selectUser(user) {
		ctrl.user = user;
		//ctrl.selectUser = null;

		return httpService.obtainUserRolesRealm(ctrl.user).then(function (response) {
			logService.debug("Roles do usuário no Realm", response.data);
			carregaRoles(response.data, 'realm');
			return response;
		}).then(function () {
			return httpService.obtainUserRolesClient(ctrl.user, ctrl.client).then(function (response) {
				logService.debug("Roles do usuário no Client", response.data);
				carregaRoles(response.data, 'client');
				return response;
			}).then(function () {
				var unido = lodash.union(ctrl.roles, ctrl.realmRoles, ctrl.clientRoles);
				ctrl.roles = lodash.uniq(unido, function (item) {
					return item.id;
				});
			});
		});
	}

	function carregaRoles(roles, context) {
		angular.forEach(roles, function (role, key) {
			role.context = context;
			role.checked = true;
			if (role.composite) {
				obtemRolesFilhas(role);
			}
			ctrl.roles.push(role);
		});
	}

	function obtemRolesFilhas(role) {
		var filhas = [];
		httpService.obtainCompositesFromRoleName(role).then(function (response) {
			angular.forEach(response.data, function (roleFilha, key) {
				roleFilha.context = role.context;
				if (roleFilha.composite) {
					obtemRolesFilhas(roleFilha);
				}
				filhas.push(roleFilha);
			});
		});
		role.filhas = filhas;
	}

	function showFilhas(role) {
		var saida = '';
		if (role.composite) {
			if (role.filhas) {
				angular.forEach(role.filhas, function (role, key) {
					saida += (saida === '' ? '(' : ', ') + role.name;
				});
			}
			saida += ')';
		}
		return saida;
	}

	function resetSelectedUser() {
		ctrl.user = {};
		ctrl.roles = [];
	}

}
