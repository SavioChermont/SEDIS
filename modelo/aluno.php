<?php
  declare(strict_types=1);
  require_once("bairro.php");
  class Aluno{
  	private $id = 0;
  	private $nome;
  	private $email;
    private $matricula;
    private $bairro = null;
    private $repetente;
    private $problemaSaude;
    private $dataNascimento;
    private $foto;
    //Alterado em 30/09 
    private $telefones = array();

  	function __construct(array $aluno = NULL){
  		if(isset($aluno["id"])){
        $this->id = (int) $aluno["id"];
      }
      if(isset($aluno)){
        $this->nome = $aluno["nome"];
        $this->email = $aluno["email"];
        $this->matricula = $aluno["matricula"];
        $bairro = new Bairro($aluno["bairro"]);
        $this->bairro = $bairro;
        $this->repetente = (int) $aluno["repetente"];
        $this->problemaSaude = $aluno["problema_saude"];
        $this->dataNascimento = new DateTime($aluno["nascimento"]);
        $this->foto = $aluno["foto"];
       //Alterado em 30/09 
        $this->telefones = $aluno["telefones"];
      }
      
  	}

    //Alterado em 30/09 
    public function setTelefones(array $telefones){
      $this->telefones = $telefones;
    }
    //Alterado em 30/09 
    public function getTelefones():array{
      return $this->telefones;
    }

  	public function setId(int $id){
  		if($id>0)
  			$this->id = $id;
  	}

  	public function getId():int{
  		return $this->id;
  	}

  	public function setNome(string $nome){
  		if(strlen($nome)>=5)
  			$this->nome = $nome;
  	}

  	public function getNome():string{
  		return $this->nome;
  	}

    public function setMatricula(string $matricula){
      if(strlen($matricula)>=5)
        $this->matricula = $matricula;
    }

    public function getMatricula():string{
      return $this->matricula;
    }

  	public function setEmail(string $email){
  		if(!strripos($email, "@")===false)
  			$this->email = $email;
  	}

  	public function getEmail():string{
  		return $this->email;
  	}

    public function setBairro(Bairro $bairro){
      $this->bairro = $bairro;
    }

    public function getBairro():Bairro{
      return $this->bairro;
    }

    public function setRepetente(int $repetente){
      $this->repetente = $repetente;
    }

    public function getRepetente():int{
      return $this->repetente;
    }

    public function setProblemaSaude(string $problemaSaude){
      $this->problemaSaude = $problemaSaude;
    }

    public function getProblemaSaude():string{
      return $this->problemaSaude;
    }

    public function setDataNascimento(DateTime $dataNascimento){
      $this->dataNascimento = $dataNascimento;
    }

    public function getDataNascimento():DateTime{
      return $this->dataNascimento;
    }

    public function setFoto(string $foto){
      $this->foto = $foto;
    }

    public function getFoto():string{
      return $this->foto;
    }

  }
?>