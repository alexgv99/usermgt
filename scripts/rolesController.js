/* globals angular, console */
app.controller('rolesController', ['factory', function(factory) {
	'use strict';

	var ctrl = this;

	ctrl.user = factory.user;
	ctrl.realmRoles = [];
	ctrl.clientRoles = [];
	ctrl.client = {};

	ctrl.obtainRealmRoles = function() {
		factory.obtainRealmRoles().then(
			function(roles) {
				ctrl.realmRoles = roles.data;
				console.log(JSON.stringify(roles.data, null, '\t'));
			}
		);
	};
	ctrl.obtainRealmRoles();

	ctrl.obtainClientRoles = function() {
		factory.obtainClientRoles().then(
			function(roles) {
				ctrl.clientRoles = roles.data;
				console.log(JSON.stringify(roles.data, null, '\t'));
			}
		);
	};
	ctrl.obtainClientRoles();

}]);
