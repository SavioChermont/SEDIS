var _colunasProfessor = [
					{data:"id", name:"id"},
					{data:"nome", name:"nome"},
					{data:"siape", name:"siape"},
					{data:"email", name:"email"},
					{sDefaultContent: obterBotoesAcao()}
				];
var _urlsAjaxProfessor= obterUrlsDaControladora("professor");
let _urlsViewProfessor= obterUrlsDaView("professor");

function initProfessor(){
	$("#body").load(_urlsViewProfessor.crud, function() {
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
				columns: _colunasProfessor,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarProfessor(aData.id);
					});
					$btnRemove.click(function() {
						_removerProfessor(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxProfessor.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"professor",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarProfessor();
		});
	});//Fim do onLoad
};//Fim do init...

function _cadastrarProfessor(){
	controle.modal.carregar(_urlsViewProfessor.cadastra, "Novo Professor", 
		function(){
			let $botaoEscopo = $(".btn-send");
			///MONTA A TABELA DE TELEFONES (30/09)
			let $formCad = document.querySelector('form');
			let $btnAdd = document.querySelector('#btn-add');
			let $corpoTabela = document.querySelector('#corpoTelefones');
			$btnAdd.addEventListener('click', function(event){
				console.log('clicou');
				event.preventDefault();
				adicionaTelefone($formCad, $corpoTabela);
			})

			$corpoTabela.addEventListener('dblclick', function(event){
				console.log('clicou 2 vezes');
				event.preventDefault();
				$alvo = event.target;
				$trASerRemovida = $alvo.parentNode;
				if(confirm('Deseja remover o telefone clicado?'))
					$trASerRemovida.remove();
			})
			///FIM DA MONTAGEM DA TABELA DE TELEFONES
			$botaoEscopo.click( function() {
			if( _validarProfessor()>0 ){
				alert('Verifique o preenchimento');
			}
			else{
				controle.modal.fechar();
				let professor = {};
				professor.nome = $('#nome').val();
				professor.siape = $('#siape').val();
				professor.email = $('#email').val();
				//RECUPERA OS TELEFONES DA TABELA (30/09)
				let telefones = recuperaTelefones($corpoTabela);
				professor.telefones = telefones;	
				//FIM DE RECUPERA OS TELEFONES DA TABELA
				fazerRequisicaoAjax(_urlsAjaxProfessor.cadastra, {professor: JSON.stringify(professor)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"professor",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
			}//fim do else
		});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar
		
function _removerProfessor(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão deste professor?')){
		let professor = {};
		professor.id = id;
		fazerRequisicaoAjax(_urlsAjaxProfessor.remove, {professor: JSON.stringify(professor)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"professor",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover
		
function _alterarProfessor(id){
	let professor = {};
	professor.id = id;
	fazerRequisicaoAjax(_urlsAjaxProfessor.buscar, {professor: JSON.stringify(professor)}, 
		function success(data){
			if(!data.erro){
				professor = data.data;
				controle.modal.carregar(_urlsViewProfessor.edita, "Alterar Professor"
					, function(){
						let $botaoEscopo = $(".btn-send");

						$('#id').val(professor.id);
						$('#nome').val(professor.nome);
						$('#siape').val(professor.siape);
						$('#email').val(professor.email);
						//SÓ AO CARREGAR
						///MONTA A TABELA DE TELEFONES (27/10)
						let $formCad = document.querySelector('form');
						let $btnAdd = document.querySelector('#btn-add');
						let $corpoTabela = document.querySelector('#corpoTelefones');
						adicionaTelefones(professor.telefones, $corpoTabela);
						///
						$btnAdd.addEventListener('click', function(event){
							console.log('clicou');
							event.preventDefault();
							adicionaTelefone($formCad, $corpoTabela);
						});

						$corpoTabela.addEventListener('dblclick', function(event){
							console.log('clicou 2 vezes');
							event.preventDefault();
							$alvo = event.target;
							$trASerRemovida = $alvo.parentNode;
							if(confirm('Deseja remover o telefone clicado?'))
								$trASerRemovida.remove();
						})
						///FIM DA MONTAGEM DA TABELA DE TELEFONES
						$botaoEscopo.click( function(){
							if ( _validarProfessor()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let professor = {};
								professor.id = $('#id').val();
								professor.nome = $('#nome').val();
								professor.siape = $('#siape').val();
								professor.email = $('#email').val();
								//RECUPERA OS TELEFONES DA TABELA (27/10)
								let telefones = recuperaTelefones($corpoTabela);
								professor.telefones = telefones;	
								//FIM DE RECUPERA OS TELEFONES DA TABELA
								fazerRequisicaoAjax(_urlsAjaxProfessor.alterar, {professor: JSON.stringify(professor)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"professor",'ERRO AO ALTERAR ',' - SERVER SIDE');
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
			exibirMensagensDeErro(e,"professor",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar
	
function _validarProfessor(){
	let erros = 0;
	if ( ($('#nome').val().length<=0) 
		|| ($('#siape').val().length<=0) 
		|| ($('#email').val().length<=0) )
		erros++;
	return erros;
};

//Funções criadas em 27/10
function adicionaTelefone(form, corpoTabela){
	let $tds = [];
	$tds.push(retornaTd(form.ddd.value));
	$tds.push(retornaTd(form.telefone.value));
	corpoTabela.appendChild(montaERetornaTr($tds));
}

function retornaTd(valor){
	let $td = document.createElement('td');
	$td.textContent = valor;
	return $td;
}

function montaERetornaTr(tds){
	console.log(tds);
	let $tr = document.createElement('tr');
	for(let i = 0; i<tds.length ; i++ )
		$tr.appendChild(tds[i]);
	return $tr;
}

function recuperaTelefones(corpoTabela){
	let telefones = [];
	let $trsTabela = corpoTabela.querySelectorAll('tr');
	for(let i=0 ; i<$trsTabela.length ; i++){
		let $tds = $trsTabela[i].querySelectorAll('td');
		let telefone = {
			'ddd':$tds[0].textContent,
			'telefone':$tds[1].textContent
		}
		telefones.push(telefone);
	}
	return telefones;
}

function adicionaTelefones(telefones, corpoTabela){
	let $tds = [];
	for(let i=0 ; i<telefones.length ; i++){
		let $tr = document.createElement('tr');
		$tr.appendChild(retornaTd(telefones[i].ddd));
		$tr.appendChild(retornaTd(telefones[i].telefone));
		corpoTabela.appendChild($tr);
	}
}
