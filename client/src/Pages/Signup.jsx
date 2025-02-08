function Signup() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", borderRadius: "10px" }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>

        <form>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>

          <div className="text-center mt-3">
            <small>or sign up with</small>
          </div>

          <button className="btn btn-danger w-100 mt-2">
            <i className="bi bi-google"></i> Sign up with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
