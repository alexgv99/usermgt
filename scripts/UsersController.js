angular
	.module('usermgt-app')
	.controller('Users', Users);

Users.$inject = ['$scope', 'logService', 'httpService', 'lodash'];

function Users($scope, logService, httpService, lodash) {
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

	$scope.$on('carregou-dados-usuario', function (event, dados) {
		logService.debug("MainController.js - tá rodando o evento no controller do login");
		activate();
	});

	//este método é executado pelo evento gerado no login do usuário
	function activate() {
		httpService.loadRealm()
		.then(function (response) {
			ctrl.realm = response.data;
		})
		.then(function(response) {
			httpService.obtainRealmRoles().then(function (response) {
				ctrl.realmRoles = response.data;
				angular.forEach(ctrl.realmRoles, function (role, key) {
					role.context = 'realm';
					role.checked = false;
					if (role.composite) {
						obtemRolesFilhas(role);
					}
				});
			});
		});

		httpService.loadClient()
		.then(function (response) {
			ctrl.client = response.data;
		})
		.then(function () {
			httpService.obtainClientRoles(ctrl.client).then(function (response) {
				ctrl.clientRoles = response.data;
				angular.forEach(ctrl.clientRoles, function (role, key) {
					role.context = 'client';
					role.checked = false;
					if (role.composite) {
						obtemRolesFilhas(role);
					}
				});
			});
		});

		logService.debug('Users view ativada');
	}

	function searchUsers() {
		return httpService.searchUser(ctrl.pesquisa).then(function (response) {
			ctrl.users = response.data;
			//logService.debug('UsersController.js - users obtido na pesquisa pelo nome "' + ctrl.pesquisa.nome + '"', ctrl.users);
		});
	}

	function selectUser(user) {
		ctrl.user = user;

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
