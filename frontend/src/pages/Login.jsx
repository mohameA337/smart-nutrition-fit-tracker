import { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
<<<<<<< Updated upstream

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
=======
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
>>>>>>> Stashed changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
<<<<<<< Updated upstream

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
=======
      const payload = isLogin ? { email, password } : { name, email, password };
>>>>>>> Stashed changes

      const res = await axios.post(endpoint, payload);

      alert(isLogin ? "Login successful!" : "Account created!");
<<<<<<< Updated upstream
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
=======
      console.log("User Token:", res.data.token);

      // store token
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert("Error: " + err.response?.data?.message || "Something went wrong");
>>>>>>> Stashed changes
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>{isLogin ? "Login" : "Create Account"}</h2>

<<<<<<< Updated upstream
        {/* Email */}
=======
        {!isLogin && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        )}

>>>>>>> Stashed changes
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

<<<<<<< Updated upstream
        {/* Password */}
=======
>>>>>>> Stashed changes
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
<<<<<<< Updated upstream
          style={{ cursor: "pointer", marginTop: 10, textAlign: "center" }}
=======
          style={{ cursor: "pointer", marginTop: 10 }}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    width: 380,
=======
    width: 350,
>>>>>>> Stashed changes
    padding: 25,
    background: "white",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 10,
<<<<<<< Updated upstream
    margin: "8px 0",
=======
    margin: "10px 0",
>>>>>>> Stashed changes
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
