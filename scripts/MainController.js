angular
	.module('usermgt-app')
	.controller('Main', Main);

Main.$inject = ['$scope', '$location', 'httpService', 'logService'];

function Main($scope, $location, httpService, logService) {
	var ctrl = this;

	ctrl.usuario = {
		nome: 'Visitante'
	};

	ctrl.isKeycloakInitialized = httpService.isKeycloakInitialized;

	$scope.$on('carregou-dados-usuario', function (event, dados) {
		logService.debug("MainController.js - tá rodando o evento no controller do login");
		if (httpService.isKeycloakInitialized()) { //senão, ainda não logou
			ctrl.usuario = dados;
			$scope.$apply();
		}
	});
}
