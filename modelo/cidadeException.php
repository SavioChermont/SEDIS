<?php  
	class CidadeException extends Exception
	{
		function  __construct($mensagem, $codigo= 0)
		{
			parent:: __construct($mensagem,$codigo);
		}
	}
?>