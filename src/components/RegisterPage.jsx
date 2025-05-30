import { useState } from "react";
import "./LoginPage.css"; // Usando o mesmo CSS da página de login

const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    // Validação de campos obrigatórios
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Por favor, preencha todos os campos");
      return false;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um email válido");
      return false;
    }

    // Validação de senha (mínimo 6 caracteres)
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    // Validação de confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    // Validação de nome de usuário (mínimo 3 caracteres)
    if (formData.username.trim().length < 3) {
      setError("O nome de usuário deve ter pelo menos 3 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    // Simular registro (você pode substituir por sua lógica real)
    setTimeout(() => {
      fetch("http://127.0.0.1:3000/usuario/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.username.trim(),
          email: formData.email.trim(),
          senha: formData.password.trim(),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro no servidor");
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id);
          console.log("Registro bem-sucedido:", data);
          onRegister(formData);

          // Limpar formulário
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          // Chamar callback se fornecido
          if (onRegister) {
            onRegister(data);
          }

          // Opcional: redirecionar para login após alguns segundos
          setTimeout(() => {
            if (onSwitchToLogin) {
              onSwitchToLogin();
            }
          }, 2000);
        })
        .catch((error) => {
          console.error("Erro no registro:", error);
          setError(
            "Erro ao criar conta. Tente novamente ou verifique se o usuário já existe."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Lista de Tarefas</h1>
          <p>Crie sua conta</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu nome de usuário"
              disabled={isLoading}
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Digite seu email"
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
              placeholder="Digite sua senha (mín. 6 caracteres)"
              disabled={isLoading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirme sua senha"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </button>
        </div>

        <div className="login-help">
          <p>
            Já tem uma conta?{" "}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Faça login aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
