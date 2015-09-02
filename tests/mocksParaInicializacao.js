angular.module('mocksParaInicializacao', [])
.value('keycloakService', {get: function(){ return {authServerUrl: "qualquerCoisa"}}} )
.value('realmUsers', {data: 'qualquerCoisa'})
.value('authInterceptor', {})
.value('errorInterceptor', {});

