var _colunasCidade = [
					{data:"id", name:"id"},
					{data:"descricao", name:"descricao"},
					{sDefaultContent: obterBotoesAcao()}
				];
var _urlsAjaxCidade= obterUrlsDaControladora("cidade");
let _urlViewCidade= obterUrlsDaView("cidade");

function initCidade(){
	$("#body").load(_urlViewCidade.crud, function() {
		// MODAL			
		controle.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',			
				buttons: obterBotoesDT(),
				columns: _colunasCidade,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarCidade(aData.id);
					});
					$btnRemove.click(function() {
						_removerCidade(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxCidade.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"cidade",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarCidade();
		});
	});//Fim do onLoad
};//Fim do init...

function _cadastrarCidade(){
	controle.modal.carregar(_urlViewCidade.cadastra, "Nova Cidade", 
		function(){
			let $botaoEscopo = $(".btn-send");
			$botaoEscopo.click( function() {
			if( _validarCidade()>0 ){
				alert('Verifique o preenchimento');
			}
			else{
				controle.modal.fechar();
				let cidade = {};
				cidade.descricao = $('#descricao').val();
				fazerRequisicaoAjax(_urlsAjaxCidade.cadastra, {cidade: JSON.stringify(cidade)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"cidade",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
			}//fim do else
		});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar
		
function _removerCidade(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão desta Cidade?')){
		let cidade = {};
		cidade.id = id;
		fazerRequisicaoAjax(_urlsAjaxCidade.remove, {cidade: JSON.stringify(cidade)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"cidade",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover
		
function _alterarCidade(id){
	let cidade = {};
	cidade.id = id;
	fazerRequisicaoAjax(_urlsAjaxCidade.buscar, {cidade: JSON.stringify(cidade)}, 
		function success(data){
			if(!data.erro){
				cidade = data.data;
				controle.modal.carregar(_urlViewCidade.edita, "Alterar Cidade"
					, function(){
						let $botaoEscopo = $(".btn-send");

						$('#id').val(cidade.id);
						$('#descricao').val(cidade.descricao);
						$botaoEscopo.click( function(){
							if ( _validarCidade()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let cidade = {};
								cidade.id = id;
								cidade.descricao = $('#descricao').val();
								fazerRequisicaoAjax(_urlsAjaxCidade.alterar, {cidade: JSON.stringify(cidade)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"cidade",'ERRO AO ALTERAR ',' - SERVER SIDE');
									},
									'POST'//Método HTTP
								);//Fim de fazerRequisicao
							}//Fim do else
						});//Fim de botaoEscopo.click
					resetarModalEBotao($botaoEscopo);
				});//Fim de carregar
			}else
				alert(data.mensagem);
		},//Fim de success
		function fail(e){
			exibirMensagensDeErro(e,"cidade",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar
	
function _validarCidade(){
	let erros = 0;
	if ( ($('#descricao').val().length<=0) )
		erros++;
	return erros;
};
