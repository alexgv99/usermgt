app.controller('roleController', [
	'$routeParams',
	'logService',
	'selectedUserService',
	'httpService',
	'user',
	'realmRoles',
	'clientRoles',
	function($routeParams, log, selectedUserService, httpService, user, realmRoles, clientRoles) {

		'use strict';

		var ctrl = this;

		ctrl.user = user.data;
		ctrl.realmRoles = realmRoles.data;
		ctrl.clientRoles = clientRoles.data;
		ctrl.userRoles = [];

		//a carga desta roles precisou ficar dentro do controller porque
		//para carregá-las o usuário selecionado já precisa ter sido carregado,
		//o que ocorre no "resolve" do $routeProvider
		ctrl.obtainUserRoles = function() {
			httpService.obtainUserRoles().then(function(roles) {
				ctrl.userRoles = roles.data;
			});
		};
		ctrl.obtainUserRoles();

		ctrl.resetSelectedUser = function() {
			selectedUserService.reset();
		};
	}
]);
