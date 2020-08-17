var _colunasDisciplina = [
					{data:"id", name:"id"},
					{data:"descricao", name:"descricao"},
					{data:"curso_descricao", name:"curso_descricao"},
					{sDefaultContent: obterBotoesAcao()}
				];
var _urlsAjaxDisciplina= obterUrlsDaControladora("disciplina");
let _urlsViewDisciplina= obterUrlsDaView("disciplina");

function initDisciplina(){
	$("#body").load(_urlsViewDisciplina.crud, function() {
		// MODAL			
		controle.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',
				//select: true,				
				buttons: obterBotoesDT(),
				columns: _colunasDisciplina,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarDisciplina(aData.id);
					});
					$btnRemove.click(function() {
						_removerDisciplina(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxDisciplina.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"disciplina",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarDisciplina();
		});
	});//Fim do onLoad
};//Fim do init...

function carregarCursos(id){
	fazerRequisicaoAjax("../controladoras/cursoCarregaTodos.php",null,
			function success(data){
				if(!data.erro){
					$('#cursosCombo').empty();
					$('#cursosCombo').append('<OPTION value=0>Escolha uma cursos...</option>');
					$.each(data.data,function(indice,cursos){
						console.log(indice+ ' : '+cursos.descricao);
						if(id==cursos.id)
							$('#cursosCombo').append('<OPTION value='+cursos.id+' selected=selected>'+cursos.descricao+'</option>');
						else
							$('#cursosCombo').append('<OPTION value='+cursos.id+'>' +cursos.descricao+'</option>');
					});
				}else
					alert(data.mensagem);
			},
			function fail(e){
				exibirMensagensDeErro(e,"cursos",'ERRO AO CADASTRAR ',' - SERVER SIDE');
			},
			'GET'
		);
}

function _cadastrarDisciplina(){
	controle.modal.carregar(_urlsViewDisciplina.cadastra, "Novo Disciplina", 
		function(){
			let $botaoEscopo = $(".btn-send");
			carregarCursos(0);
			$botaoEscopo.click( function() {
			if( _validarDisciplina()>0 ){
				alert('Verifique o preenchimento');
			}
			else{
				controle.modal.fechar();
				let disciplina = {};
				disciplina.descricao = $('#descricao').val();
				
				let curso = {};
				curso.id = $('#cursosCombo').val();
				curso.descricao = $('#cursosCombo :selected').text();
				disciplina.curso = curso;
				console.log('disciplina',disciplina);

				fazerRequisicaoAjax(_urlsAjaxDisciplina.cadastra, {disciplina: JSON.stringify(disciplina)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"disciplina",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
			}//fim do else
		});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar

function _removerDisciplina(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão deste disciplina?')){
		let disciplina = {};
		disciplina.id = id;
		fazerRequisicaoAjax(_urlsAjaxDisciplina.remove, {disciplina: JSON.stringify(disciplina)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"disciplina",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover

function _alterarDisciplina(id){
	let disciplina = {};
	disciplina.id = id;
	fazerRequisicaoAjax(_urlsAjaxDisciplina.buscar, {disciplina: JSON.stringify(disciplina)}, 
		function success(data){
			if(!data.erro){
				disciplina = data.data;
				controle.modal.carregar(_urlsViewDisciplina.edita, "Alterar Disciplina"
					, function(){
						let $botaoEscopo = $(".btn-send");

						$('#id').val(disciplina.id);
						$('#descricao').val(disciplina.descricao);
						carregarCursos(disciplina.curso_id);

						$botaoEscopo.click( function(){
							if ( _validarDisciplina()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let disciplina = {};
								disciplina.id = $('#id').val();
								disciplina.descricao = $('#descricao').val();
								let curso = {};
								curso.id = $('#cursosCombo :selected').val();
								curso.descricao = $('#cursosCombo :selected').text();
								disciplina.curso = curso;
								fazerRequisicaoAjax(_urlsAjaxDisciplina.alterar, {disciplina: JSON.stringify(disciplina)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"disciplina",'ERRO AO ALTERAR ',' - SERVER SIDE');
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
			exibirMensagensDeErro(e,"disciplina",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar

function _validarDisciplina(){
	let erros = 0;
	if ( ($('#descricao').val().length<=0) )
		erros++;
	if ( ! ($('#cursosCombo').val()>0) )
		erros++;
	return erros;
};