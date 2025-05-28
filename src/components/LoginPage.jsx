import { useState } from "react";
import "./LoginPage.css"; // Arquivo CSS que criaremos

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simular verificação de login (você pode substituir por sua lógica real)
    setTimeout(() => {
      // Aqui você pode adicionar validação real de usuário/senha
      // Por exemplo: verificar se username === 'admin' && password === '123456'

      fetch("http://127.0.0.1:3000/usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.username.trim(),
          senha: formData.password.trim(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id);
          console.log({ data });
          onLogin(formData);
        })
        .catch((error) => {
          console.error("Erro:", error);
          setError("Usuário ou senha incorretos");
        });

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Lista de Tarefas</h1>
          <p>Entre na sua conta</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu usuário"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        <div className="register-help">
          <p>Ainda não tem uma conta? </p>
          <button type="button" className="link-button" disabled={isLoading}>
            Faça registro aqui
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
