import React, { Component } from 'react';
import CreditService from '../../services/CreditCardService';
import MoneyConverter from '../../utilities/MoneyConverter';
import SweetAlert from 'react-bootstrap-sweetalert';
const moment = require('moment');
moment().format();

class AllTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      transactionNum: '',
      alert: null,
      id: '',
      name: '',
      value: '',
      paidDate: '',
      totalRows: '',
      page: 1,
      rowSize: 10,
      total: ''
    };
  }

  componentDidMount() {
    CreditService.getAll(this.onGetAllSuccess, this.onError);
    CreditService.selectTAll(this.state.page, this.state.rowSize, this.onTallSuccess, this.onTallError);
  }

  onTallSuccess = response => this.setState({ transactions: response.data.items });

  onTallError = response => console.error(response);

  onChange = evt => {
    const key = evt.target.name;
    const val = evt.target.value;
    this.setState({ [key]: val });
  }

  onPageSuccess = response => this.setState({ transactions: response.data.items });

  onGetAllSuccess = response => {
    let lastPage = Math.ceil(response.data.items.length / this.state.rowSize);
    this.setState({ total: lastPage });
  }

  onAllError = response => console.error(response);

  searchSuccess = response => {
    if (!this.state.transactionNum.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
      this.searchError()
    } else {
      let uDate = moment(response.data.item.paidDate).format('MM/DD/YYYY h:mm A');
      let fullName = (response.data.item.firstName + ' ' + response.data.item.lastName);
      this.setState({
        id: response.data.item.paymentId,
        name: fullName,
        transactionNum: response.data.item.transactionNum,
        value: response.data.item.value,
        paidDate: uDate
      }, this.handleSweetAlert);
    }
  }

  searchError = () => {
    const showAlert = () => (
      <SweetAlert
        warning
        confirmBtnText="Okay"
        confirmBtnBsStyle="warning"
        title="Please enter a transaction #"
        onConfirm={() => this.hideAlert()}
      >
      </SweetAlert>
    );
    this.setState({ alert: showAlert() });
  }

  handlePrevPage = () => {
    const prevPage = this.state.page;
    if (prevPage === 1) {
      return false;
    } else {
      this.setState({ ...this.state, page: prevPage - 1 },
        () => {
          CreditService.selectTAll(this.state.page, this.state.rowSize, this.onPageSuccess, this.onError);
        }
      );
    }
  }

  handleNextPage = () => {
    const arrayLength = this.state.transactions.length;
    const nextPage = this.state.page;
    const rowSize = this.state.rowSize;
    if (arrayLength < rowSize) {
      return false;
    } else {
      this.setState({ ...this.state, page: nextPage + 1 },
        () => {
          CreditService.selectTAll(this.state.page, this.state.rowSize, this.onPageSuccess, this.onError);
        }
      );
    }
  }

  onError = err => console.error(err);

  handleSweetAlert = () => {
    let fDate = moment(this.state.paidDate).format('MM/DD/YYYY h:mm A');
    let cMoney = MoneyConverter.CentsIntoDollars(this.state.value)
    const showAlert = () => (
      <SweetAlert
        info
        confirmBtnText="Cool Thanks!"
        confirmBtnBsStyle="success"
        title=""
        onConfirm={() => this.hideAlert()}
      >
        <p>Id: {this.state.id}</p>
        <p>Transaction#: {this.state.transactionNum}</p>
        <p>User Name: {this.state.name}</p>
        <p>Paid Amount: {cMoney}</p>
        <p>Paid Date: {fDate}</p>
      </SweetAlert>
    );
    this.setState({ alert: showAlert() });
  }

  hideAlert() {
    this.setState({ alert: null });
  }

  render() {
    const list = this.state.transactions.map(item => {
      let pDate = moment(item.paidDate).format('MM/DD/YYYY h:mm A');
      let cMoney = MoneyConverter.CentsIntoDollars(item.value);
      return <tr key={item.paymentId}
        className="col-s-6 col-md-6 col-lg-6">
        <td>{item.paymentId}</td>
        <td>{item.firstName} {item.lastName}</td>
        <td>{cMoney}</td>
        <td>{pDate}</td>
      </tr >
    });
    return (
      <React.Fragment>
        {this.state.alert}
        <div className="container-fluid flex-grow-1 container-p-y">
          <div className="card mb-4 fixed-table-container">
            <h6 className="card-header">Payment List</h6>
            <div className="card-body">
              <div className="input-group">
                <label className="form-label" htmlFor='promoCode'>Transaction #:</label>
                <div className="input-group">
                  <input
                    name="transactionNum"
                    type="text"
                    value={this.state.transactionNum}
                    onChange={this.onChange}
                    className="form-control"
                  />
                  <span className="input-group-append">
                    <button className="btn btn-success btn-sm"
                      onClick={() => {
                        CreditService.searchByTNum(
                          this.state.transactionNum,
                          this.searchSuccess,
                          this.searchError)
                      }}
                    >
                      Search for Transaction</button>
                  </span>
                </div>
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Plan Amount</th>
                    <th scope="col">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {list}
                </tbody>
              </table>
              <div style={{ textAlign: "right" }}>
                <button
                  type="button"
                  className="btn btn-default borderless md-btn-flat icon-btn text-muted form-control"
                  name="page"
                  onClick={this.handlePrevPage}
                >
                  <i className="ion ion-ios-arrow-back" />
                </button>
                <label className="form-label" style={{ margin: "10px" }}>
                  Page {this.state.page} out of {this.state.total}
                </label>
                <button
                  className="btn btn-default borderless md-btn-flat icon-btn text-muted form-control"
                  name="page"
                  onClick={this.handleNextPage}
                >
                  <i className="ion ion-ios-arrow-forward" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment >
    );
  }
}

export default AllTransactions;