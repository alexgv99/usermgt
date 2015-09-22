angular
	.module('usermgt-app')
	.controller('Initial', Initial);

Initial.$inject = ['$scope', '$location', 'httpService', 'logService', 'debugControllers'];

function Initial($scope, $location, httpService, logService, debugControllers) {
	var ctrl = this;

	$scope.usuario = {
		nome: 'Visitante'
	};

	$scope.$on('carregou-dados-usuario', function (event, dados) {
		debugControllers && logService.debug("initialController.js - tá rodando o evento no controller do login");
		httpService.loadRealm();
		httpService.loadClient();
		$scope.usuario = dados;
		$location.path('/');
		$scope.$apply();
	});
}
