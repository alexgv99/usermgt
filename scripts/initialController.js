var app = angular.module('usermgt-app');

app.controller('initialController', ['$scope', 'logService', function($scope, log) {
	$scope.usuario = { nome: 'Visitante' };

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		log.debug("initialController.js - tá rodando o evento no controller do login");
		$scope.usuario = dados;
		$scope.$apply();
	});
}]);
