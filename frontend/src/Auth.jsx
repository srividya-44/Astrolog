
import { useState } from "react";
import "./Auth.css";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const endpoint = isLogin
                ? "/login"
                : "/register";

            const response = await fetch(API_URL + endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    isLogin
                        ? { email, password }
                        : { name, email, password }
                )
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (isLogin) {
                onLogin(data.token, data.user);
            } else {
                setMessage("Registration successful! Please login.");

                setIsLogin(true);
                setName("");
                setPassword("");
            }

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1>🌌 AstroLog</h1>

                <p className="auth-subtitle">
                    Your Personal Space Observation Journal
                </p>

                <div className="auth-tabs">
                    <button
                        type="button"
                        className={isLogin ? "active" : ""}
                        onClick={() => {
                            setIsLogin(true);
                            setMessage("");
                        }}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className={!isLogin ? "active" : ""}
                        onClick={() => {
                            setIsLogin(false);
                            setMessage("");
                        }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password (minimum 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Create Account"}
                    </button>

                </form>

                {message && (
                    <p className="auth-message">{message}</p>
                )}

                <p className="auth-footer">
                    Explore. Observe. Record.
                </p>

            </div>
        </div>
    );
}

export default Auth;
