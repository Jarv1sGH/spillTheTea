import React from "react";
const SignInForm = (props) => {
  const {
    signInFormSubmit,
    signInInputChange,
    signInFormData,
    setForgotPassword,
  } = props;
  const onClickHandler = () => {
    setForgotPassword(true);
  };
  return (
    <div className=" formContainer signIn">
      <form  onSubmit={signInFormSubmit}>
        <h1>Sign In</h1>
        <label>
          <i className="fa-solid fa-envelope"></i>{" "}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signInFormData.email}
            onChange={signInInputChange}
            required
            autoComplete="off"
          />
        </label>
        <label>
          <i className="fa-solid fa-lock"></i>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={signInFormData.password}
            onChange={signInInputChange}
            required
            autoComplete="off"
          />
        </label>
        <p id="forgotPasswordText" onClick={onClickHandler}>
          Forgot your password?
        </p>
        <button type="submit">Log In</button>
      </form>
     </div>
  );
};

export default SignInForm;
