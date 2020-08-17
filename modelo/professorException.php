<?php  
	class ProfessorException extends Exception
	{
		function  __construct($mensagem, $codigo= 0)
		{
			parent:: __construct($mensagem,$codigo);
		}
	}
?>