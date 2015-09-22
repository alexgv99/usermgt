angular
	.module('usermgt-app')
	.controller('Users', Users);

Users.$inject = ['$q', 'logService', 'selectedUserService', 'httpService', 'lodash', 'debugControllers'];

function Users($q, logService, selectedUserService, httpService, lodash, debugControllers) {
	'use strict';

	var ctrl = this;
	ctrl.users = [];

	activate();

	function activate() {
		ctrl.users = [];
		ctrl.pesquisa = {
			nome: ''
		};
		ctrl.obtainRealmUsers = obtainRealmUsers;
		ctrl.searchUsers = searchUsers;

		ctrl.realmRoles = [];
		ctrl.clientRoles = [];
		ctrl.roles = [];
		ctrl.resetSelectedUser = resetSelectedUser;

		$q.all([
			httpService.obtainRealmRoles().then(function (response) {
				ctrl.realmRoles = response.data;
			}),
			httpService.obtainClientRoles().then(function (response) {
				ctrl.clientRoles = response.data;
			})
		]).then(function () {
			$q.all([
				obtainUserRolesRealm().then(function (response) {
					if (debugControllers) logService.debug("Roles do usuário no Realm: " + JSON.stringify(response.data, null, '\t'));
					carregaRoles(response.data, 'realm');
				}),
				obtainUserRolesClient().then(function (response) {
					if (debugControllers) logService.debug("Roles do usuário no Client: " + JSON.stringify(response.data, null, '\t'));
					carregaRoles(response.data, 'client');
				})
			]).then(function (values) {
				var unido = lodash.union(ctrl.roles, ctrl.realmRoles, ctrl.clientRoles);
				ctrl.roles = lodash.uniq(unido, function (item) {
					return item.id;
				});
			});
		});

		if (debugControllers) logService.debug('Users view ativada');
	}

	function searchUsers() {
		return httpService.searchUser(ctrl.pesquisa).then(
			function (users) {
				ctrl.users = users.data;
				if (debugControllers) logService.debug('UsersController.js - users obtido na pesquisa pelo nome "' + ctrl.pesquisa.nome + '": \n' + JSON.stringify(ctrl.users, null, '\t'));
			}
		);
	}

	function obtainRealmUsers() {
		return httpService.obtainRealmUsers().then(
			function (users) {
				ctrl.users = users.data;
				ctrl.pesquisa.nome = '';
				if (debugControllers) logService.debug('UsersController.js - users do realm: \n' + JSON.stringify(ctrl.realmUsers, null, '\t'));
			}
		);
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

	ctrl.showFilhas = function (role) {
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
	};

	function obtemRolesFilhas(role) {
		var filhas = [];
		obtainCompositesFromRoleName(role).then(function (response) {
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
	//a carga desta roles precisou ficar dentro do controller porque
	//para carregá-las o usuário selecionado já precisa ter sido carregado,
	//o que ocorre no "resolve" do $routeProvider
	function obtainUserRolesRealm() {
		return httpService.obtainUserRolesRealm();
	}

	function obtainUserRolesClient() {
		return httpService.obtainUserRolesClient();
	}

	function obtainCompositesFromRoleName(role) {
		return httpService.obtainCompositesFromRoleName(role);
	}

	function resetSelectedUser() {
		selectedUserService.reset();
	}

}
