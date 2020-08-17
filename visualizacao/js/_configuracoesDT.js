function obterBotoesDT(){
	let botoes = [
								/*{
									extend: "copyHtml5",
									text: "Copiar"
								},*/
								{
									extend: "pdfHtml5",
									text: "Pdf"
								}/*,
								{
									extend: "csv",
									text: "Csv"
								}*/
						];
	return botoes;
}

function obterBotoesAcao(){
	let botoes = "<div>"+
		"<button class='btn btn-danger btn-remove btn-acao'><i class='fa fa-trash' aria-hidden='true'></i></button>"+
		"<button class='btn btn-primary btn-altera btn-acao'><i class='fa fa-pencil' aria-hidden='true'></i></button>"+
		"</div>";
	return botoes;					        
}

function obterLinguagemPadrao(){
	let linguagemPadrao = {
							"sEmptyTable": "Nenhum registro encontrado",
							"sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
							"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
							"sInfoFiltered": "(Filtrados de _MAX_ registros)",
							"sInfoPostFix": "",
							"sInfoThousands": ".",
							"sLengthMenu": "Exibir _MENU_ por página",
							"sLoadingRecords": "Carregando...",
							"sProcessing": "Processando...",
							"sZeroRecords": "Nenhum registro encontrado",
							"sSearch": "Pesquisar",
							"oPaginate": {
								"sNext": "Próximo",
								"sPrevious": "Anterior",
								"sFirst": "Primeiro",
								"sLast": "Último"
							},
							"oAria": {
								"sSortAscending": ": Ordenar colunas de forma ascendente",
								"sSortDescending": ": Ordenar colunas de forma descendente"
							}
						};
	return linguagemPadrao;					
}

function obterTamanhoMenu(){
	let tamanho = [
							[10,25,50,100,-1],
							[10,25,50,100,"Todos"]
						];
	return tamanho;					
}

function obterTamanhoMenuMenor(){
	let tamanho = [
							[5,10,25,50,100,-1],
							[5,10,25,50,100,"Todos"]
						];
	return tamanho;					
}

function fazerRequisicaoAjaxDT(urlRequisicao){
	let objetoRequisicao = {
		               		url: urlRequisicao,
		               		error: function (xhr, error, thrown) {
		               			alert('error',error);
		               			alert('ERRO CARREGAR TABELA - SERVER SIDE');
		               			alert('Erro do Servidor: '+xhr.responseText);
		               			console.clear();
		               			console.log('ERRO CARREGAR TABELA - SERVER SIDE');
		               			console.error("Erro do Servidor: "+xhr.responseText);
		               			window.location.href =  "tela-login.html";
							}
	};
	return objetoRequisicao;
}


