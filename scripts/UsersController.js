angular
	.module('usermgt-app')
	.controller('Users', Users);

Users.$inject = ['logService', 'httpService', 'debugControllers'];

function Users(logService, httpService, debugControllers) {
	'use strict';

	var ctrl = this;

	activate();

	function activate() {
		ctrl.users = [];
		ctrl.realmUsers = [];
		ctrl.pesquisa = {
			nome: ''
		};
		ctrl.obtainRealmUsers = obtainRealmUsers;
		ctrl.searchUsers = searchUsers;		
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
				ctrl.realmUsers = users.data;
				if (debugControllers) logService.debug('UsersController.js - users do realm: \n' + JSON.stringify(ctrl.realmUsers, null, '\t'));
			}
		);
	}


}
