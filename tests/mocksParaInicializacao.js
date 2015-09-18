angular.module('mocksParaInicializacao', [])
.value('keycloakService', {get: function(){ return {authServerUrl: "qualquerCoisa"};}} )
.value('authInterceptor', {})
.value('errorInterceptor', {});

