let _colunasMatricula = [
					{data:"id", name:"id"},
					{data:"disciplina_descricao", name:"disciplina"},
					{data:"aluno_nome", name:"aluno"},
					{data:"professor_nome", name:"professor"},
					{sDefaultContent: obterBotoesAcao()}
				];
let _urlsAjaxMatricula= obterUrlsDaControladora("matricula");
let _urlViewMatricula= obterUrlsDaView("matricula");
let alunosMatricula= [];
let anos = [];
/*let anoEscolhido = 0;
let turma_id=0;
let disciplina_id=0;
let professor_id=0;

function retornarQString(){
	return '?ano='+anoEscolhido+'&turma='+turma_id+'&disciplina='+disciplina_id+'&professor='+professor_id;
}*/

function carregarAnos(anoArgumento){
	let hoje = new Date();
	anos=[];
  	let anoCorrente = hoje.getFullYear();
  	for(i=2016;i<=(anoCorrente+1);i++)
  		anos.push(i);
  	$('#anosCombo').empty();
	$('#anosCombo').append('<OPTION value=0>Escolha</option>');
	$.each(anos, function(indice,ano){
		if(anoArgumento == ano){
			anoEscolhido=ano;
			$('#anosCombo').append('<OPTION value='+ano+' selected=selected>'+ano+'</option>');
		}
		else if((anoArgumento<2016) && (ano==anoCorrente)){
			anoEscolhido=ano;
			$('#anosCombo').append('<OPTION value='+ano+' selected=selected>'+ano+'</option>');
		}
		else
			$('#anosCombo').append('<OPTION value='+ano+'>'+ano+'</option>');
	});
}

function carregarAlunosMatricula(){
	fazerRequisicaoAjax("../controladoras/alunoCarregaTodosAC.php", null, 
	function success(data){
		if(!data.erro){
			$.each(data.data, function(indice,aluno){
				alunosMatricula.push(aluno.nome);
			});
		}else
			alert(data.mensagem);
		}, 
		function fail(e){
			exibirMensagensDeErro(e,"alunos matrícula",'ERRO AO LISTAR ',' - SERVER SIDE');
		},
		'GET'//Método HTTP
	);//Fim de fazerRequisicao
}

function carregarCursosMatricula(cursoId){
	fazerRequisicaoAjax("../controladoras/cursoCarregaTodos.php", null, 
	function success(data){
		let hoje = new Date();
  		var anoCorrente = hoje.getFullYear();
		if(!data.erro){
			$('#cursosCombo').empty();
			$('#cursosCombo').append('<OPTION value=0>Escolha o curso ....</option>');
			$.each(data.data, function(indice,curso){
			if(cursoId==curso.id)
				$('#cursosCombo').append('<OPTION value='+curso.id+' selected=selected>'+curso.descricao+'</option>');
			else
				$('#cursosCombo').append('<OPTION value='+curso.id+'>'+curso.descricao+'</option>');
			});
		}else
			alert(data.mensagem);
		}, 
		function fail(e){
			exibirMensagensDeErro(e,"cursos",'ERRO AO LISTAR ',' - SERVER SIDE');
		},
		'GET'//Método HTTP
	);//Fim de fazerRequisicao
}

function carregarTurmasMatricula(cursoId, turmaId){
	let curso = {};
	curso.id = cursoId;
	fazerRequisicaoAjax("../controladoras/turmaCarregaTodos.php", {curso:JSON.stringify(curso)}, 
	function success(data){
		if(!data.erro){
		$('#turmasCombo').empty();
		$('#turmasCombo').append('<OPTION value=0>Escolha a turma ....</option>');
		$.each(data.data, function(indice,turma){
			if(turmaId==turma.id)
				$('#turmasCombo').append('<OPTION value='+turma.id+' selected=selected>'+turma.descricao+'</option>');
		    else
	     		$('#turmasCombo').append('<OPTION value='+turma.id+'>'+turma.descricao+'</option>');
		});
		}else
			alert(data.mensagem);
	}, 
	function fail(e){
		exibirMensagensDeErro(e,"turmas",'ERRO AO CARREGAR POR CURSO ',' - SERVER SIDE');
	},
	'POST'//Método HTTP
	);//Fim de fazerRequisicao
}

