var temporizador = setInterval(function() {
    $.get('../modelo/verificaSessao.php', function(data) {
     if( data == "expirou" ) {
         window.location.href =  "tela-login.html";
     }
 });
}, 180 * 1000); //Verifica a cada 20 segundos





