// import { useState } from "react";
// import axios from "axios";

// export default function Auth() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
//       const payload = isLogin ? { email, password } : { name, email, password };

//       const res = await axios.post(endpoint, payload);

//       alert(isLogin ? "Login successful!" : "Account created!");
//       console.log("User Token:", res.data.token);

//       // store token
//       localStorage.setItem("token", res.data.token);
//     } catch (err) {
//       alert("Error: " + err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleSubmit} style={styles.card}>
//         <h2>{isLogin ? "Login" : "Create Account"}</h2>

//         {!isLogin && (
//           <input
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={styles.input}
//           />
//         )}

//         <input
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//           required
//         />

//         <input
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//           required
//         />

//         <button type="submit" style={styles.button}>
//           {isLogin ? "Login" : "Register"}
//         </button>

//         <p
//           style={{ cursor: "pointer", marginTop: 10 }}
//           onClick={() => setIsLogin(!isLogin)}
//         >
//           {isLogin
//             ? "Don't have an account? Register"
//             : "Already have an account? Login"}
//         </p>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh",
//     background: "#f3f3f3",
//   },
//   card: {
//     width: 350,
//     padding: 25,
//     background: "white",
//     borderRadius: 10,
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//   },
//   input: {
//     width: "100%",
//     padding: 10,
//     margin: "10px 0",
//     borderRadius: 5,
//     border: "1px solid #ccc",
//   },
//   button: {
//     width: "100%",
//     padding: 12,
//     border: "none",
//     borderRadius: 5,
//     background: "#4CAF50",
//     color: "white",
//     fontWeight: "bold",
//     cursor: "pointer",
//   },
// };
import { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // CHANGE 1 & 2: Use full URL and correct endpoint names (/signup instead of /register)
      // Also added /v1/ to match the backend router prefix
      const baseURL = "http://localhost:8000/api/v1/auth";
      const endpoint = isLogin ? `${baseURL}/login` : `${baseURL}/signup`;

      // CHANGE 3: Backend expects 'full_name', not 'name'
      const payload = isLogin 
        ? { email, password } 
        : { full_name: name, email, password };

      const res = await axios.post(endpoint, payload);

      alert(isLogin ? "Login successful!" : "Account created!");
      
      // CHANGE 4: Backend returns 'access_token', not 'token'
      console.log("User Token:", res.data.access_token);

      // store token
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }
      
    } catch (err) {
      console.error(err);
      // specific error message handling for FastAPI validation errors
      const errorMessage = err.response?.data?.detail || "Something went wrong";
      alert("Error: " + errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        {!isLogin && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          style={{ cursor: "pointer", marginTop: 10 }}
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
    width: 350,
    padding: 25,
    background: "white",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
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