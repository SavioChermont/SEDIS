var _colunasCurso = [
					{data:"id", name:"id"},
					{data:"descricao", name:"descricao"},
					{data:"ano", name:"ano"},
					{sDefaultContent: obterBotoesAcao()}
				];
var _urlsAjaxCurso= obterUrlsDaControladora("curso");
let _urlViewCurso= obterUrlsDaView("curso");

function initCurso(){
	$("#body").load(_urlViewCurso.crud, function() {
		// MODAL			
		controle.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',				
				buttons: obterBotoesDT(),
				columns: _colunasCurso,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarCurso(aData.id);
					});
					$btnRemove.click(function() {
						_removerCurso(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxCurso.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"curso",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarCurso();
		});
	});//Fim do onLoad
};//Fim do init...

function _cadastrarCurso(){
	controle.modal.carregar(_urlViewCurso.cadastra, "Novo Curso", 
		function(){
			let $botaoEscopo = $(".btn-send");
			$botaoEscopo.click( function() {
			if( _validarCidade()>0 ){
				alert('Verifique o preenchimento');
			}
			else{
				controle.modal.fechar();
				let curso = {};
				curso.descricao = $('#descricao').val();
				curso.ano = $('#ano').val();
				fazerRequisicaoAjax(_urlsAjaxCurso.cadastra, {curso: JSON.stringify(curso)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"curso",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
			}//fim do else
		});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar
		
function _removerCurso(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão deste Curso?')){
		let curso = {};
		curso.id = id;
		fazerRequisicaoAjax(_urlsAjaxCurso.remove, {curso: JSON.stringify(curso)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"curso",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover
		
function _alterarCurso(id){
	let curso = {};
	curso.id = id;
	fazerRequisicaoAjax(_urlsAjaxCurso.buscar, {curso: JSON.stringify(curso)}, 
		function success(data){
			if(!data.erro){
				curso = data.data;
				controle.modal.carregar(_urlViewCurso.edita, "Alterar Curso"
					, function(){
						let $botaoEscopo = $(".btn-send");

						$('#id').val(curso.id);
						$('#descricao').val(curso.descricao);
						$('#ano').val(curso.ano);
						$botaoEscopo.click( function(){
							if ( _validarCurso()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let curso = {};
								curso.id = id;
								curso.descricao = $('#descricao').val();
								curso.ano = $('#ano').val();
								fazerRequisicaoAjax(_urlsAjaxCurso.alterar, {curso: JSON.stringify(curso)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"curso",'ERRO AO ALTERAR ',' - SERVER SIDE');
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
			exibirMensagensDeErro(e,"curso",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar
	
function _validarCurso(){
	let erros = 0;
	if ( ($('#descricao').val().length<=0) )
		erros++;
	return erros;
};
