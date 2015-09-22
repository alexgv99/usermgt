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
	.factory('authInterceptor', authInterceptor)
	.factory('errorInterceptor', errorInterceptor)
	.service('keycloakService', keycloakService)
	.service('selectedUserService', selectedUserService)
	.service('realmService', realmService)
	.service('clientService', clientService)
	.service('logService', logService)
	.value('debugConfig', false)
	.value('debugServices', false)
	.value('debugControllers', false);

configuration.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

function configuration($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider
		.when('/user', {
			controller: 'Users',
			controllerAs: 'users',
			templateUrl: 'views/user.html'
		})
		.when('/role/:id', {
			controller: 'Roles',
			controllerAs: 'ctrl',
			templateUrl: 'views/role.html',
			resolve: {
				user: function (httpService, $route) {
					var params = {
						id: $route.current.params.id
					};
					return httpService.loadUser(params);
				},
				realmRoles: function (httpService) {
					return httpService.obtainRealmRoles();
				},
				clientRoles: function (httpService) {
					return httpService.obtainClientRoles();
				}
			}
		})
		.otherwise({
			redirectTo: '/user'
		});
	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false,
		rewriteLinks: true
	});
	$httpProvider.interceptors.push('errorInterceptor');
	$httpProvider.interceptors.push('authInterceptor');
}

initialization.$inject = ['$rootScope', '$location', 'logService', 'keycloakService', 'debugConfig'];

function initialization($rootScope, $location, logService, keycloakService, debugConfig) {
	if (debugConfig) logService.debug('config.js: Inicializando a página');
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
		if (debugConfig) logService.debug('config.js: Usuário logado: ' + $rootScope.usuario.nome);
	}).error(function () {
		alert("failed to login");
	});
}

authInterceptor.$inject = ['$q', 'logService', 'debugConfig'];

function authInterceptor($q, log, debugConfig) {
	return {
		request: function (config) {
			if (debugConfig) log.debug('config.js: objeto de configuração de request: \n' + JSON.stringify(config, null, "\t"));
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
		}
	};
}

errorInterceptor.$inject = ['$q', 'logService', 'debugConfig'];

function errorInterceptor($q, logService, debugConfig) {
	return function (promise) {
		return promise.then(function (response) {
			return response;
		}, function (response) {
			if (response.status == 401) {
				if (debugConfig) logService.debug('config.js: erro 401 - session timeout?');
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
}

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

selectedUserService.$inject = ['$localStorage'];

function selectedUserService($localStorage) {
	this.set = function (selectedUser) {
		$localStorage.selectedUser = selectedUser;
	};
	this.get = function () {
		return $localStorage.selectedUser;
	};
	this.reset = function () {
		delete $localStorage.selectedUser;
	};
}

realmService.$inject = ['$localStorage'];

function realmService($localStorage) {
	this.set = function (realm) {
		$localStorage.realm = realm;
	};
	this.get = function () {
		return $localStorage.realm;
	};
	this.reset = function () {
		delete $localStorage.realm;
	};
}

clientService.$inject = ['$localStorage'];

function clientService($localStorage) {
	this.set = function (client) {
		$localStorage.client = client;
	};
	this.get = function () {
		return $localStorage.client;
	};
	this.reset = function () {
		delete $localStorage.client;
	};
}

logService.$inject = ['$log'];

function logService($log) {
	this.debug = function (msg) {
		$log.debug(msg);
	};
	this.info = function (msg) {
		$log.info(msg);
	};
	this.error = function (msg) {
		$log.error(msg);
	};
	this.warn = function (msg) {
		$log.warn(msg);
	};
}
