/* globals angular, Keycloak, keycloak, location, alert, window, document */
var auth = {};
var logout = function () {
	auth.loggedIn = false;
	auth.authz.logout();
	auth.authz = null;
};

angular
	.module('usermgt-app', ['ui.bootstrap', 'ngRoute', 'ngStorage', 'ngLodash'])
	.config(configuration)
	.run(initialization)
	.factory('reqResInterceptor', reqResInterceptor)
	.service('keycloakService', keycloakService)
	.service('logService', logService);

configuration.$inject = ['$locationProvider', '$httpProvider'];

function configuration($locationProvider, $httpProvider) {
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false,
		rewriteLinks: true
	});
	$httpProvider.interceptors.push('reqResInterceptor');
}

initialization.$inject = ['$rootScope', '$location', 'logService', 'keycloakService', '$document'];

function initialization($rootScope, $location, logService, keycloakService, $document) {
	logService.debug('config.js: Inicializando a página');
	var keycloakAuth = new Keycloak('keycloak.json');
	auth.loggedIn = false;
	keycloakAuth.init({
		onLoad: 'login-required'
	}).success(function () {
		auth.loggedIn = true;
		auth.authz = keycloakAuth;
		keycloakService.set(keycloakAuth);
		var redirectPath = $location.protocol() + ":" + $location.host() + ":" + $location.port() + "/index.html";
		auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/" + keycloakAuth.realm + "/tokens/logout?redirect_uri=" + redirectPath;
		$rootScope.usuario = {};
		$rootScope.usuario.login = auth.authz.idTokenParsed.preferred_username;
		$rootScope.usuario.nome = auth.authz.idTokenParsed.name.trim() || auth.authz.idTokenParsed.preferred_username;
		$rootScope.$broadcast('carregou-dados-usuario', $rootScope.usuario);
		logService.debug('config.js: Usuário logado: ' + $rootScope.usuario.nome);
	}).error(function () {
		alert("failed to login");
	});
	$document.ready(function () {
		console.log('dentro do .run');
	});
}


reqResInterceptor.$inject = ['$q', '$location', 'logService'];
function reqResInterceptor($q, $location, logService) {
	return {
		request: function (config) {
			logService.debug('config.js - requestInterceptor', config);
			var deferred = $q.defer();
			if (auth && auth.authz && auth.authz.token) {
				auth.authz.updateToken(5).success(function () {
					config.headers = config.headers || {};
					config.headers.Authorization = 'Bearer ' + auth.authz.token;
					deferred.resolve(config);
				}).error(function () {
					deferred.reject('Failed to refresh token');
				});
			}
			return deferred.promise;
		},
		requestError: function (rejection) {
			logService.debug('config.js - requestErrorInterceptor', rejection);
			return $q.reject(rejection);
		},
		response: function (response) {
			logService.debug('config.js - responseInterceptor', response);
			return response || $q.when(response);
		},
		responseError: function (rejection) {
			logService.debug('config.js - responseErrorInterceptor', rejection);
			if (rejection.status == 0){
				window.location = $location.protocol()+"://" + $location.host() + ":" + $location.port() + "/";
			}
			return $q.reject(rejection);
		}
	};
};

keycloakService.$inject = ['$localStorage'];

function keycloakService($localStorage) {
	this.set = function (keycloakObject) {
		$localStorage.keycloakObject = keycloakObject;
	};
	this.get = function () {
		return $localStorage.keycloakObject;
	};
	this.reset = function () {
		delete $localStorage.keycloakObject;
	};
}

logService.$inject = ['$log'];

function logService($log) {
	this.debug = function (msg, obj) {
		obj = null;
		$log.debug(msg + (obj ? ':\n' + JSON.stringify(obj, null, '') : ''));
	};
	this.info = function (msg, obj) {
		$log.info(msg + (obj ? ':\n' + JSON.stringify(obj, null, '\t') : ''));
	};
	this.error = function (msg, obj) {
		$log.error(msg + (obj ? ':\n' + JSON.stringify(obj, null, '\t') : ''));
	};
	this.warn = function (msg, obj) {
		$log.warn(msg + (obj ? ':\n' + JSON.stringify(obj, null, '\t') : ''));
	};
}
