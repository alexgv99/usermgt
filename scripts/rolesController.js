app.controller('rolesController', ['$scope', 'logService', 'factory', 'selectedUserService', function($scope, log, factory, selectedUserService) {
	'use strict';

	var ctrl = this;

	ctrl.user = factory.user;
	ctrl.realmRoles = [];
	ctrl.clientRoles = [];
	ctrl.realmUsers = [];
	ctrl.userRoles = [];
	ctrl.client = {};

	ctrl.obtainRealmRoles = function() {
		factory.obtainRealmRoles().then(
			function(roles) {
				ctrl.realmRoles = roles;
				log.debug('rolesController.js - objeto realmRoles: \n' + JSON.stringify(roles, null, '\t'));
			}
		);
	};
	ctrl.obtainRealmRoles();

	ctrl.obtainClientRoles = function() {
		factory.obtainClientRoles().then(
			function(roles) {
				ctrl.clientRoles = roles;
				log.debug('rolesController.js - objeto clientRoles: \n' + JSON.stringify(roles, null, '\t'));
			}
		);
	};
	ctrl.obtainClientRoles();

	ctrl.obtainRealmUsers = function() {
		factory.obtainRealmUsers().then(
			function(users) {
				ctrl.realmUsers = users;
				log.debug('rolesController.js - objeto realmUsers: \n' + JSON.stringify(users, null, '\t'));
			}
		);
	};
	ctrl.obtainRealmUsers();

	ctrl.obtainUserRoles = function() {
		factory.obtainUserRoles().then(
			function(roles) {
				ctrl.userRoles = roles;
				log.debug('rolesController.js - objeto userRoles: \n' + JSON.stringify(roles, null, '\t'));
			}
		);
	};
	ctrl.obtainUserRoles();

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		log.debug('rolesController.js - tá rodando o evento no controller roles');
	});

	ctrl.resetSelectedUser = function() {
		selectedUserService.reset();
	};


}]);
