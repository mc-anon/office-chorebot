import React from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function DeleteChoreModal(props) {
  const classes = useStyles();
  const modalStyle = getModalStyle();

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Delete chore(s)</h2>
      <p id="simple-modal-description">
        Are you sure you want to delete? Click OK to confirm.
      </p>
      <Button
        variant="contained"
        color="primary"
        type="button"
        onClick={props.onOkClick}
      >
        OK
      </Button>
      <Button
        variant="contained"
        color="secondary"
        type="button"
        onClick={props.onCancelClick}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <div>
      <Modal
        open={props.open}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
