let _colunasOcorrencia = [
					{data:"id", name:"id"},
					{data:"data_ocorrenciaBR", name:"data"},
					{data:"aluno_nome", name:"aluno"},
					{data:"descricao", name:"descricao"},
					{data:"usuario_nome", name:"usuario"},
					{sDefaultContent: obterBotoesAcao()}
				];
let _urlsAjaxOcorrencia= obterUrlsDaControladora("ocorrencia");
let _urlViewOcorrencia= obterUrlsDaView("ocorrencia");
let alunosOcorrencia= [];

function initOcorrencia(){
	carregarAlunosOcorrencia();
	console.log(alunosOcorrencia);
	$("#body").load(_urlViewOcorrencia.crud, function() {
		// MODAL			
		controle.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',			
				buttons: obterBotoesDT(),
				columns: _colunasOcorrencia,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarOcorrencia(aData.id);
					});
					$btnRemove.click(function() {
						_removerOcorrencia(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxOcorrencia.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"ocorrencia",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarOcorrencia();
		});
	});//Fim do onLoad
};//Fim do init...

function carregarAlunosOcorrencia(id){
	fazerRequisicaoAjax("../controladoras/alunoCarregaTodos.php", null, 
					function success(data){
						if(!data.erro){
							console.log(data.data);
							$('#alunosCombo').empty();
							$('#alunosCombo').append('<OPTION value=0>Escolha um alunoe...</option>');
							$.each(data.data, function(indice,aluno){
								console.log(indice+' : '+aluno.nome);
								if(id == aluno.id)
									$('#alunosCombo').append('<OPTION value='+aluno.id+' selected=selected>'+aluno.nome+'</option>');
								else
									$('#alunosCombo').append('<OPTION value='+aluno.id+'>'+aluno.nome+'</option>');
							});
						}else
							alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"alunos ocorrencia",'ERRO AO CARREGAR ',' - SERVER SIDE');
					},
					'GET'//Método HTTP
	);//Fim de fazerRequisicao
}

function _cadastrarOcorrencia(){
	controle.modal.carregar(_urlViewOcorrencia.cadastra, "Nova Ocorrência",
		function(){		
			let $botaoEscopo = $(".btn-send");
			carregarAlunosOcorrencia(0);
			let dNow = new Date();
  			var localdate = dNow.getFullYear() + '-' + (dNow.getMonth()+1) + '-' + dNow.getDate();
			$('#dia').val(localdate);
			//console.log(dNow);
			$botaoEscopo.click( function() {
				if( _validarOcorrencia()>0 ){
					alert('Verifique o preenchimento');
				}
				else{
					controle.modal.fechar();
					let usuario = {};
					usuario.id = localStorage.getItem('identificacao');
					usuario.nome = localStorage.getItem('nome');
					let ocorrencia = {};
					ocorrencia.descricao = $('#descricao').val();
					ocorrencia.dataOcorrencia = $('#dia').val();
					ocorrencia.usuario = usuario;
					//Pegar aluno
					let aluno = {};
					aluno.id = $('#alunosCombo :selected').val();
					aluno.nome = $('#alunosCombo :selected').text();
					ocorrencia.aluno=aluno;
					
					console.log(ocorrencia);
					
					fazerRequisicaoAjax(_urlsAjaxOcorrencia.cadastra, {ocorrencia: JSON.stringify(ocorrencia)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"ocorrencia",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
				}//fim do else
			});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar

function _alterarOcorrencia(id){
	let ocorrencia = {};
	ocorrencia.id = id;
	fazerRequisicaoAjax(_urlsAjaxOcorrencia.buscar, {ocorrencia: JSON.stringify(ocorrencia)}, 
		function success(data){
			if(!data.erro){
				ocorrencia = data.data;
				controle.modal.carregar(_urlViewOcorrencia.edita, "Alterar Ocorrencia"
					, function(){
						let $botaoEscopo = $(".btn-send");
						//$('#id').val(ocorrencia.id);
						$('#descricao').val(ocorrencia.descricao);
						$('#dia').val(ocorrencia.data_ocorrencia);
						carregarAlunosOcorrencia(ocorrencia.aluno_id); //Preencher o <select> de cidades
						$botaoEscopo.click( function(){
							if ( _validarOcorrencia()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let usuario = {};
								usuario.id = localStorage.getItem('identificacao');
								usuario.nome = localStorage.getItem('nome');
								let ocorrencia = {};
								ocorrencia.id=id;
								ocorrencia.descricao = $('#descricao').val();
								ocorrencia.dataOcorrencia = $('#dia').val();
								ocorrencia.usuario = usuario;
								//Pegar aluno
								let aluno = {};
								aluno.id = $('#alunosCombo :selected').val();
								aluno.nome = $('#alunosCombo :selected').text();
								ocorrencia.aluno=aluno;
					
								console.log(ocorrencia);
								fazerRequisicaoAjax(_urlsAjaxOcorrencia.alterar, {ocorrencia: JSON.stringify(ocorrencia)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"ocorrência",'ERRO AO ALTERAR ',' - SERVER SIDE');
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
			exibirMensagensDeErro(e,"ocorrência",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar


function _removerOcorrencia(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão desta ocorrência?')){
		let ocorrencia = {};
		ocorrencia.id = id;
		fazerRequisicaoAjax(_urlsAjaxOcorrencia.remove, {ocorrencia: JSON.stringify(ocorrencia)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"ocorrência",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover


function _validarOcorrencia(){
	let erros = 0;
	
	return erros;
};