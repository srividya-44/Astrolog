
import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./Auth";

const API_URL = "http://localhost:5000/api/observations";

function App() {
    const [observations, setObservations] = useState([]);

    const [formData, setFormData] = useState({
        objectName: "",
        category: "Planet",
        date: "",
        description: "",
    });

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // LOGIN
    function handleLogin(receivedToken, userData) {
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(receivedToken);
        setUser(userData);
        setObservations([]);
        setMessage("");
    }

    // LOGOUT
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
        setObservations([]);
        setEditId(null);
        setMessage("");

        setFormData({
            objectName: "",
            category: "Planet",
            date: "",
            description: "",
        });
    }

    // FETCH OBSERVATIONS
    async function fetchObservations() {
        if (!token) return;

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.status === 401) {
                handleLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to load observations");
            }

            setObservations(data);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // LOAD OBSERVATIONS AFTER LOGIN
    useEffect(() => {
        if (token) {
            fetchObservations();
        }
    }, [token]);

    // FORM INPUT CHANGE
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    // ADD OR UPDATE OBSERVATION
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage("");

            const url = editId
                ? `${API_URL}/${editId}`
                : API_URL;

            const response = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.status === 401) {
                handleLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to save observation");
            }

            setFormData({
                objectName: "",
                category: "Planet",
                date: "",
                description: "",
            });

            setEditId(null);

            setMessage(
                editId
                    ? "Observation updated successfully!"
                    : "Observation saved successfully!"
            );

            await fetchObservations();

        } catch (error) {
            setMessage(error.message);
        }
    }

    // EDIT OBSERVATION
    function handleEdit(item) {
        setFormData({
            objectName: item.objectName,
            category: item.category,
            date: item.date,
            description: item.description,
        });

        setEditId(item._id);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // DELETE OBSERVATION
    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this observation?"
        );

        if (!confirmDelete) return;

        try {
            setMessage("");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.status === 401) {
                handleLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete observation");
            }

            setMessage("Observation deleted successfully!");

            await fetchObservations();

        } catch (error) {
            setMessage(error.message);
        }
    }

    // FORMAT DATE
    function formatDate(date) {
        if (!date) return "";

        return new Date(date + "T00:00:00").toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    }

    // SHOW LOGIN / REGISTER PAGE
    if (!token) {
        return <Auth onLogin={handleLogin} />;
    }

    // MAIN DASHBOARD
    return (
        <div className="app">

            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">
                    <span>✦</span> AstroLog
                </div>

                <div className="nav-text">
                    My Space Journal
                </div>

                <div className="nav-user">
                    {user && <span>Welcome, {user.name}</span>}

                    <button className="logout-btn"onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">

                    <p className="tagline">
                        YOUR PERSONAL UNIVERSE
                    </p>

                    <h1>
                        Explore. <span>Observe.</span>
                        <br />
                        Record.
                    </h1>

                    <p className="hero-description">
                        Every observation tells a story.
                        Keep your journey through the universe
                        alive with AstroLog.
                    </p>

                    <a href="#observation-form" className="hero-button">
                        + Add New Observation
                    </a>

                </div>

                <div className="hero-visual">
                    <div className="planet">🪐</div>
                    <div className="orbit orbit-one"></div>
                    <div className="orbit orbit-two"></div>
                    <div className="star star-one">✦</div>
                    <div className="star star-two">✧</div>
                    <div className="star star-three">✦</div>
                </div>
            </section>

            {/* Observation Form */}
            <section className="form-section" id="observation-form">

                <div className="section-heading">

                    <p className="tagline">
                        START YOUR JOURNEY
                    </p>

                    <h2>
                        {editId
                            ? "Edit Observation"
                            : "Add New Observation"}
                    </h2>

                    <p>
                        Record what you discovered in the night sky.
                    </p>

                </div>

                <form
                    className="observation-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label>Celestial Object</label>

                        <input
                            type="text"
                            name="objectName"
                            placeholder="Example: Jupiter"
                            value={formData.objectName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option>Planet</option>
                            <option>Natural Satellite</option>
                            <option>Star</option>
                            <option>Constellation</option>
                            <option>Galaxy</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Observation Date</label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Describe what you observed..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-buttons">

                        <button
                            type="submit"
                            className="save-button"
                        >
                            {editId
                                ? "Update Observation"
                                : "✦ Save Observation"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {
                                    setEditId(null);

                                    setFormData({
                                        objectName: "",
                                        category: "Planet",
                                        date: "",
                                        description: "",
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </section>

            {/* Observations */}
            <section className="observations-section">

                <div className="section-heading">

                    <p className="tagline">
                        YOUR DISCOVERIES
                    </p>

                    <h2>My Observations</h2>

                    <p>
                        Your personal collection of cosmic discoveries.
                    </p>

                </div>

                <div className="observation-count">
                    Total Observations: {observations.length}
                </div>

                {message && (
                    <p className="api-message">
                        {message}
                    </p>
                )}

                {loading ? (
                    <div className="empty-state">
                        <h3>Loading your observations...</h3>
                    </div>
                ) : observations.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">🔭</div>

                        <h3>No observations yet</h3>

                        <p>
                            Your universe is waiting to be explored.
                            Add your first observation!
                        </p>

                    </div>

                ) : (

                    <div className="observation-grid">

                        {observations.map((item) => (

                            <div
                                className="observation-card"
                                key={item._id}
                            >

                                <div className="card-top">

                                    <span className="card-icon">✦</span>

                                    <span className="category">
                                        {item.category}
                                    </span>

                                </div>

                                <h3>{item.objectName}</h3>

                                <p className="date">
                                    📅 {formatDate(item.date)}
                                </p>

                                <p className="description">
                                    {item.description}
                                </p>

                                <div className="card-buttons">

                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            {/* Footer */}
            <footer>
                <p>
                    ✦ AstroLog – Explore the universe,
                    one observation at a time.
                </p>
            </footer>

        </div>
    );
}

export default App;
