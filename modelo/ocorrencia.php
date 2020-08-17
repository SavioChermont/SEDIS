<?php

declare(strict_types=1);
require_once("aluno.php");
require_once("usuario.php");

class Ocorrencia{
	private $id = 0;
	private $descricao;
	private $aluno = null;
	private $usuario = null;
	private $dataOcorrencia;

	function __construct(array $ocorrencia = NULL){
		if(isset($ocorrencia["id"])){
			$this->id = (int) $ocorrencia["id"];
		}
		$this->descricao = $ocorrencia["descricao"];
		$aluno = new Aluno();
		$aluno->setId((int) $ocorrencia["aluno"]["id"]);
		$this->aluno = $aluno;
		$usuario = new Usuario($ocorrencia["usuario"]);
		$this->usuario = $usuario;
		$this->dataOcorrencia = new DateTime($ocorrencia["dataOcorrencia"]);
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

	public function setAluno(Aluno $aluno){
		$this->aluno = $aluno;
	}

	public function getAluno():Aluno{
		return $this->aluno;
	}

	public function setUsuario(Usuario $usuario){
		$this->usuario = $usuario;
	}

	public function getUsuario():Usuario{
		return $this->usuario;
	}

	 public function setDataOcorrencia(DateTime $dataOcorrencia){
      $this->dataOcorrencia = $dataOcorrencia;
    }

    public function getDataOcorrencia():DateTime{
      return $this->dataOcorrencia;
    }
}

?>