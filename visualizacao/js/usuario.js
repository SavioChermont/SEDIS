var _colunasUsuario = [
					{data:"id", name:"id"},
					{data:"nome", name:"nome"},
					{data:"cargo", name:"cargo"},
					{sDefaultContent: obterBotoesAcao()}
				];
var _urlsAjaxUsuario= obterUrlsDaControladora("usuario");
let _urlViewUsuario= obterUrlsDaView("usuario");

function initUsuario(){
	$("#body").load(_urlViewUsuario.crud, function() {
		// MODAL			
		controle.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',			
				buttons: obterBotoesDT(),
				columns: _colunasUsuario,
				lengthMenu:obterTamanhoMenu(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	$btnAltera.click(function(){
			    		_alterarUsuario(aData.id);
					});
					
					$btnRemove.click(function() {
						_removerUsuario(aData.id);
					});

				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxUsuario.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"usuario",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-novo").click(function(){
			_cadastrarUsuario();
		});
		$("#btn-login").click(function(){
			_loginUsuario();
		});
		$("#btn-logout").click(function(){
			_logoutUsuario();
		});
	});//Fim do onLoad
};//Fim do init...

function _cadastrarUsuario(){
	controle.modal.carregar(_urlViewUsuario.cadastra, "Nova Usuario", 
		function(){
			let $botaoEscopo = $(".btn-send");
			$botaoEscopo.click( function() {
			if( _validarUsuario()>0 ){
				alert('Verifique o preenchimento');
			}
			else{
				controle.modal.fechar();
				let usuario = {};
				usuario.nome = $('#nome').val();
				usuario.cargo = $('#cargo').val();
				usuario.login = $('#login').val();
				usuario.senha = $('#senha').val();
				fazerRequisicaoAjax(_urlsAjaxUsuario.cadastra, {usuario: JSON.stringify(usuario)}, 
					function success(data){
						(!data.erro)?controle.tabela.update():alert(data.mensagem);
					}, 
					function fail(e){
						exibirMensagensDeErro(e,"usuario",'ERRO AO CADASTRAR ',' - SERVER SIDE');
					},
					'POST'//Método HTTP
				);//Fim de fazerRequisicao
			}//fim do else
		});//Fim da function passada como argumento em carregar
		resetarModalEBotao($botaoEscopo);
	});//Fim de carregar	
};//Fim de cadastrar
		
function _removerUsuario(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão desta Usuario?')){
		let usuario = {};
		usuario.id = id;
		fazerRequisicaoAjax(_urlsAjaxUsuario.remove, {usuario: JSON.stringify(usuario)}, 
			function success(data){
				(!data.erro)? controle.tabela.update(): alert(data.mensagem);
			}, 
			function fail(e){
				exibirMensagensDeErro(e,"usuario",'ERRO AO REMOVER ',' - SERVER SIDE');
			},
			'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover
		
function _alterarUsuario(id){
	let usuario = {};
	usuario.id = id;
	fazerRequisicaoAjax(_urlsAjaxUsuario.buscar, {usuario: JSON.stringify(usuario)}, 
		function success(data){
			if(!data.erro){
				usuario = data.data;
				controle.modal.carregar(_urlViewUsuario.edita, "Alterar Usuario"
					, function(){
						let $botaoEscopo = $(".btn-send");
						$('#id').val(usuario.id);
						$('#nome').val(usuario.nome);
						$('#cargo').val(usuario.cargo);
						$('#login').val(usuario.login);
						$('#senha').val(usuario.senha);
						$botaoEscopo.click( function(){
							if ( _validarUsuario()>0 )
								alert('Verifique o preenchimento');
							else{
								controle.modal.fechar();
								let usuario = {};
								usuario.id = $('#id').val();
								usuario.nome = $('#nome').val();
								usuario.cargo = $('#cargo').val();
								usuario.login = $('#login').val();
								usuario.senha = $('#senha').val();
								fazerRequisicaoAjax(_urlsAjaxUsuario.alterar, {usuario: JSON.stringify(usuario)}, 
									function success(data){
										if(!data.erro){
											controle.tabela.update();
											alert(data.mensagem);
										}
										else
											alert(data.mensagem);
									},//fim de success 
									function fail(e){
										exibirMensagensDeErro(e,"usuario",'ERRO AO ALTERAR ',' - SERVER SIDE');
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
			exibirMensagensDeErro(e,"usuario",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
};//Fim de alterar

function _validarUsuario(){
	let erros = 0;
	if ( ($('#nome').val().length<=0) )
		erros++;
	if ( ($('#cargo').val().length<=0) )
		erros++;
	if ( ($('#login').val().length<=0) )
		erros++;
	if ( ($('#senha').val().length<=0) )
		erros++;
	return erros;
};