function carregarDisciplinasMatricula(cursoId, disciplinaId){
	let curso = {};
	curso.id = cursoId;
	fazerRequisicaoAjax("../controladoras/disciplinaCarregaTodos.php", {curso:JSON.stringify(curso)}, 
	function success(data){
		if(!data.erro){
			$('#disciplinasCombo').empty();
			$('#disciplinasCombo').append('<OPTION value=0>Escolha a disciplina ....</option>');
			$.each(data.data, function(indice,disciplina){
				if(disciplinaId>0 && disciplinaId==disciplina.id)
					$('#disciplinasCombo').append('<OPTION value='+disciplina.id+' selected=selected>'+disciplina.descricao+'</option>');
			    else
					$('#disciplinasCombo').append('<OPTION value='+disciplina.id+'>'+disciplina.descricao+'</option>');
			});
		}else
			alert(data.mensagem);
	}, 
	function fail(e){
		exibirMensagensDeErro(e,"disciplinas",'ERRO AO CARREGAR ',' - SERVER SIDE');
	},
	'POST'//Método HTTP
	);//Fim de fazerRequisicao
}

function carregarProfessoresMatricula(professorId){
	fazerRequisicaoAjax("../controladoras/professorCarregaTodos.php", null, 
	function success(data){
		if(!data.erro){
			$('#professoresCombo').empty();
			$('#professoressCombo').append('<OPTION value=0>Escolha um professor ....</option>');
			$.each(data.data, function(indice,professor){
				if(professorId==professor.id)
					$('#professoresCombo').append('<OPTION value='+professor.id+' selected=selected>'+professor.nome+'</option>');
			    else
					$('#professoresCombo').append('<OPTION value='+professor.id+'>'+professor.nome+'</option>');
			});
		}else
			alert(data.mensagem);
	}, 
	function fail(e){
		exibirMensagensDeErro(e,"professores",'ERRO AO CARREGAR POR CURSO ',' - SERVER SIDE');
	},
	'POST'//Método HTTP
	);//Fim de fazerRequisicao
}

function initMatricula(){
	$("#body").load(_urlViewMatricula.crud, function() {
		// TABELA
		try{
			$.fn.dataTable.ext.errMode = 'throw';
			controle.tabela = new DataTable("#tab", 
			{
				dom: 'Blfrtip',			
				buttons: obterBotoesDT(),
				columns: _colunasMatricula,
				lengthMenu:obterTamanhoMenuMenor(),
				fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    	let $btnAltera = $(nRow).find("button.btn-altera");
			    	let $btnRemove = $(nRow).find('button.btn-remove');

			    	/*$btnAltera.click(function(){
			    		_alterarMatricula(aData.id);
					});*/
					$btnRemove.click(function() {
						_removerMatricula(aData.id);
					});
				},
				language:obterLinguagemPadrao(),
				ajax: fazerRequisicaoAjaxDT(_urlsAjaxMatricula.carregarDT)
	    	});//Fim de DataTable
		}catch(e){ //erro/exceção,objetoModelo,tipoDeErro,ladoDoErro
			exibirMensagensDeErro(e,"matricula",'ERRO AO RENDERIZAR TABELA ',' - CLIENT SIDE');
		}
		// EVENTOS ATRELADOS AOS BOTÕES DO DataTables
		$(document).on('beforeTableUpdate', function(){
			$(".btn-acao").off('click');// RESETA O EVENTO click
		});
		$("#btn-matricular").click(function(){
			_cadastrarMatricula();
		});
		
		$('#cursosCombo').change(function(e){
			let cursoId = e.target.value;
			carregarTurmasMatricula(cursoId,0);
			carregarDisciplinasMatricula(cursoId,0);
		});
		$('#turmasCombo').change(function(e){
			turma_id=e.target.value;
		});
		$('#disciplinasCombo').change(function(e){
			disciplina_id=e.target.value;
		});
		$('#anosCombo').change(function(e){
			anoEscolhido=e.target.value;
		});
		$('#professoresCombo').change(function(e){
			professor_id=e.target.value;
		});
		carregaFormulario();
	});//Fim do onLoad
};//Fim do init...

