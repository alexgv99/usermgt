app.controller('roleController', ['$scope', 'logService', 'httpService', 'selectedUserService', function($scope, log, httpService, selectedUserService) {

	'use strict';

	var ctrl = this;

	ctrl.user = httpService.user;
	ctrl.realmRoles = [];
	ctrl.clientRoles = [];
	ctrl.realmUsers = [];
	ctrl.userRoles = [];
	ctrl.client = {};

	ctrl.obtainRealmRoles = function() {
		httpService.obtainRealmRoles().then(
			function(roles) {
				ctrl.realmRoles = roles;
				log.debug('roleController.js - objeto realmRoles: \n' + JSON.stringify(roles, null, '\t'));
			}
		);
	};
	ctrl.obtainRealmRoles();

	ctrl.obtainClientRoles = function() {
		httpService.obtainClientRoles().then(
			function(roles) {
				ctrl.clientRoles = roles;
				log.debug('roleController.js - objeto clientRoles: \n' + JSON.stringify(roles, null, '\t'));
			}
		);
	};
	ctrl.obtainClientRoles();

	ctrl.obtainUserRoles = function() {
		httpService.obtainUserRoles().then(
			function(roles) {
				ctrl.userRoles = roles;
				log.debug('roleController.js - objeto userRoles: \n' + JSON.stringify(roles, null, '\t'));
			}
		);
	};
	ctrl.obtainUserRoles();

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		log.debug('roleController.js - tá rodando o evento no controller roles');
	});

	ctrl.resetSelectedUser = function() {
		selectedUserService.reset();
	};


}]);
