import { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityRate, setActivityRate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      const payload = isLogin
        ? { email, password }
        : {
            email,
            password,
            name,
            gender,
            age,
            height,
            weight,
            targetWeight,
            activityRate,
          };

      const res = await axios.post(endpoint, payload);

      alert(isLogin ? "Login successful!" : "Account created!");
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        {/* Email */}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        {/* Password */}
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        {!isLogin && (
          <>
            {/* Name */}
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            {/* Gender */}
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={styles.input}
              required
            >
              <option value="" hidden>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* Age */}
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={styles.input}
              required
            />

            {/* Height */}
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              style={styles.input}
              required
            />

            {/* Weight */}
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={styles.input}
              required
            />

            {/* Target Weight */}
            <input
              type="number"
              placeholder="Target Weight (kg)"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              style={styles.input}
              required
            />

            {/* Activity Rate */}
            <select
              value={activityRate}
              onChange={(e) => setActivityRate(e.target.value)}
              style={styles.input}
              required
            >
              <option value="" hidden>
                Activity Rate
              </option>
              <option value="low">Low Activity</option>
              <option value="moderate">Moderate Activity</option>
              <option value="high">High Activity</option>
            </select>
          </>
        )}

        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          style={{ cursor: "pointer", marginTop: 10, textAlign: "center" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f3f3f3",
  },
  card: {
    width: 380,
    padding: 25,
    background: "white",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 5,
    background: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
