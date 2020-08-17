var _urlsAjaxUsuario= obterUrlsDaControladora("usuario");

let $botaoEscopo = $("#btn-logout");
	$botaoEscopo.click( function() {
	if (confirm("Deseja mesmo sair?")){
			let cookie = {}
			cookie.id = document.cookie;
			
			fazerRequisicaoAjax(_urlsAjaxUsuario.logout, {cookie: JSON.stringify(cookie)}, 
				function success(data){
					localStorage.removeItem('identificacao');
					localStorage.removeItem('nome');
					window.location.href = "tela-login.html";
				}, 
					function fail(e){
					exibirMensagensDeErro(e,'Erro ao encerrar sessão',' - SERVER SIDE');
				},
				'POST'//Método HTTP
			);//Fim de fazerRequisicao
	}
});








