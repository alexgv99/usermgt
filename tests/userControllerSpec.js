describe('Testes para o userController', function() {
	var userController, logService, httpService, realmUsers, $q;

	beforeEach(module('usermgt-app'));
	beforeEach(module('mocksParaInicializacao'));
	
	beforeEach(inject(function($controller, _logService_, _httpService_, _realmUsers_, _$q_) {
		logService = _logService_;
		httpService = _httpService_;
		realmUsers = _realmUsers_;
		$q = _$q_;
		userController = $controller('userController');		
	}));

	describe('Controller é inicializado ...', function() {
		it('com valores default', function() {
			expect(userController.users.length).toBe(0);
			expect(userController.realmUsers).toBe('qualquerCoisa');
			expect(userController.pesquisa.nome).toBe('');
		});
	});
});