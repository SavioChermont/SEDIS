<?php
	declare(strict_types=1);
	require_once("usuario.php");
	require_once("usuarioException.php");

class UsuarioDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	
	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT id,nome,cargo,CONCAT(
			'<button ',' onclick=\'buscaUsuarioParaAlterar(',id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeUsuario(',id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM usuario ORDER BY nome";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new UsuarioException("Erro ao listar usuários DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT * FROM usuario WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new UsuarioException("Erro ao obter usuário pelo id. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Usuario $usuario, array &$resposta){
		$this->sql="UPDATE usuario SET nome=:NOME,cargo=:CARGO,login=:LOGIN,senha=:SENHA WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":NOME",$usuario->getNome());
			$this->stmt->bindValue(":CARGO",$usuario->getCargo());
			$this->stmt->bindValue(":LOGIN", $usuario->getLogin());
			$this->stmt->bindValue(":SENHA", $usuario->getSenha());
			$this->stmt->bindValue(":ID",$usuario->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Usuario alterado com sucesso!";
		}catch(PDOException $e){
			throw new UsuarioException("Erro ao alterar usuário. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM usuario WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Usuario removido com sucesso!";
		}catch(PDOException $e){
			throw new UsuarioException("Erro ao remover usuário. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Usuario $usuario, array &$resposta)
	{
		$this->sql = "INSERT INTO usuario(nome,cargo,login,senha) values(:NOME,:CARGO,:LOGIN,:SENHA)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":NOME", $usuario->getNome());
			$this->stmt->bindValue(":CARGO", $usuario->getCargo());
			$this->stmt->bindValue(":LOGIN", $usuario->getLogin());
			$this->stmt->bindValue(":SENHA", $usuario->getSenha());
			$this->stmt->execute();
			$resposta["mensagem"] = "Curso cadastrado com sucesso!";
		}catch(PDOException $e){
			throw new UsuarioException("Erro ao cadastrar usuário. <br>{$e->getMessage()}", 1);
		}
	}

	public function loginUsuario(array $dadosLogin, array &$resposta){
		$login = $dadosLogin['login'];
		$senha = $dadosLogin['senha'];
		$sql = $this->sql = "SELECT id, login, nome FROM usuario WHERE login=:LOGIN AND senha=:SENHA";
		try{
			$this->stmt = $this->conexao->prepare($sql);
			$this->stmt->bindValue(":LOGIN", $login);
			$this->stmt->bindValue(":SENHA", $senha);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			if($this->stmt->rowCount() == 0){
				$resposta["mensagem"] = "Erro dados incorretos";
			}else{
				if(session_status() === PHP_SESSION_NONE){
					session_start();
					$_SESSION['loginSedis'] = $login; 
					$_SESSION['usuario_id'] = $resultado[0]["id"]; 
					$_SESSION['nomeDaSessao'] = "MinhaSessao";
					$_SESSION['ultima_atividade'] = time(); 
					$resposta["mensagem"] = "Sessao Criada com sucesso";
					$resposta["data"] = $resultado[0];
				}
			}
		}catch(PDOException $e){
			throw new UsuarioException("Erro ao logar usuário. <br>{$e->getMessage()}", 1);
		}
	}
	
	public function logoutUsuario(string $idSessao,array &$resposta){
		session_start();
		session_destroy();
		$resposta["mensagem"] = "Sessão encerrada com sucesso";
	}
}
?>