function _cadastrarMatricula(){
	if( _validarMatricula()>0 ){
		alert('Verifique o preenchimento');
	}
	else{
		let matricula = {};
		matricula.ano=$('#anosCombo :selected').val();
		let turma={};
		turma.id= $('#turmasCombo :selected').val();
		turma.descricao= $('#turmasCombo :selected').text();
		matricula.turma = turma;
		let disciplina={};
		disciplina.id= $('#disciplinasCombo :selected').val();
		disciplina.descricao= $('#disciplinasCombo :selected').text();
		matricula.disciplina = disciplina;
		let professor={};
		professor.id= $('#professoresCombo :selected').val();
		professor.descricao= $('#professoresCombo :selected').text();
		matricula.professor = professor;
		let aluno = {};
		let partes = $('#alunoid').val().split('-');
		aluno.id = partes[1];
		aluno.nome = partes[0];
		matricula.aluno=aluno;
		console.log(matricula);
		fazerRequisicaoAjax(_urlsAjaxMatricula.cadastra, {matricula: JSON.stringify(matricula)}, 
		function success(data){
			if(data.erro==false)
				limparCampos();
			(!data.erro)?controle.tabela.update():alert(data.mensagem);
		}, 
		function fail(e){
			exibirMensagensDeErro(e,"matricula",'ERRO AO CADASTRAR ',' - SERVER SIDE');
		},
		'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//fim do else
}//Fim de cadastrar

/*function _alterarMatricula(id){
	$btnAlterar = document.querySelector('#btn-matricular');
	$btnAlterar.textContent="Alterar Matrícula";
	let matricula = {};
	matricula.id = id;
	fazerRequisicaoAjax(_urlsAjaxMatricula.buscar, {matricula: JSON.stringify(matricula)}, 
		function success(data){
			if(!data.erro){
				matricula = data.data;
				$('#anosCombo :selected').val(matricula.ano);
				$('#cursosCombo :selected').val(matricula.curso_id);
				$('#turmasCombo :selected').val(matricula.turma_id);
				$('#disciplinasCombo :selected').val(matricula.disciplina_id);
				$('#professoresCombo :selected').val(matricula.professor_id);
				$('#alunoid').val(matricula.alunoPesquisa);
				alert('ffffff')
				$btnAlterar.click( function(){
				if ( _validarOcorrencia()>0 )
					alert('Verifique o preenchimento');
				else{
					let matricula = {};
					matricula.id=id;
					matricula.ano=$('#anosCombo :selected').val();
					let turma={};
					turma.id= $('#turmasCombo :selected').val();
					turma.descricao= $('#turmasCombo :selected').text();
					matricula.turma = turma;

					let disciplina={};
					disciplina.id= $('#disciplinasCombo :selected').val();
					disciplina.descricao= $('#disciplinasCombo :selected').text();
					matricula.disciplina = disciplina;

					let professor={};
					professor.id= $('#professoresCombo :selected').val();
					professor.descricao= $('#professoresCombo :selected').text();
					matricula.professor = professor;
					
					let aluno = {};
					let partes = $('#alunoid').val().split('-');
					aluno.id = partes[1];
					aluno.nome = partes[0];
					matricula.aluno=aluno;
					
					console.log(matricula);
					fazerRequisicaoAjax(_urlsAjaxMatricula.alterar, {matricula: JSON.stringify(matricula)}, 
						function success(data){
							if(!data.erro){
								controle.tabela.update();
								alert(data.mensagem);
							}
							else
								alert(data.mensagem);
							},//fim de success 
							function fail(e){
								exibirMensagensDeErro(e,"matrícula",'ERRO AO ALTERAR ',' - SERVER SIDE');
							},
							'POST'//Método HTTP
						);//Fim de fazerRequisicao
					}//Fim do else
				});//Fim de carregar
			}else
				alert(data.mensagem);
		},//Fim de success
		function fail(e){
			exibirMensagensDeErro(e,"matricula",'ERRO AO BUSCAR ',' - SERVER SIDE');
		},
		'POST'
	);//Fim de fazerRequisição
	$btnAlterar.textContent="Matricular";
};//Fim de alterar*/

function _removerMatricula(id){
	if ( id<=0 )
		alert('Id inválido para remoção.');
	else if (confirm('Confirma a exclusão desta matricula?')){
		let matricula = {};
		matricula.id = id;
		fazerRequisicaoAjax(_urlsAjaxMatricula.remove, {matricula: JSON.stringify(matricula)}, 
		function success(data){
			(!data.erro)? controle.tabela.update(): alert(data.mensagem);
		}, 
		function fail(e){
			exibirMensagensDeErro(e,"matricula",'ERRO AO REMOVER ',' - SERVER SIDE');
		},
		'POST'//Método HTTP
		);//Fim de fazerRequisicao
	}//Fim do else if
};//Fim de remover

function carregaFormulario(){
	carregarAnos(0);
	carregarAlunosMatricula();
	carregarCursosMatricula(0);
	carregarProfessoresMatricula(0);
}

function _validarMatricula(){
	let erros = 0;
	return erros;
}

/*function _validarCombos(){
	if(anoEscolhido>0 && turma_id>0 && disciplina_id>0 && professor_id>0){
	    controle.tabela.update();
	}
}*/

function limparCampos(){
	document.querySelector('#alunoid').value="";
	$("#alunoid").text("");
	$('#alunoid').focus();
}

