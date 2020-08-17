<?php

declare(strict_types=1);
require_once("cidade.php");

class Bairro{
	private $id = 0;
	private $descricao;
	private $cidade = null;

	function __construct(array $bairro = NULL){
		if(isset($bairro["id"])){
			$this->id = (int) $bairro["id"];
		}
		$this->descricao = $bairro["descricao"];
		$cidade = new Cidade($bairro["cidade"]);
		$this->cidade = $cidade;
	}

	public function setId(int $id){
		if($id>0)
			$this->id = $id;
	}

	public function getId():int{
		return $this->id;
	}

	public function setDescricao(string $descricao){
		if(strlen($descricao)>=5)
			$this->descricao = $descricao;
	}

	public function getDescricao():string{
		return $this->descricao;
	}

	public function setCidade(Cidade $cidade){
		$this->cidade = $cidade;
	}

	public function getCidade():Cidade{
		return $this->cidade;
	}
}

















?>