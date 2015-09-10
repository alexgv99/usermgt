/* globals angular, Keycloak, keycloak, location, alert, window, document */
var app = angular.module('usermgt-app', ['ui.bootstrap', 'ngRoute', 'ngStorage']);

var auth = {};
var logout = function(){
	auth.loggedIn = false;
	auth.authz = null;
	window.location = auth.logoutUrl;
};

app.run(['$rootScope', 'logService', 'keycloakService', function ($rootScope, log, keycloakService) {
	log.debug('config.js: Inicializando a página');
	var keycloakAuth = new Keycloak('keycloak.json');
	auth.loggedIn = false;
	keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
		auth.loggedIn = true;
		auth.authz = keycloakAuth;
		keycloakService.set(keycloakAuth);
		auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/" + keycloakAuth.realm + "/tokens/logout?redirect_uri=http://localhost:8080";
		$rootScope.usuario = {};
		$rootScope.usuario.login = auth.authz.idTokenParsed.preferred_username;
		$rootScope.usuario.nome = auth.authz.idTokenParsed.name.trim() || auth.authz.idTokenParsed.preferred_username;
		$rootScope.$broadcast('carregou-dados-usuario', $rootScope.usuario);
		log.debug('config.js: Usuário logado: ' + $rootScope.usuario.nome);
	}).error(function () {
			alert("failed to login");
	});

}]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

	$routeProvider
	.when('/user', {
		controller: 'userController',
		controllerAs: 'ctrl',
		templateUrl: 'views/user.html'
	})
	.when('/roles', {
		controller: 'rolesController',
		controllerAs: 'ctrl',
		templateUrl: 'views/roles.html'
	})
	.otherwise({
		redirectTo: '/user'
	});

	$locationProvider.html5Mode({
		enabled : false,
		requireBase : false,
		rewriteLinks : true
	});

	$httpProvider.interceptors.push('errorInterceptor');
	$httpProvider.interceptors.push('authInterceptor');
}]);

app.factory('authInterceptor', ['$q', 'logService', function($q, log) {
	return {
		request: function (config) {
			log.debug('config.js: objeto de configuração de request: \n' + JSON.stringify(config, null, "\t"));
			var deferred = $q.defer();
			if (auth && auth.authz && auth.authz.token) {
				auth.authz.updateToken(5).success(function() {
					config.headers = config.headers || {};
					config.headers.Authorization = 'Bearer ' + auth.authz.token;

					deferred.resolve(config);
				}).error(function() {
						deferred.reject('Failed to refresh token');
					});
			}
			return deferred.promise;
		}
	};
}]);

app.factory('errorInterceptor', ['$q', 'logService', function($q, log) {
	return function(promise) {
		return promise.then(function(response) {
			return response;
		}, function(response) {
			if (response.status == 401) {
				log.debug('config.js: erro 401 - session timeout?');
				logout();
			} else if (response.status == 403) {
				alert("config.js: erro 403 - Forbidden");
			} else if (response.status == 404) {
				alert("config.js: erro 404 - Not found");
			} else if (response.status) {
				if (response.data && response.data.errorMessage) {
					alert(response.data.errorMessage);
				} else {
					alert("config.js: An unexpected server error has occurred");
				}
			}
			return $q.reject(response);
		});
	};
}]);
