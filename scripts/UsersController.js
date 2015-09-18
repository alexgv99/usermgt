angular
	.module('usermgt-app')
	.controller('Users', Users);

Users.$inject = ['logService', 'httpService'];

function Users(logService, httpService) {
	'use strict';

	var ctrl = this;
	ctrl.users = [];
	ctrl.realmUsers = [];
	ctrl.pesquisa = {
		nome: ''
	};
	ctrl.obtainRealmUsers = obtainRealmUsers;
	ctrl.searchUsers = searchUsers;

	activate();

	function activate() {
		logService.debug('Users view ativada');
	}

	function searchUsers() {
		return httpService.searchUser(ctrl.pesquisa).then(
			function (users) {
				ctrl.users = users.data;
				logService.debug('UsersController.js - users obtido na pesquisa pelo nome "' + ctrl.pesquisa.nome + '": \n' + JSON.stringify(ctrl.users, null, '\t'));
			}
		);
	}

	function obtainRealmUsers() {
		return httpService.obtainRealmUsers().then(
			function (users) {
				ctrl.realmUsers = users.data;
				logService.debug('UsersController.js - users do realm: \n' + JSON.stringify(ctrl.realmUsers, null, '\t'));
			}
		);
	}


}
