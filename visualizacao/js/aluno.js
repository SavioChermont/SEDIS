let _colunasAluno = [
					{data:"id", name:"id"},
					{data:"matricula", name:"matricula"},
					{data:"nome", name:"nome"},
					{data:"email", name:"email"},
					//{data:"bairro_descricao", name:"bairro_descricao"},
					{data:"cidade_descricao", name:"cidade_descricao"},
					{sDefaultContent: obterBotoesAcao()}
				];
let _urlsAjaxAluno= obterUrlsDaControladora("aluno");
let _urlViewAluno= obterUrlsDaView("aluno");

function initAluno(){
	$("#body").load(_urlViewAluno.crud, function() {
		// MODAL			
		controle.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',			
				buttons: obterBotoesDT(),
				columns: _colunasAluno,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarAluno(aData.id);
					});
					$btnRemove.click(function() {
						_removerAluno(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxAluno.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"aluno",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarAluno();
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

function carregarBairros(id, idCidade){
	let endereco = "../controladoras/bairroCarregaTodos.php";
	if(idCidade>0)
		endereco = endereco+"?idCidade="+idCidade;
	fazerRequisicaoAjax(endereco,null, 
					function success(data){
						if(!data.erro){
							console.log(data.data);
							//Preenche Combo de Bairros
							$('#bairrosCombo').empty();
							$('#bairrosCombo').append('<OPTION value=0>Escolha um bairro...</option>');
							$.each(data.data, function(indice,bairro){
								console.log(indice+' : '+bairro.descricao);
								if(id == bairro.id)
									$('#bairrosCombo').append('<OPTION value='+bairro.id+' selected=selected>'+bairro.descricao+'</option>');
								else
									$('#bairrosCombo').append('<OPTION value='+bairro.id+'>'+bairro.descricao+'</option>');
							});
						}else
							alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"bairro",'ERRO AO CARREGAR ',' - SERVER SIDE');
					},
					'GET'//Método HTTP
	);//Fim de fazerRequisicao
}

function _cadastrarAluno(){
	controle.modal.carregar(_urlViewAluno.cadastra, "Novo Aluno", 
		function(){		
			let $botaoEscopo = $(".btn-send");
			$("#cidadesCombo").change(function(e){
				let idCidade = e.target.value;
				carregarBairros(0,idCidade);
			});
			carregarCidades(0); //Preencher o <select> de cidades
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
				if( _validarAluno()>0 ){
					alert('Verifique o preenchimento');
				}
				else{
					controle.modal.fechar();
					let aluno = {};
					aluno.matricula = $('#matricula').val();
					aluno.nome = $('#nome').val();
					aluno.email = $('#email').val();
					//aluno.foto = $('#foto').val();
					aluno.repetente = ($('#repetente1').prop("checked"))?1:0;
					aluno.nascimento = $('#nascimento').val();
					aluno.problema_saude = $('#problema_saude').val();
					console.log(aluno.repetente);
					//Busca o bairro
					let bairro = {}
					bairro.id = $('#bairrosCombo').val();
					bairro.descricao = $('#bairrosCombo :selected').text();
					//Busca a cidadeo
					let cidade = {}
					cidade.id = $('#cidadesCombo').val();
					cidade.descricao = $('#cidadesCombo :selected').text();
					bairro.cidade = cidade;
					aluno.bairro = bairro;
					//RECUPERA OS TELEFONES DA TABELA (30/09)
					let telefones = recuperaTelefones($corpoTabela);
					aluno.telefones = telefones;	
					//FIM DE RECUPERA OS TELEFONES DA TABELA
					///////////Req. Ajax Raiz/////////////////
					let xhr = new XMLHttpRequest();
        			let dados = new FormData();
        			let $inputFile = document.querySelector('#foto');
        			dados.append( "foto", $inputFile.files[0] );
        			dados.append( "aluno", JSON.stringify(aluno));
        			// abre requisição
        			xhr.open( 'POST', _urlsAjaxAluno.cadastra);
					// envia o formulário
					xhr.send( dados );
					// quando estiver pronto
        			xhr.onreadystatechange = function () {
            			if ( this.readyState == 4 && this.status == 200) {
            				let data = this.responseText;
            				console.log(data);
            				console.log('Resposta',data);
            			//alert(data.erro);
            			(data.erro==false)?controle.tabela.update():exibirMensagensDeErro(this,"aluno",'ERRO AO CADASTRAR ',' - SERVER SIDE');
            			}
        			};
				}//fim do else
			});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar


function _removerAluno(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão deste aluno?')){
		let aluno = {};
		aluno.id = id;
		fazerRequisicaoAjax(_urlsAjaxAluno.remove, {aluno: JSON.stringify(aluno)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"aluno",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover
		
function _alterarAluno(id){
	let aluno = {};
	aluno.id = id;
	fazerRequisicaoAjax(_urlsAjaxAluno.buscar, {aluno: JSON.stringify(aluno)}, 
		function success(data){
			if(!data.erro){
				aluno = data.data;
				controle.modal.carregar(_urlViewAluno.edita, "Alterar Aluno"
					, function(){
						let $botaoEscopo = $(".btn-send");
						$('#id').val(aluno.id);
						$('#nome').val(aluno.nome);
						$('#email').val(aluno.email);
						$('#matricula').val(aluno.matricula);
						$('#problema_saude').val(aluno.problema_saude);
						$('#nascimento').val(aluno.data_nascimento);
						//Carregar foto
						if(aluno.repetente==0)
							$('#repetente0').attr('checked', 'checked');
						else
							$('#repetente1').attr('checked', 'checked');
						console.log(aluno);

						$("#cidadesCombo").change(function(e){
							let idCidade = e.target.value;
							carregarBairros(0,idCidade);
						});
						carregarCidades(aluno.cidade_id); //Preencher o <select> de cidades
						carregarBairros(aluno.bairro_id,aluno.cidade_id);
						//SÓ AO CARREGAR
						///MONTA A TABELA DE TELEFONES (30/09)
						let $formCad = document.querySelector('form');
						let $btnAdd = document.querySelector('#btn-add');
						let $corpoTabela = document.querySelector('#corpoTelefones');
						adicionaTelefones(aluno.telefones, $corpoTabela);
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
							if ( _validarAluno()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let aluno = {};
								aluno.id = id;
								aluno.nome = $('#nome').val();
								aluno.email = $('#email').val();
								aluno.matricula = $('#matricula').val();
								aluno.repetente = ($('#repetente1').prop("checked"))?1:0;
								aluno.nascimento = $('#nascimento').val();
								aluno.problema_saude = $('#problema_saude').val();
								let bairro = {}
								bairro.id = $('#bairrosCombo :selected').val();
								bairro.descricao = $('#bairrosCombo :selected').text();
								let cidade = {}
								cidade.id = $('#cidadesCombo :selected').val();
								cidade.descricao = $('#cidadesCombo :selected').text();
								bairro.cidade = cidade;
								aluno.bairro = bairro;
								//outros dados....

								//RECUPERA OS TELEFONES DA TABELA (30/09)
								let telefones = recuperaTelefones($corpoTabela);
								aluno.telefones = telefones;	
								//FIM DE RECUPERA OS TELEFONES DA TABELA
								///////////Req. Ajax Raiz/////////////////
								let xhr = new XMLHttpRequest();
        						let dados = new FormData();
   								let $inputFile = document.querySelector('#foto');
        						dados.append( "foto", $inputFile.files[0] );
        						dados.append( "aluno", JSON.stringify(aluno));
        						// abre requisição
        						xhr.open( 'POST', _urlsAjaxAluno.alterar);
								// envia o formulário
								xhr.send( dados );
								// quando estiver pronto
        						xhr.onreadystatechange = function () {
            						if ( this.readyState == 4 && this.status == 200) {
            							let data = this.responseText;
            							console.log('Resposta',data);
            							//alert(data.erro);
            							(data.erro==false)?controle.tabela.update():exibirMensagensDeErro(this,"aluno",'ERRO AO ALTERAR ',' - SERVER SIDE');
            						}
            					};
							}//Fim do else
						});//Fim de botaoEscopo.click
					resetarModalEBotao($botaoEscopo);
				});//Fim de carregar
			}else
				alert(data.mensagem);
		},//Fim de success
		function fail(e){
			exibirMensagensDeErro(e,"aluno",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar
	
function _validarAluno(){
	let erros = 0;
	if ( ($('#matricula').val().length<=0) )
		erros++;
	if ( ($('#nome').val().length<=0) )
		erros++;
	if ( ($('#email').val().length<=0) )
		erros++;
	if ( ! ($('#cidadesCombo').val()>0) )
		erros++;
	if ( ! ($('#bairrosCombo').val()>0) )
		erros++;
	return erros;
};

//Funções criadas em 30/09
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
