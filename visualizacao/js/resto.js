
const modulos = {
	aluno: {
		_control: {
			tabela: undefined,
			modal: undefined
		},
		_ajax: {
			cadastra: "../controladoras/alunoCadastra.php",
			remove: "../controladoras/alunoRemove.php",
			buscar: "../controladoras/alunoCarrega.php",
			alterar: "../controladoras/alunoAltera.php",
			carregar: "../controladoras/alunosCarrega.php"
		},
		_url: {
			crud: "./aluno-crud.html",
			edita: "./aluno-edicao.html",
			cadastra: "./aluno-cadastro.html"
		},
		init: function(){
			let $this = this;

			$("#body").load($this._url.crud, function() {

				// MODAL
				$this._control.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");

				// TABELA
				try{
					$.fn.dataTable.ext.errMode = 'throw';
					$this._control.tabela = new DataTable("#tab", {
						lengthMenu:[
							[10,25,50,100,-1],
							[10,25,50,100,"todos"]
						],
						columns:[
							{data:"id", name:"id"},
							{data:"nome", name:"nome"},
							{data:"email", name:"email"},
							{
						        sDefaultContent: "<div>"+
						    	    "<button class='btn btn-danger btn-remove btn-acao'><i class='fa fa-trash' aria-hidden='true'></i></button>"+
						        	"<button class='btn btn-primary btn-altera btn-acao'><i class='fa fa-pencil' aria-hidden='true'></i></button>"+
						        "</div>"
						    }
						],
						dom: 'Bfrtip',
						buttons: [
								{

									extend: "copyHtml5",
									text: "Copiar tabela"
								},
								{

									extend: "pdfHtml5",
									text: "Gerar pdf"
								},
								{

									extend: "excelHtml5",
									text: "Gerar excel"
								}
						],
					    fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
					        let altera = $(nRow).find("button.btn-altera");
					        let remove = $(nRow).find('button.btn-remove');

					        altera.click(function(){
					        	$this._alteraAluno(aData.id);
					        });
					        remove.click(function() {
					        	$this._removeAluno(aData.id);
					        });
					    },
						language:{
							"sEmptyTable": "Nenhum registro encontrado",
							"sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
							"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
							"sInfoFiltered": "(Filtrados de _MAX_ registros)",
							"sInfoPostFix": "",
							"sInfoThousands": ".",
							"sLengthMenu": "_MENU_ resultados por página",
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
						},
						/*
							select: true,
							buttons: [
								{extend: 'create', editor: editor},
								{extend: 'edit', editor: editor},
								{extend: 'remove', editor: editor},
								{
									extend: 'collection',
									text: 'Export',
									buttons: [
										'copy',
										'excel',
										'csv',
										'pdf',
										'print'
									]
								}
							],
						*/
						ajax: {
		               		url: $this._ajax.carregar,
		               		error: function (xhr, error, thrown) {
		               			alert('ERRO CARREGAR TABELA - SERVER SIDE');
		               			console.clear();
		               			console.log('ERRO CARREGAR TABELA - SERVER SIDE');
		               			console.error("Erro do Servidor: "+xhr.responseText);
							}
		               	}
	               	});
				}
				catch(e){
					alert('ERRO NA RENDERIZAÇÃO DA TABELA - CLIENT SIDE');
					console.log(e);
				}

				// EVENTOS
				$(document).on('beforeTableUpdate', function(){
					// RESETA EVENTOS PASSADOS
					$(".btn-acao").off('click');
				});
				$("#btn-novo").click(function(){
					// 
					$this._cadastraAluno();
				});
			});
		},
		_cadastraAluno: function(){
			let $this = this;

			$this._control.modal.carregar($this._url.cadastra, "Novo Aluno", function(){
				let escopo = $(".btn-send");

				escopo.click( function() {

					if ( $this.__valida()>0 ){
						alert('Verifique o preenchimento');
					}

					else{
						$this._control.modal.fechar();

						let aluno = {};
						aluno.nome = $('#nome').val();
						aluno.email = $('#email').val();

						$this.__requisicao($this._ajax.cadastra, {aluno: JSON.stringify(aluno)}, 
							function success(data){
								if (!data.erro){
									$this._control.tabela.update();
								}
								else{
									alert(data.mensagem);
								}
							}, 
							function fail(e){
								console.clear();
								console.error("Erro do Servidor: "+e.responseText);
								alert('Erro De Cadastro - SERVER SIDE');
							}
						);
					}
				});

				$(document).on('modalFechado', function(){
					$(this).off('modalFechado');
					escopo.off('click');
				});
			});	
		},
		_removeAluno: function(id){
			let $this = this;

			if ( id<=0 ){
				alert('Id inválido para remoção.');
			}
			else{
				if (confirm('Confirma a exclusão desde aluno?')){

					let aluno = {};
					aluno.id = id;

					$this.__requisicao($this._ajax.remove, {aluno: JSON.stringify(aluno)}, 
						function success(data){
							if (!data.erro){
								$this._control.tabela.update();
							}
							else{
								alert(data.mensagem);
							}
						}, 
						function fail(e){
							console.clear();
							console.log("------");
							console.log("Erro do Servidor: "+e.responseText);
							alert('ERRO AO REMOVER ALUNO - SERVER SIDE');
						}
					);
				}
			}
		},
		_alteraAluno: function(id){
			let $this = this;

			let aluno = {};
					aluno.id = id;

			$this.__requisicao($this._ajax.buscar, {aluno: JSON.stringify(aluno)}, 
				function success(data){
					if (!data.erro){
						aluno = data.data;

						$this._control.modal.carregar($this._url.edita, "Alterar Aluno", function(){
							let escopo = $(".btn-send");
							let id = $('#id');
							let nome = $('#nome');
							let email = $('#email');

							id.val(aluno.id);
							nome.val(aluno.nome);
							email.val(aluno.email);

							escopo.click( function() {
								if ( $this.__valida()>0 ){
									alert('Verifique o preenchimento');
								}
								else{
									$this._control.modal.fechar();

									let aluno = {};
									aluno.id = id.val();
									aluno.nome = nome.val();
									aluno.email = email.val();

									$this.__requisicao($this._ajax.alterar, {aluno: JSON.stringify(aluno)}, 
										function success(data){
											if (!data.erro){
												$this._control.tabela.update();
												alert(data.mensagem);
											}
											else{
												alert(data.mensagem);
											}
										}, 
										function fail(e){
											console.clear();
											console.log("------");
											console.error("Erro do Servidor: "+e.responseText);
											alert('ERRO DE ALTERAR - SERVER SIDE');
										}
									);
								}
							});

							$(document).on('modalFechado', function(){
								$(this).off('modalFechado');
								escopo.off('click');
							});

						});
					}
					else{
						alert(data.mensagem);
					}
				}, 
				function fail(e){
					console.clear();
					console.error("Erro do Servidor: "+e.responseText);
					alert('ERRO AO BUSCAR ALUNO - SERVER SIDE');
				}
			);
		},
		__valida: function (){
			let erros = 0;
			if (! $('#nome').val().length > 0){
				erros++;
			}
			if (! $('#email').val().length > 0){
				erros++;
			}
			return erros;
		},
		__requisicao: function(url, data, fnSuccess, fnFail){
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: data,
				context: document.body
			})
			.done(function(data) {
				fnSuccess.call(this, data);
			})
			.fail(function(e) {
				fnFail.call(this, e);
			})
			.always(function() {
				$(document).trigger('RequisicaoEnviada');
			});
		}
	},
	usuario: {
		_control: {
			tabela: undefined,
			modal: undefined
		},
		_ajax: {
			cadastra: "../controladoras/usuarioCadastra.php",
			remove: "../controladoras/usuarioRemove.php",
			buscar: "../controladoras/usuarioCarrega.php",
			alterar: "../controladoras/usuarioAltera.php",
			carregar: "../controladoras/usuariosCarrega.php"
		},
		_url: {
			crud: "./usuario-crud.html",
			edita: "./usuario-edicao.html",
			cadastra: "./usuario-cadastro.html"
		},
		init: function(){
			let $this = this;

			$("#body").load($this._url.crud, function() {

				// MODAL
				$this._control.modal = new Modal("#modal-formulario", "#formulario", "#form-titulo");

				// TABELA
				try{
					$.fn.dataTable.ext.errMode = 'throw';
					$this._control.tabela = new DataTable("#tab", {
						lengthMenu:[
							[10,25,50,100,-1],
							[10,25,50,100,"todos"]
						],
						columns:[
							{data:"id", name:"id"},
							{data:"nome", name:"nome"},
							{data:"cargo", name:"cargo"},
							{data:"login", name:"login"},
							{data:"senha", name:"senha"},
							{
						        sDefaultContent: "<div>"+
						    	    "<button class='btn btn-danger btn-remove btn-acao'><i class='fa fa-trash' aria-hidden='true'></i></button>"+
						        	"<button class='btn btn-primary btn-altera btn-acao'><i class='fa fa-pencil' aria-hidden='true'></i></button>"+
						        "</div>"
						    }
						],
						dom: 'Bfrtip',
						buttons: [
								{

									extend: "copyHtml5",
									text: "Copiar tabela"
								},
								{

									extend: "pdfHtml5",
									text: "Gerar pdf"
								},
								{

									extend: "excelHtml5",
									text: "Gerar excel"
								}
						],
					    fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
					        let altera = $(nRow).find("button.btn-altera");
					        let remove = $(nRow).find('button.btn-remove');

					        altera.click(function(){
					        	$this._alteraUsuario(aData.id);
					        });
					        remove.click(function() {
					        	$this._removeUsuario(aData.id);
					        });
					    },
						language:{
							"sEmptyTable": "Nenhum registro encontrado",
							"sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
							"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
							"sInfoFiltered": "(Filtrados de _MAX_ registros)",
							"sInfoPostFix": "",
							"sInfoThousands": ".",
							"sLengthMenu": "_MENU_ resultados por página",
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
						},
						/*
							select: true,
							buttons: [
								{extend: 'create', editor: editor},
								{extend: 'edit', editor: editor},
								{extend: 'remove', editor: editor},
								{
									extend: 'collection',
									text: 'Export',
									buttons: [
										'copy',
										'excel',
										'csv',
										'pdf',
										'print'
									]
								}
							],
						*/
						ajax: {
		               		url: $this._ajax.carregar,
		               		error: function (xhr, error, thrown) {
		               			alert('ERRO CARREGAR TABELA - SERVER SIDE');
		               			console.clear();
		               			console.log('ERRO CARREGAR TABELA - SERVER SIDE');
		               			console.error("Erro do Servidor: "+xhr.responseText);
							}
		               	}
	               	});
				}
				catch(e){
					alert('ERRO NA RENDERIZAÇÃO DA TABELA - CLIENT SIDE');
					console.log(e);
				}

				// EVENTOS
				$(document).on('beforeTableUpdate', function(){
					// RESETA EVENTOS PASSADOS
					$(".btn-acao").off('click');
				});
				$("#btn-novo").click(function(){
					// 
					$this._cadastraUsuario();
				});
			});
		},
		_cadastraUsuario: function(){
			let $this = this;

			$this._control.modal.carregar($this._url.cadastra, "Novo Usuário", function(){
				let escopo = $(".btn-send");

				escopo.click( function() {

					if ( $this.__valida()>0 ){
						alert('Verifique o preenchimento');
					}

					else{
						$this._control.modal.fechar();

						let usuario = {};
						usuario.nome = $('#nome').val();
						usuario.cargo = $('#cargo').val();
						usuario.login = $('#login').val();
						usuario.senha = $('#senha').val();


						$this.__requisicao($this._ajax.cadastra, {usuario: JSON.stringify(usuario)}, 
							function success(data){
								if (!data.erro){
									$this._control.tabela.update();
								}
								else{
									alert(data.mensagem);
								}
							}, 
							function fail(e){
								console.clear();
								console.error("Erro do Servidor: "+e.responseText);
								alert('Erro De Cadastro - SERVER SIDE');
							}
						);
					}
				});

				$(document).on('modalFechado', function(){
					$(this).off('modalFechado');
					escopo.off('click');
				});
			});	
		},
		_removeUsuario: function(id){
			let $this = this;

			if ( id<=0 ){
				alert('Id inválido para remoção.');
			}
			else{
				if (confirm('Confirma a exclusão desde usuário?')){

					let usuario = {};
					usuario.id = id;

					$this.__requisicao($this._ajax.remove, {usuario: JSON.stringify(usuario)}, 
						function success(data){
							if (!data.erro){
								$this._control.tabela.update();
							}
							else{
								alert(data.mensagem);
							}
						}, 
						function fail(e){
							console.clear();
							console.log("------");
							console.log("Erro do Servidor: "+e.responseText);
							alert('ERRO AO REMOVER USUÁRIO - SERVER SIDE');
						}
					);
				}
			}
		},
		_alteraUsuario: function(id){
			let $this = this;

			let usuario = {};
					usuario.id = id;

			$this.__requisicao($this._ajax.buscar, {usuario: JSON.stringify(usuario)}, 
				function success(data){
					if (!data.erro){
						usuario = data.data;

						$this._control.modal.carregar($this._url.edita, "Alterar Usuário", function(){
							let escopo = $(".btn-send");
							let id = $('#id');
							let nome = $('#nome');
							let cargo = $('#cargo');
							let login = $('#login');
							let senha = $('#senha');

							id.val(usuario.id);
							nome.val(usuario.nome);
							cargo.val(usuario.cargo);
							login.val(usuario.login);
							senha.val(usuario.senha);

							escopo.click( function() {
								if ( $this.__valida()>0 ){
									alert('Verifique o preenchimento');
								}
								else{
									$this._control.modal.fechar();

									let usuario = {};
									usuario.id = id.val();
									usuario.nome = nome.val();
									usuario.cargo = cargo.val();
									usuario.login = login.val();
									usuario.senha = senha.val();

									$this.__requisicao($this._ajax.alterar, {usuario: JSON.stringify(usuario)}, 
										function success(data){
											if (!data.erro){
												$this._control.tabela.update();
												alert(data.mensagem);
											}
											else{
												alert(data.mensagem);
											}
										}, 
										function fail(e){
											console.clear();
											console.log("------");
											console.error("Erro do Servidor: "+e.responseText);
											alert('ERRO DE ALTERAR - SERVER SIDE');
										}
									);
								}
							});

							$(document).on('modalFechado', function(){
								$(this).off('modalFechado');
								escopo.off('click');
							});

						});
					}
					else{
						alert(data.mensagem);
					}
				}, 
				function fail(e){
					console.clear();
					console.error("Erro do Servidor: "+e.responseText);
					alert('ERRO AO BUSCAR USUÁRIO - SERVER SIDE');
				}
			);
		},
		__valida: function (){
			let erros = 0;
			if (! $('#nome').val().length > 0){
				erros++;
			}
			if (! $('#cargo').val().length > 0){
				erros++;
			}
			if (! $('#login').val().length > 0){
				erros++;
			}
			if (! $('#senha').val().length > 0){
				erros++;
			}
			return erros;
		},
		__requisicao: function(url, data, fnSuccess, fnFail){
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: data,
				context: document.body
			})
			.done(function(data) {
				fnSuccess.call(this, data);
			})
			.fail(function(e) {
				fnFail.call(this, e);
			})
			.always(function() {
				$(document).trigger('RequisicaoEnviada');
			});
		}
	}
}

