angular
	.module('usermgt-app')
	.controller('Roles', Roles);

Roles.$inject = ['$routeParams', 'logService', 'selectedUserService', 'httpService', 'user', 'realmRoles', 'clientRoles'];

function Roles($routeParams, logService, selectedUserService, httpService, user, realmRoles, clientRoles) {

	'use strict';

	var ctrl = this;

	ctrl.user = user.data;
	ctrl.realmRoles = realmRoles.data;
	ctrl.clientRoles = clientRoles.data;
	ctrl.userRoles = [];
	ctrl.resetSelectedUser = resetSelectedUser;

	activate();

	function activate() {
		obtainUserRoles().then(function (data) {
			logService.debug("Roles view ativada 1: " + JSON.stringify(data, null, '\t'));
		});
		logService.debug("Roles view ativada 2");
	}

	//a carga desta roles precisou ficar dentro do controller porque
	//para carregá-las o usuário selecionado já precisa ter sido carregado,
	//o que ocorre no "resolve" do $routeProvider
	function obtainUserRoles() {
		return httpService.obtainUserRoles().then(function (roles) {
			ctrl.userRoles = roles.data;
			return ctrl.userRoles;
		}).then(function (data) {
			logService.debug('Outra promise: ' + JSON.stringify(data, null, '\t'));
			return data;
		});
	}

	function resetSelectedUser() {
		selectedUserService.reset();
	}
}
