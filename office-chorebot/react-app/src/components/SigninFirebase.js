import React, { useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { auth } from "../base";
import { AuthContext } from "../Auth.js";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import { Form, FormGroup, Input } from "reactstrap";
import QueueAnim from "rc-queue-anim";

const Signin = ({ history }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSignin = async (event) => {
    event.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      history.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <QueueAnim type="bottom" duration={2000}>
      <div className="rct-session-wrapper">
        <AppBar position="static" className="session-header"></AppBar>
        <div className="session-inner-wrapper">
          <div className="container">
            <div className="d-flex justify-content-center">
              <div className="w-30">
                <div className="my-5">
                  <div className="session-body text-center">
                    <div className="session-head mb-30">
                      <h2 className="font-weight-bold">Squareball Slackbot</h2>
                      <p className="mb-4">Log in to manage messages</p>
                    </div>
                    <Form>
                      <FormGroup className="has-wrapper">
                        <Input
                          type="mail"
                          value={email}
                          name="user-mail"
                          id="user-mail"
                          className="has-input input-lg"
                          placeholder="Enter Email Address"
                          onChange={(event) => setEmail(event.target.value)}
                        />
                        <span className="has-icon">
                          <i className="ti-email"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="has-wrapper">
                        <Input
                          value={password}
                          type="Password"
                          name="user-pwd"
                          id="pwd"
                          className="has-input input-lg"
                          placeholder="Password"
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        <span className="has-icon">
                          <i className="ti-lock"></i>
                        </span>
                      </FormGroup>
                      <FormGroup className="mb-15">
                        <Button
                          color="primary"
                          className="btn-block text-white w-100"
                          variant="contained"
                          size="large"
                          onClick={handleSignin}
                        >
                          Sign In
                        </Button>
                      </FormGroup>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
};

export default withRouter(Signin);
