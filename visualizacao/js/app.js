// INICIAR
$(document).ready(function(){

	document.querySelector('#usuarioLogado').textContent = localStorage.getItem('nome');
	document.querySelector('#bemVindo').textContent = localStorage.getItem('nome');

	$.get('../modelo/verificaSessao.php', function(data) {
     if( data == "expirou" ) {
         window.location.href =  "tela-login.html";
     }else{
     	initCarometro();
     }
 	});

	
	$("#carometro").click(function() {
		initCarometro();
	});
	$("#contatos").click(function() {
		initCarometro();
	});

	$("#matriculas").click(function() {
		initMatricula();
		//carregaFormulario();
	});

	$("#ocorrencias").click(function() {
		initOcorrencia();
	});

	$("#professores").click(function(){
		initProfessor();
	});

	$("#cidades").click(function(){
		initCidade();
	});

	$("#bairros").click(function(){
		initBairro();
	});

	$("#cursos").click(function(){
		initCurso();
	});

	$("#usuarios").click(function(){
		initUsuario();
	});

	$("#disciplinas").click(function(){
		initDisciplina();
	});

	$("#alunos").click(function(){
		initAluno();
	});

	$("#turmas").click(function(){
		initTurma();
	});
});

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var username = getCookie("Sessão");
  if (username != "") {
     initCarometro();
  } else {
  	window.location.href =  "tela-login.html";
  }
    /*usernam
    e = prompt("Please enter your name:", "");
    if (username != "" && username != null) {
      setCookie("username", username, 365);
    }*/
}