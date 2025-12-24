import { useRef, useState } from "react";
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

  // ✅ per-field errors (only for numeric fields)
  const [errors, setErrors] = useState({
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
  });

  // ✅ refs (to force user re-enter without clicking Register)
  const ageRef = useRef(null);
  const heightRef = useRef(null);
  const weightRef = useRef(null);
  const targetWeightRef = useRef(null);

  // ✅ validate on blur (when user leaves the input)
  const validatePositiveOnBlur = (field, rawValue, ref) => {
    const value = String(rawValue ?? "").trim();

    // if empty, let "required" handle it on submit
    if (value === "") {
      setErrors((p) => ({ ...p, [field]: "" }));
      return;
    }

    const n = Number(value);

    // invalid if NaN or <= 0
    if (!Number.isFinite(n) || n <= 0) {
      setErrors((p) => ({ ...p, [field]: "Invalid input, try again" }));

      // force user to fix it immediately
      setTimeout(() => {
        ref?.current?.focus();
        // optionally select text if any
        try {
          ref?.current?.select?.();
        } catch {}
      }, 0);
    } else {
      setErrors((p) => ({ ...p, [field]: "" }));
    }
  };

  // ✅ validate all numeric fields on submit too (safety)
  const validateAllNumbersBeforeSubmit = () => {
    const fields = [
      { key: "age", value: age, ref: ageRef },
      { key: "height", value: height, ref: heightRef },
      { key: "weight", value: weight, ref: weightRef },
      { key: "targetWeight", value: targetWeight, ref: targetWeightRef },
    ];

    for (const f of fields) {
      const v = String(f.value ?? "").trim();
      const n = Number(v);

      if (v === "" || !Number.isFinite(n) || n <= 0) {
        setErrors((p) => ({ ...p, [f.key]: "Invalid input, try again" }));
        setTimeout(() => f.ref.current?.focus(), 0);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      // if any errors exist OR numbers invalid => don't submit
      const hasErrors = Object.values(errors).some((x) => !!x);
      if (hasErrors) return;

      const ok = validateAllNumbersBeforeSubmit();
      if (!ok) return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      const payload = isLogin
        ? { email, password }
        : {
            email,
            password,
            name,
            gender,
            age: Number(age),
            height: Number(height),
            weight: Number(weight),
            targetWeight: Number(targetWeight),
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
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>
          {isLogin ? "Login" : "Create Account"}
        </h2>

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
              ref={ageRef}
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onBlur={(e) => validatePositiveOnBlur("age", e.target.value, ageRef)}
              style={{
                ...styles.input,
                border: errors.age ? "1px solid red" : "1px solid #ccc",
              }}
              required
            />
            {errors.age ? <div style={styles.error}>{errors.age}</div> : null}

            {/* Height */}
            <input
              ref={heightRef}
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onBlur={(e) =>
                validatePositiveOnBlur("height", e.target.value, heightRef)
              }
              style={{
                ...styles.input,
                border: errors.height ? "1px solid red" : "1px solid #ccc",
              }}
              required
            />
            {errors.height ? (
              <div style={styles.error}>{errors.height}</div>
            ) : null}

            {/* Weight */}
            <input
              ref={weightRef}
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onBlur={(e) =>
                validatePositiveOnBlur("weight", e.target.value, weightRef)
              }
              style={{
                ...styles.input,
                border: errors.weight ? "1px solid red" : "1px solid #ccc",
              }}
              required
            />
            {errors.weight ? (
              <div style={styles.error}>{errors.weight}</div>
            ) : null}

            {/* Target Weight */}
            <input
              ref={targetWeightRef}
              type="number"
              placeholder="Target Weight (kg)"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              onBlur={(e) =>
                validatePositiveOnBlur(
                  "targetWeight",
                  e.target.value,
                  targetWeightRef
                )
              }
              style={{
                ...styles.input,
                border: errors.targetWeight ? "1px solid red" : "1px solid #ccc",
              }}
              required
            />
            {errors.targetWeight ? (
              <div style={styles.error}>{errors.targetWeight}</div>
            ) : null}

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
          onClick={() => {
            setIsLogin(!isLogin);

            // clear errors when switching modes
            setErrors({ age: "", height: "", weight: "", targetWeight: "" });
          }}
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
    outline: "none",
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
    marginTop: 6,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
    marginBottom: 6,
  },
};
