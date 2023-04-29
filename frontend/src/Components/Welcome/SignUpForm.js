import React from "react";
const SignUpForm = (props) => {
  const {
    signUpFormSubmit,
    signUpFormData,
    signUpInputChange,
    handleFileInputChange,
    fileInputRef,
  } = props;
  return (
    <div className=" formContainer signUp">
      <form onSubmit={signUpFormSubmit}>
        <h1>Sign Up</h1>
        <label>
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            name="name"
            placeholder="Name*"
            value={signUpFormData.name}
            onChange={signUpInputChange}
            pattern=".{3,}"
            title="Name must be atleast 3 characters"
            required
            autoComplete="off"
          />
        </label>
        <label>
          <i className="fa-solid fa-envelope"></i>
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={signUpFormData.email}
            onChange={signUpInputChange}
            required
            autoComplete="off"
          />
        </label>
        <label>
          <i className="fa-solid fa-lock"></i>
          <input
            name="password"
            type="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
            placeholder="Password*"
            value={signUpFormData.password}
            onChange={signUpInputChange}
            required
            autoComplete="off"
            title="password must be Alpha-Numeric, 8+ characters long and contain atleast 1 special character."
          />
        </label>
        <p id="passwordCriteria">
          (password must be Alpha-Numeric, 8+ characters long and contain 1
          special character.)
        </p>
        <label>
          <i className="fa-regular fa-image"></i>
          <input
            type="file"
            name="profilePic"
            onChange={handleFileInputChange}
            ref={fileInputRef}
            autoComplete="off"
          />
        </label>
        <button type="submit" style={{ marginTop: "9px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
