var _colunasTurma = [
					{data:"id", name:"id"},
					{data:"descricao", name:"descricao"},
					{data:"email", name:"email"},
					{data:"curso_descricao", name:"curso_descricao"},
					{sDefaultContent: obterBotoesAcao()}
				];
var _urlsAjaxTurma= obterUrlsDaControladora("turma");
let _urlsViewTurma= obterUrlsDaView("turma");

function initTurma(){
	$("#body").load(_urlsViewTurma.crud, function() {
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
				columns: _colunasTurma,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarTurma(aData.id);
					});
					$btnRemove.click(function() {
						_removerTurma(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxTurma.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"turma",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarTurma();
		});
	});//Fim do onLoad
};//Fim do init...

function carregarCursos(id){
	fazerRequisicaoAjax("../controladoras/cursoCarregaTodos.php",null,
			function success(data){
				if(!data.erro){
					$('#cursosCombo').empty();
					$('#cursosCombo').append('<OPTION value=0>Escolha uma curso...</option>');
					$.each(data.data,function(indice,curso){
						console.log(indice+ ' : '+curso.descricao);
						if(id==curso.id)
							$('#cursosCombo').append('<OPTION value='+curso.id+' selected=selected>'+curso.descricao+'</option>');
						else
							$('#cursosCombo').append('<OPTION value='+curso.id+'>' +curso.descricao+'</option>');
					});
				}else
					alert(data.mensagem);
			},
			function fail(e){
				exibirMensagensDeErro(e,"curso",'ERRO AO CADASTRAR ',' - SERVER SIDE');
			},
			'GET'
		);
}

function _cadastrarTurma(){
	controle.modal.carregar(_urlsViewTurma.cadastra, "Novo Turma", 
		function(){
			let $botaoEscopo = $(".btn-send");
			carregarCursos(0);
			$botaoEscopo.click( function() {
			if( _validarTurma()>0 ){
				alert('Verifique o preenchimento');
			}
			else{
				controle.modal.fechar();
				let turma = {};
				turma.descricao = $('#descricao').val();
				turma.email = $('#email').val();
				
				let curso = {};
				curso.id = $('#cursosCombo').val();
				curso.descricao = $('#cursosCombo :selected').text();
				turma.curso = curso;
				console.log('turma',turma);

				///////////Req. Ajax Raiz/////////////////
				let xhr = new XMLHttpRequest();
        		let dados = new FormData();
        		let $inputFile = document.querySelector('#horario');
        		dados.append( "horario", $inputFile.files[0] );
        		dados.append( "turma", JSON.stringify(turma));
        		// abre requisição
        		xhr.open( 'POST', _urlsAjaxTurma.cadastra);
				// envia o formulário
				xhr.send( dados );
				// quando estiver pronto
        		xhr.onreadystatechange = function () {
            		if ( this.readyState == 4 && this.status == 200) {
            			let data = this;
            			console.log('Resposta',data);
            			//alert(data.erro);
            			(data.erro==false)?controle.tabela.update():exibirMensagensDeErro(data,"turma",'ERRO AO CADASTRAR ',' - SERVER SIDE');
            		}
        		};

				/*fazerRequisicaoAjax(_urlsAjaxTurma.cadastra, {turma: JSON.stringify(turma)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"turma",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
				*/
			}//fim do else
		});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar

function _removerTurma(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão deste turma?')){
		let turma = {};
		turma.id = id;
		fazerRequisicaoAjax(_urlsAjaxTurma.remove, {turma: JSON.stringify(turma)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"turma",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover

function _alterarTurma(id){
	let turma = {};
	turma.id = id;
	fazerRequisicaoAjax(_urlsAjaxTurma.buscar, {turma: JSON.stringify(turma)}, 
		function success(data){
			if(!data.erro){
				turma = data.data;
				controle.modal.carregar(_urlsViewTurma.edita, "Alterar Turma"
					, function(){
						let $botaoEscopo = $(".btn-send");

						$('#id').val(turma.id);
						$('#descricao').val(turma.descricao);
						$('#email').val(turma.email);
						carregarCursos(turma.curso_id);

						$botaoEscopo.click( function(){
							if ( _validarTurma()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let turma = {};
								turma.id = $('#id').val();
								turma.descricao = $('#descricao').val();
								turma.email = $('#email').val();
								let curso = {};
								curso.id = $('#cursosCombo :selected').val();
								curso.descricao = $('#cursosCombo :selected').text();
								turma.curso = curso;
								///////////Req. Ajax Raiz/////////////////
								let xhr = new XMLHttpRequest();
        						let dados = new FormData();
   								let $inputFile = document.querySelector('#horario');
        						dados.append( "horario", $inputFile.files[0] );
        						dados.append( "turma", JSON.stringify(turma));
        						// abre requisição
        						xhr.open( 'POST', _urlsAjaxTurma.alterar);
								// envia o formulário
								xhr.send( dados );
								// quando estiver pronto
        						xhr.onreadystatechange = function () {
            						if ( this.readyState == 4 && this.status == 200) {
            							let data = this.responseText;
            							console.log('Resposta',data);
            							//alert(data.erro);
            							(data.erro==false)?controle.tabela.update():exibirMensagensDeErro(this,"turma",'ERRO AO ALTERAR ',' - SERVER SIDE');

            						}
            					};
								/*fazerRequisicaoAjax(_urlsAjaxTurma.alterar, {turma: JSON.stringify(turma)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"turma",'ERRO AO ALTERAR ',' - SERVER SIDE');
									},
									'POST'//Método HTTP
								);//Fim de fazerRequisicao
								*/
							}//Fim do else
						});//Fim de botaoEscopo.click
					resetarModalEBotao($botaoEscopo);
				});//Fim de carregar
			}else
				alert(data.mensagem);
		},//Fim de success
		function fail(e){
			exibirMensagensDeErro(e,"turma",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar

function _validarTurma(){
	let erros = 0;
	if ( ($('#descricao').val().length<=0) )
		erros++;
	if ( ($('#email').val().length<=0) )
		erros++;
	if ( ! ($('#cursosCombo').val()>0) )
		erros++;
	return erros;
};
