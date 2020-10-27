import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ChoreForm from "./ChoreForm";
import DataTable from "./DataTable";
import DeleteChoreModal from "./DeleteChoreModal";
import ZIndex from "react-z-index";
import { auth, database } from "../base";

ZIndex.setVars({
  Modal: 300,
  ChoreForm: 200,
  DataTable: 100,
});

export const Home = () => {
  const [chores, setChores] = useState([]);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [days, setDays] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowsIndices, setSelectedRowsIndices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const multiselectRef = useRef();
  const choreFormRef = useRef();

  useEffect(() => {
    const unsubscribe = database
      .collection(process.env.REACT_APP_FIRESTORE_COLLECTION)
      .onSnapshot((snapshot) => {
        const choresData = [];
        snapshot.forEach((doc) =>
          choresData.push({ ...doc.data(), id: doc.id })
        );
        choresData.sort((a, b) => {
          return parseInt(a.id) - parseInt(b.id);
        });
        setChores(choresData);
        const liveIds = choresData.map((chore) => parseInt(chore.id));
        const lastLiveId = Math.max(...liveIds);
        const nextId = liveIds.length > 0 ? lastLiveId + 1 : 0;
        setId(nextId);
      });
    auth.currentUser.getIdTokenResult().then((result) => {
      if (result.claims.user_id == process.env.REACT_APP_FIREBASE_ADMIN_UID) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleSaveClick = (e) => {
    e.preventDefault();
    const newChore = {
      title: title,
      message: message,
      days: days.map((day) => day.Day),
    };
    database
      .collection(process.env.REACT_APP_FIRESTORE_COLLECTION)
      .doc(id.toString())
      .set(newChore);
    setTitle("");
    setMessage("");
    setDays([]);
    multiselectRef.current.resetSelectedValues();
  };

  const handleRowsSelect = (currentRowsSelected, allRowsSelected) => {
    setSelectedRowsIndices(allRowsSelected.map((row) => row.index));
  };

  const handleRowsDelete = () => {
    setModalOpen(true);
  };

  const handleRowsDeleteConfirm = () => {
    const idsToDelete = selectedRowsIndices.map((index) => chores[index].id);
    idsToDelete.forEach((id) =>
      database
        .collection(process.env.REACT_APP_FIRESTORE_COLLECTION)
        .doc(id)
        .delete()
    );
    setModalOpen(false);
    setSelectedRowsIndices([]);
  };

  const handleRowEdit = (dataIndex) => {
    window.scrollTo(0, choreFormRef.current.offsetTop);
    setTitle(chores[dataIndex].title);
    setMessage(chores[dataIndex].message);
    setDays(chores[dataIndex].days.map((day) => ({ Day: day })));
    setId(chores[dataIndex].id);
  };

  return (
    <>
      <ZIndex index={ZIndex.vars.Modal}>
        <DeleteChoreModal
          open={modalOpen}
          onOkClick={handleRowsDeleteConfirm}
          onCancelClick={() => setModalOpen(false)}
        />
      </ZIndex>
      <AppBar position="static" className="session-header" color="transparent">
        <Toolbar>
          <div className="container">
            <div className="d-flex flex-row-reverse">
              <Button
                variant="contained"
                color="primary"
                className="text-white"
                onClick={() => auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <ZIndex index={ZIndex.vars.ChoreForm}>
        <ChoreForm
          choreFormRef={choreFormRef}
          title={title}
          titleChange={(e) => setTitle(e.target.value)}
          message={message}
          messageChange={(e) => setMessage(e.target.value)}
          days={days}
          daysSelect={(selectedList) => setDays(selectedList)}
          daysRemove={(selectedList) => setDays(selectedList)}
          multiselectRef={multiselectRef}
          save={handleSaveClick}
          enabled={isAdmin}
        />
      </ZIndex>
      <ZIndex index={ZIndex.vars.DataTable}>
        <DataTable
          chores={chores}
          selectedRows={handleRowsSelect}
          preSelectedRows={selectedRowsIndices}
          deleteRows={handleRowsDelete}
          editRow={handleRowEdit}
          adminAccess={isAdmin}
        />
      </ZIndex>
    </>
  );
};
