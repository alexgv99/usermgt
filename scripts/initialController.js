var app = angular.module('usermgt-app');

app.controller('initialController', ['$scope', 'httpService', 'logService', function($scope, httpService, log) {

	var ctrl = this;

	$scope.usuario = { nome: 'Visitante' };

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		log.debug("initialController.js - tá rodando o evento no controller do login");
		httpService.loadRealm();
		httpService.loadClient();
		$scope.usuario = dados;
		$scope.$apply();
	});
}]);
