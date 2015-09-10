var app = angular.module('usermgt-app');

app.controller('initialController', ['$scope', 'httpService', 'logService', function($scope, httpService, log) {

	var ctrl = this;

	ctrl.obtainRealm = function() {
		httpService.obtainRealm().then(
			function(realm) {
				log.debug('initialController.js - objeto realm: \n' + JSON.stringify(realm, null, '\t'));
			}
		);
	};

	ctrl.obtainClient = function() {
		httpService.obtainClient().then(
			function(client) {
				log.debug('initialController.js - objeto client: \n' + JSON.stringify(client, null, '\t'));
			}
		);
	};

	$scope.usuario = { nome: 'Visitante' };

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		log.debug("initialController.js - tá rodando o evento no controller do login");
		ctrl.obtainRealm();
		ctrl.obtainClient();
		$scope.usuario = dados;
		$scope.$apply();
	});
}]);
