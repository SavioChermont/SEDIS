var _urlsAjaxUsuario= obterUrlsDaControladora("usuario");

let $botaoEscopo = $("#Blogin");
	$botaoEscopo.click( function() {
	if( _validarLogin()>0 ){
		alert('Verifique o preenchimento');
	}else{
			let dadosLogin = {};
			dadosLogin.login = $('#login').val();
			dadosLogin.senha = $('#senha').val();
			localStorage.removeItem('identificacao');
			localStorage.removeItem('nome');
			fazerRequisicaoAjax(_urlsAjaxUsuario.login, {dadosLogin: JSON.stringify(dadosLogin)}, 
				function success(data){
					console.log(data);
					if(data.mensagem=="Sessao Criada com sucesso"){
							let usuario = {};
							usuario = data.data;
							console.log(usuario);
							localStorage.setItem('identificacao',usuario.id);
							localStorage.setItem('nome',usuario.nome);
							//alert('vai redirecionar')
							window.location.href = "index.html";
					}else{
						alert("Dados incorretos");
					}
				}, 
				function fail(e){
					exibirMensagensDeErro(e,'DADOS LOGIN ','ERRO AO LOGAR ',' - SERVER SIDE');
				},
				'POST'//Método HTTP
			);//Fim de fazerRequisicao
		}//fim do else
});//Fim da function passada como argumento em carregar

function _validarLogin(){
	let erros = 0;
	if ( ($('#login').val().length<=0) )
		erros++;
	if ( ($('#senha').val().length<=0) )
		erros++;
	return erros;
}