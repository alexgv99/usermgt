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
	ctrl.userRolesRealm = [];
	ctrl.userRolesClient = [];
	ctrl.resetSelectedUser = resetSelectedUser;

	activate();

	function activate() {
		obtainUserRolesRealm().then(function (data) {
			logService.debug("Roles do usuário no Realm: " + JSON.stringify(data, null, '\t'));
		});
		obtainUserRolesClient().then(function (data) {
			logService.debug("Roles do usuário no Client: " + JSON.stringify(data, null, '\t'));
		});
	}

	//a carga desta roles precisou ficar dentro do controller porque
	//para carregá-las o usuário selecionado já precisa ter sido carregado,
	//o que ocorre no "resolve" do $routeProvider
	function obtainUserRolesRealm() {
		return httpService.obtainUserRolesRealm().then(function (roles) {
			ctrl.userRolesRealm = roles.data;
			return ctrl.userRolesRealm;
		});
	}
	function obtainUserRolesClient() {
		return httpService.obtainUserRolesClient().then(function (roles) {
			ctrl.userRolesClient = roles.data;
			return ctrl.userRolesClient;
		});
	}

	function resetSelectedUser() {
		selectedUserService.reset();
	}
}
