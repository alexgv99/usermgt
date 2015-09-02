/* globals angular, console */
var app = angular.module('usermgt-app');

app.controller('initialController', ['$scope', '$log', function($scope, $log) {
	$scope.usuario = { nome: 'Visitante' };

	$scope.$on('carregou-dados-usuario', function(event, dados) {
		$log.log("tá rodando o evento no controller do login");
		$scope.usuario = dados;
		$scope.$apply();
	});
}]);
