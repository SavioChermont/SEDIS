let _colunasBairro = [
					{data:"id", name:"id"},
					{data:"descricao", name:"descricao"},
					{data:"cidade_descricao", name:"cidade_descricao"},
					{sDefaultContent: obterBotoesAcao()}
				];
let _urlsAjaxBairro= obterUrlsDaControladora("bairro");
let _urlViewBairro= obterUrlsDaView("bairro");

function initBairro(){
	$("#body").load(_urlViewBairro.crud, function() {
		// MODAL			
		controle.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',			
				buttons: obterBotoesDT(),
				columns: _colunasBairro,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarBairro(aData.id);
					});
					$btnRemove.click(function() {
						_removerBairro(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxBairro.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"cidade",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarBairro();
		});

	});//Fim do onLoad
};//Fim do init...

function carregarCidades(id){
	fazerRequisicaoAjax("../controladoras/cidadeCarregaTodos.php", null, 
					function success(data){
						if(!data.erro){
							console.log(data.data);
							//Preenche Combo de Cidades
							$('#cidadesCombo').empty();
							$('#cidadesCombo').append('<OPTION value=0>Escolha uma cidade...</option>');
							$.each(data.data, function(indice,cidade){
								console.log(indice+' : '+cidade.descricao);
								if(id == cidade.id)
									$('#cidadesCombo').append('<OPTION value='+cidade.id+' selected=selected>'+cidade.descricao+'</option>');
								else
									$('#cidadesCombo').append('<OPTION value='+cidade.id+'>'+cidade.descricao+'</option>');
							});
						}else
							alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"cidade",'ERRO AO CARREGAR ',' - SERVER SIDE');
					},
					'GET'//Método HTTP
	);//Fim de fazerRequisicao
}

function _cadastrarBairro(){
	controle.modal.carregar(_urlViewBairro.cadastra, "Novo Bairro", 
		function(){		
			let $botaoEscopo = $(".btn-send");
			carregarCidades(0); //Preencher o <select> de cidades
			$botaoEscopo.click( function() {
			if( _validarBairro()>0 ){
				alert('Verifique o preenchimento');
			}
			else{
				controle.modal.fechar();
				let bairro = {};
				bairro.descricao = $('#descricao').val();
				//Busca a cidade
				let cidade = {}
				cidade.id = $('#cidadesCombo').val();
				cidade.descricao = $('#cidadesCombo :selected').text();
				bairro.cidade = cidade;
				console.log('bairro',bairro);
				fazerRequisicaoAjax(_urlsAjaxBairro.cadastra, {bairro: JSON.stringify(bairro)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"bairro",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
			}//fim do else
		});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar


function _removerBairro(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão deste bairro?')){
		let bairro = {};
		bairro.id = id;
		fazerRequisicaoAjax(_urlsAjaxBairro.remove, {bairro: JSON.stringify(bairro)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"bairro",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover
		
function _alterarBairro(id){
	let bairro = {};
	bairro.id = id;
	fazerRequisicaoAjax(_urlsAjaxBairro.buscar, {bairro: JSON.stringify(bairro)}, 
		function success(data){
			if(!data.erro){
				bairro = data.data;
				controle.modal.carregar(_urlViewBairro.edita, "Alterar Bairro"
					, function(){
						let $botaoEscopo = $(".btn-send");
						$('#id').val(bairro.id);
						$('#descricao').val(bairro.descricao);
						carregarCidades(bairro.cidade_id); //Preencher o <select> de cidades
						$botaoEscopo.click( function(){
							if ( _validarBairro()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let bairro = {};
								bairro.id = id;
								bairro.descricao = $('#descricao').val();
								let cidade = {}
								cidade.id = $('#cidadesCombo :selected').val();
								cidade.descricao = $('#cidadesCombo :selected').text();
								bairro.cidade = cidade;
								fazerRequisicaoAjax(_urlsAjaxBairro.alterar, {bairro: JSON.stringify(bairro)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"bairro",'ERRO AO ALTERAR ',' - SERVER SIDE');
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
			exibirMensagensDeErro(e,"bairro",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar
	
function _validarBairro(){
	let erros = 0;
	if ( ($('#descricao').val().length<=0) )
		erros++;
	if ( ! ($('#cidadesCombo').val()>0) )
		erros++;
	return erros;
};
