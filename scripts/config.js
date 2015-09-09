/* globals angular, Keycloak, keycloak, location, console, alert, window, document */
var app = angular.module('usermgt-app', ['ui.bootstrap', 'ngRoute', 'ngStorage']);

var auth = {};
var logout = function(){
	console.log('*** LOGOUT');
	auth.loggedIn = false;
	auth.authz = null;
	window.location = auth.logoutUrl;
};

app.run(['$rootScope', 'keycloakService', function ($rootScope, keycloakService) {
	console.log("*** here");
	var keycloakAuth = new Keycloak('keycloak.json');
	auth.loggedIn = false;
	keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
		console.log('here login');
		auth.loggedIn = true;
		auth.authz = keycloakAuth;
		keycloakService.set(keycloakAuth);
		auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/" + keycloakAuth.realm + "/tokens/logout?redirect_uri=http://localhost:8080";
		$rootScope.usuario = {};
		$rootScope.usuario.login = auth.authz.idTokenParsed.preferred_username;
		$rootScope.usuario.nome = auth.authz.idTokenParsed.name.trim() || auth.authz.idTokenParsed.preferred_username;
		$rootScope.$broadcast('carregou-dados-usuario', $rootScope.usuario);
//		angular.bootstrap(document, ["product"]);
	}).error(function () {
			alert("failed to login");
	});

}]);

app.service('keycloakService', ['$localStorage', function($localStorage) {
	this.set = function(obj) {
		$localStorage.keycloakObject = obj;
	};
	this.get = function() {
		return $localStorage.keycloakObject;
	};
	this.reset = function() {
		delete $localStorage.keycloakObject;
	};
}]);

app.service('selectedUserService', ['$localStorage', function($localStorage) {
	this.set = function(obj) {
		$localStorage.selectedUser = obj;
	};
	this.get = function() {
		return $localStorage.selectedUser;
	};
	this.reset = function() {
		delete $localStorage.selectedUser;
	};
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

app.factory('authInterceptor', function($q) {
	return {
		request: function (config) {
//			console.log(JSON.stringify(config, null, "\t"));
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
});

app.factory('errorInterceptor', function($q) {
	return function(promise) {
		return promise.then(function(response) {
			return response;
		}, function(response) {
			if (response.status == 401) {
				console.log('session timeout?');
				logout();
			} else if (response.status == 403) {
				alert("Forbidden");
			} else if (response.status == 404) {
				alert("Not found");
			} else if (response.status) {
				if (response.data && response.data.errorMessage) {
					alert(response.data.errorMessage);
				} else {
					alert("An unexpected server error has occurred");
				}
			}
			return $q.reject(response);
		});
	};
});
