var controle= {
	tabela: undefined,
	modal: undefined
};

function exibirMensagensDeErro(e,objetoModelo, tipoDoErro, ladoDoErro){
	console.clear();
	console.error('---');
	console.error("Erro do Servidor: "+e.responseText);
	let resposta = {};
	resposta = e.responseText;
	alert(tipoDoErro+objetoModelo.toUpperCase()+ladoDoErro);
}

function obterUrlsDaControladora(objetoModelo){
	let objetoUrls = {
			cadastra: "../controladoras/"+objetoModelo+"Cadastra.php",
			remove: "../controladoras/"+objetoModelo+"Remove.php",
			buscar: "../controladoras/"+objetoModelo+"Carrega.php",
			alterar: "../controladoras/"+objetoModelo+"Altera.php",
			carregarDT: "../controladoras/"+objetoModelo+"CarregaTodosDT.php",
			carregar: "../controladoras/"+objetoModelo+"CarregaTodos.php",
			login: "../controladoras/"+objetoModelo+"Login.php",
			logout: "../controladoras/"+objetoModelo+"Logout.php",
	};
	return objetoUrls;
}

function obterUrlsDaView(objetoModelo){
		let objetoUrls = {
			crud: "./"+objetoModelo+"-crud.html",
			edita: "./"+objetoModelo+"-edicao.html",
			cadastra: "./"+objetoModelo+"-cadastro.html",
			login: "./"+objetoModelo+"-login.html",
		}
		return objetoUrls;
}

function fazerRequisicaoAjax(url, data, fnSuccess, fnFail, metodoHttp){
			$.ajax({
				url: url,
				type: metodoHttp,//get , post, put , delete
				dataType: 'json',
				data: data,
				context: document.body
			})
			.done(function(data) {
				fnSuccess.call(this, data);
			})
			.fail(function(e) {
				fnFail.call(this, e);
			})
			.always(function() {
				$(document).trigger('RequisicaoEnviada');
			});
	}

function resetarModalEBotao(botaoEscopo){
	//Verifica se o Modal está fechado
	$(document).on('modalFechado', function(){
		$(this).off('modalFechado');//Tira esse evento do contexto document
		botaoEscopo.off('click');//Tira esse evento do botão
	});
}
				