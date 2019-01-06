import React from 'react';
import CreditService from '../../services/CreditCardService';
import MoneyConverter from '../../utilities/MoneyConverter';
import PrintComponents from "react-print-components";
import UsersServices from '../../services/UsersService';
import OrganizationService from '../../services/OrganizationService'
import logo from '../../common/logo.png'
const moment = require('moment');
moment().format();

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      email: '',
      value: '',
      transactionNum: '',
      promoCode: '',
      paid: '',
      paidDate: '',
      iDate: '',
      cPercent: '',
      orgName: ''
    };
  }

  componentDidMount() {
    if (!("emailData" in this.props.location)) {
      this.props.history.push('/payment/plans');
      alert('returning to previous page');
    } else {
      const trans = this.props.location;
      let cValue = MoneyConverter.CentsIntoDollars(trans.emailData.value);
      let cPaid = MoneyConverter.CentsIntoDollars(trans.emailData.paid);
      this.setState({
        firstName: trans.emailData.firstName,
        email: trans.emailData.email,
        value: cValue,
        promoCode: trans.emailData.promoCode,
        paid: cPaid,
      });
      CreditService.selectById(trans.id, response => {
        const payInfo = response.data.item;
        let pDate = moment(payInfo.paidDate).format('MM/DD/YYYY h:mm A');
        let iDate = moment(payInfo.paidDate).format("MM-DD-YYYY")
        this.setState({ transactionNum: response.data.item.transactionNum, paidDate: pDate, iDate: iDate })
      }, error => console.error(error));
      UsersServices.getCurrent(
        response => {
          OrganizationService.selectById(response.data.orgId[0],
            response => {
              this.setState({ orgName: response.DisplayName });
            }, error => console.error(error))
          const { transactionNum, firstName, email, paid, value, promoCode, paidDate } = this.state;
          const eData = { firstName: firstName, email: email, transactionNum: transactionNum, paid: paid, value: value, promoCode: promoCode, paidDate: paidDate }
          CreditService.sendPayEmail(eData, this.onSentSuccess, this.onError);
        }, error => console.error(error)
      );
    };
  }

  onSentSuccess = () => '';

  onError = error => console.error(error);

  render() {
    return (
      <React.Fragment>
        <h2>Payment Successful!</h2>
        <p>Order #: {this.state.transactionNum}</p>
        <p>Price : {this.state.paid}</p>
        <p>Order Date: {this.state.paidDate}</p>
        <p>If you have any question please contact us with your Transaction # ready</p>
        <p>An email has been sent to you</p>
        <PrintComponents
          trigger={<button className="btn btn-success"><i className="ion ion-md-print"></i> Print</button>}
        >
          <div style={{ margin: "auto", width: "500px", height: "auto", color: "#666" }}>
            <img src={logo} alt="" style={{ width: "20vw" }}></img>
            <div style={{ width: "100%", padding: "10px", float: "left", background: "#1ca8dd", color: "#fff", fontSize: "30px", textAlign: "center" }}>
              Invoice
            </div>
            <div style={{ width: "100%", padding: "0px 0px", borderBottom: "1px solid black", float: "left" }}>
              <div style={{ width: "40%", float: "left", padding: "10px" }}>
                <span style={{ fontSize: "14px", float: "left", width: "100%" }}>
                  Name: {this.state.firstName}
                </span>
                <span style={{ fontSize: "14px", float: "left", width: "100%" }}>
                  Organization: {this.state.orgName}
                </span>
                <span style={{ fontSize: "14px", float: "left", width: "100%" }}>
                  {this.state.email}
                </span>
              </div>
              <div style={{ width: "50%", float: "right" }}>
                <span style={{ fontSize: "14px", float: "right", padding: "10px", textAlign: "right" }}>
                  Date : {this.state.iDate}
                </span>
                <span style={{ fontSize: "10px", float: "right", padding: "10px", textAlign: "right" }}>
                  Order# : {this.state.transactionNum}
                </span>
              </div>
            </div>
            <div style={{ width: "100%", padding: "0px", float: "left" }}>
              <div style={{ width: "100%", float: "left", background: "#efefef" }}>
                <span style={{ float: "left", textAlign: "left", padding: "10px", width: "50%", color: "#888", }}>
                  Plan
                  </span>
                <span style={{ float: "left", padding: "10px", width: "50%", color: "#888", textAlign: "right" }}>
                  Amount
                </span>
              </div>
              <div style={{ width: "100%", float: "left" }}>
                <span style={{ float: "left", textAlign: "left", padding: "10px", width: "50%", color: "#888" }}>
                  Subscription
                  <span style={{ fontSize: "10px", float: "left", width: "100%" }} />
                </span>
                <span style={{ float: "left", padding: "10px", width: "50%", color: "#888", textAlign: "right" }}>
                  {this.state.value}
                </span>
              </div>
              <div style={{ width: "100%", float: "left" }}>
                <span style={{ float: "left", textAlign: "left", padding: "10px", width: "50%", color: "#888" }}>
                  Promotional Code
                  <span style={{ fontSize: "10px", float: "left", width: "100%" }} />
                </span>
                <span style={{ float: "left", padding: "10px", width: "50%", color: "#888", textAlign: "right" }}>
                  {this.state.promoCode}
                </span>
                <span style={{ float: "left", padding: "10px", width: "100%", color: "#888", textAlign: "right", background: "#fff" }}>
                  Total : {this.state.paid}
                </span>
              </div>
            </div>
          </div>
        </PrintComponents>
      </React.Fragment>
    );
  }
}

export default ConfirmationPage;