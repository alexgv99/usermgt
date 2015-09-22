angular
	.module('usermgt-app')
	.controller('Roles', Roles);

Roles.$inject = ['$q', '$routeParams', 'logService', 'selectedUserService', 'httpService', 'user', 'realmRoles', 'clientRoles', 'debugControllers', 'lodash'];

function Roles($q, $routeParams, logService, selectedUserService, httpService, user, realmRoles, clientRoles, debugControllers, lodash) {

	'use strict';

	var ctrl = this;

	ctrl.user = user.data;
	ctrl.realmRoles = realmRoles.data;
	ctrl.clientRoles = clientRoles.data;
	ctrl.roles = [];
	ctrl.resetSelectedUser = resetSelectedUser;

	activate();

	function activate() {
		$q.all([
			obtainUserRolesRealm().then(function (response) {
				debugControllers && logService.debug("Roles do usuário no Realm: " + JSON.stringify(response.data, null, '\t'));
				carregaRoles(response.data, 'realm');
			}),
			obtainUserRolesClient().then(function (response) {
				debugControllers && logService.debug("Roles do usuário no Client: " + JSON.stringify(response.data, null, '\t'));
				carregaRoles(response.data, 'client');
			})
		]).then(function(values) {
			var unido = lodash.union(ctrl.roles, ctrl.realmRoles, ctrl.clientRoles);
			ctrl.roles = lodash.uniq(unido, function(item) {
				return item.id;
			});
		});
	}

	function carregaRoles(roles, context) {
		angular.forEach(roles, function(role, key) {
			role.context=context;
			role.checked = true;
			if (role.composite) {
				obtemRolesFilhas(role);
			}
			ctrl.roles.push(role);
		});
	}

	ctrl.showFilhas = function(role) {
		var saida = '';
		if (role.composite) {
			if (role.filhas) {
				angular.forEach(role.filhas, function(role, key) {
					saida += (saida === '' ? '(' : ', ') + role.name;
				});
			}
			saida += ')';
		}
		return saida;
	};

	function obtemRolesFilhas(role) {
		var filhas = [];
		obtainCompositesFromRoleName(role).then(function(response) {
			angular.forEach(response.data, function(roleFilha, key) {
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
