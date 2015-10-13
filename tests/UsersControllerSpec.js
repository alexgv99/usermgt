describe('Testes para o userController', function() {
	var userController, logService, httpService, $q, $rootScope, $httpBackend;

	beforeEach(module('usermgt-app'));
	beforeEach(module('mocksParaInicializacao'));

	beforeEach(inject(function($controller, _logService_, _httpService_, _$q_, _$rootScope_, _$httpBackend_) {
		logService = _logService_;
		httpService = _httpService_;
		$q = _$q_;
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		userController = $controller('Users', {$scope: $rootScope.$new(true)});
	}));

	describe('Controller é inicializado ...', function() {
		it('com valores default', function() {
			expect(userController.users.length).toBe(0);
			expect(userController.realmRoles.length).toBe(0);
			expect(userController.pesquisa.nome).toBe('');
		});
	});

	describe('searchUsers ...', function() {
		it('deve carregar lista de usuários na variável users e logar quando chamada a httpService.searchUser() é finalizada com sucesso', function() {
			var deferred = $q.defer();
			deferred.resolve({data: 'listaDeUsuarios'});
			spyOn(httpService, 'searchUser').and.returnValue(deferred.promise);
			$httpBackend.whenGET("views/user.html").respond();

			userController.searchUsers();

			$rootScope.$apply();
			expect(userController.users).toBe('listaDeUsuarios');
			expect(httpService.searchUser).toHaveBeenCalledWith(userController.pesquisa);
		});

		it('nao deve alterar userController.users quando chamada a httpService.searchUser() falha', function() {
			var deferred = $q.defer();
			deferred.reject();
			spyOn(httpService, 'searchUser').and.returnValue(deferred.promise);
			spyOn(logService, 'debug');
			$httpBackend.whenGET("views/user.html").respond();

			userController.searchUsers();

			$rootScope.$apply();
			expect(userController.users.length).toBe(0);
			expect(logService.debug).not.toHaveBeenCalled();
		});
	});

});
