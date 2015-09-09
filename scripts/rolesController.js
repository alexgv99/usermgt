/* globals angular, console */
app.controller('rolesController', ['$scope', 'factory', 'selectedUserService', function($scope, factory, selectedUserService) {
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
				ctrl.realmRoles = roles.data;
				//console.log(JSON.stringify(roles.data, null, '\t'));
			}
		);
	};
	ctrl.obtainRealmRoles();

	ctrl.obtainClientRoles = function() {
		factory.obtainClientRoles().then(
			function(roles) {
				ctrl.clientRoles = roles.data;
				//console.log(JSON.stringify(roles.data, null, '\t'));
			}
		);
	};
	ctrl.obtainClientRoles();

	ctrl.obtainRealmUsers = function() {
		factory.obtainRealmUsers().then(
			function(users) {
				ctrl.realmUsers = users.data;
				//console.log(JSON.stringify(users.data, null, '\t'));
			}
		);
	};
//	ctrl.obtainRealmUsers();

	ctrl.obtainUserRoles = function() {
		factory.obtainUserRoles().then(
			function(roles) {
				ctrl.userRoles = roles.data;
				console.log(JSON.stringify(roles.data, null, '\t'));
			}
		);
	};
	ctrl.obtainUserRoles();

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		console.log("tá rodando o evento no controller roles");
	});

	ctrl.resetSelectedUser = function() {
		selectedUserService.reset();
	};


}]);
