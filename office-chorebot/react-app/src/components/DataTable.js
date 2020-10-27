/**
 * Data Table
 */
import React from "react";
import MUIDataTable from "mui-datatables";

// rct card box
import { Button } from "reactstrap";

class DataTable extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props === nextProps.props) {
      return false;
    } else {
      return true;
    }
  }

  handleRowsDelete = () => {
    this.props.deleteRows();
    return false;
  };

  render() {
    const columns = [
      "Title",
      "Message",
      "Days",
      {
        label: "Actions",
        options: {
          customBodyRenderLite: (dataIndex) => {
            return (
              <Button
                onClick={() => this.props.editRow(dataIndex)}
                disabled={!this.props.adminAccess}
              >
                Edit
              </Button>
            );
          },
        },
      },
    ];
    const data = this.props.chores.map((chore) => {
      try {
        return [chore.title, chore.message, chore.days.join(", ")];
      }
      catch {
      }
      
    });

    const options = {
      filter: false,
      filterType: "dropdown",
      responsive: "standard",
      download: false,
      print: false,
      search: false,
      viewColumns: false,
      rowsSelected: this.props.preSelectedRows,
      onRowSelectionChange: this.props.selectedRows,
      onRowsDelete: this.handleRowsDelete,
      selectableRows: this.props.adminAccess ? "multiple" : "none",
    };
    return (
      <div className="data-table-wrapper">
        <MUIDataTable
          title={"Live Chores"}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    );
  }
}

export default DataTable;
