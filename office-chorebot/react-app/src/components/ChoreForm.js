import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { daysData } from "../constants/daysData";

import Button from "@material-ui/core/Button";
import { Form, FormGroup } from "reactstrap";

export default class ChoreForm extends Component {
  render() {
    const isEnabled =
      this.props.title.length > 0 &&
      this.props.message.length > 0 &&
      this.props.days.length > 0;

    return (
      <div className="session-inner-wrapper" ref={this.props.choreFormRef}>
        <div className="container">
          <div className="my-5">
            <div className="session-body text-center">
              <div className="session-head mb-30">
                <h2 className="font-weight-bold">Add Chore</h2>
              </div>
              <div className="container-fluid">
                <Form>
                  <FormGroup className="has-wrapper">
                    <div className="col">
                      <input
                        id="text"
                        name="chore-title"
                        placeholder="Title"
                        type="text"
                        className="form-control"
                        required="required"
                        value={this.props.title}
                        onChange={this.props.titleChange}
                        disabled={!this.props.enabled}
                      />
                    </div>
                  </FormGroup>
                  <FormGroup className="has-wrapper">
                    <div className="col">
                      <textarea
                        id="textarea"
                        name="chore-message"
                        placeholder="Message"
                        rows="2"
                        className="form-control"
                        required="required"
                        value={this.props.message}
                        onChange={this.props.messageChange}
                        disabled={!this.props.enabled}
                      ></textarea>
                    </div>
                  </FormGroup>
                  <FormGroup className="has-wrapper">
                    <div className="col">
                      <Multiselect
                        style={{
                          multiselectContainer: {
                            zIndex: 2000000,
                          },
                        }}
                        placeholder="Select Days"
                        hidePlaceholder="true"
                        selectedValues={this.props.days}
                        options={daysData}
                        displayValue="Day"
                        onSelect={this.props.daysSelect}
                        onRemove={this.props.daysRemove}
                        ref={this.props.multiselectRef}
                        disable={!this.props.enabled}
                      />
                    </div>
                  </FormGroup>
                  <FormGroup className="mb-15">
                    <div className="col">
                      <Button
                        name="chore-save"
                        color="primary"
                        type="submit"
                        variant="contained"
                        size="large"
                        className="text-white w-100"
                        onClick={this.props.save}
                        disabled={(!isEnabled && this.props.enabled) || !this.props.enabled}
                      >
                        Save
                      </Button>
                    </div>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
