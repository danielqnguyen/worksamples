import React, { Component } from "react";
import ConfigService from "../../services/ConfigService";
import SweetAlert from "react-bootstrap-sweetalert";
import logo from "../../common/logo.png";

class PaymentOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: "",
      key: "",
      checked: false,
      alert: null
    };
  }

  componentDidMount() {
    ConfigService.getByKey("stripe_api_key_pk", this.onSuccess, this.onError);
  }

  onSuccess = response => this.setState({ key: response.data.item.configValue });

  onChange = evt => {
    const key = evt.target.name;
    const val = evt.target.value;
    this.setState({ [key]: val });
  }

  handleChange = () => {
    if (this.state.checked === false) {
      this.setState({ checked: true });
    } else {
      this.setState({ checked: false });
    };
  }

  handleClick = () => {
    if (this.state.checked === true) {
      this.setState({ plan: 5760 },
        this.sendToPayment
      );
    } else {
      this.setState({ plan: 1200 },
        this.sendToPayment
      );
    };
  }

  handleClickTwo = () => {
    if (this.state.checked === true) {
      this.setState({ plan: 9600 },
        this.sendToPayment
      );
    } else {
      this.setState({ plan: 2000 },
        this.sendToPayment
      );
    };
  }

  handleSweetAlert = () => {
    const showAlert = () => (
      <SweetAlert
        info
        confirmBtnText="Cool Thanks!"
        confirmBtnBsStyle="success"
        title=""
        onConfirm={() => this.hideAlert()}
      >
        Call This Number(NUMBER GOES HERE) to Get Started on a Custon Plan
      </SweetAlert>
    );
    this.setState({ alert: showAlert() });
  }

  hideAlert() {
    this.setState({ alert: null });
  }

  sendToPayment = () => this.props.history.push({
    pathname: "/payment/checkout",
    state: { plan: this.state.plan, key: this.state.key }
  })

  render() {
    return (
      <React.Fragment>
        {this.state.alert}
        <div className="container px-0">
          <div className="text-center">
            <img src={logo} alt="" style={{ width: "20vw", marginBottom: 15 }}></img>
            <h1>Pricing Plans</h1>
            <h4>Choose the best plan that fits your needs</h4>
            <div className="d-flex align-items-center my-5">
              <div className="flex-shrink-1 w-100 text-right text-big mr-3">Billed monthly</div>
              <label className="switcher switcher-lg switcher-success m-0 text-align-center">
                <input type="checkbox" className="switcher-input" onChange={this.handleChange} checked={this.state.checked} />
                <span className="switcher-indicator">
                  <span className="switcher-yes"></span>
                  <span className="switcher-no"></span>
                </span>
              </label>
              <div className="flex-shrink-1 w-100 text-left text-success text-big ml-3">Billed annually - Save 20%</div>
            </div>
          </div>
        </div>
        <br />
        <div className="row no-gutters row-bordered ui-bordered text-center">
          <div className="col-s-6 col-md-6 col-lg-4 d-flex col-md flex-column py-4 d-inline-block text-center">
            <span>
              <img src="http://icons.iconarchive.com/icons/icons8/ios7/256/Household-Toolbox-icon.png" alt="" height="75px" width="75px"></img>
            </span>
            <br />
            <h5>Single Organization</h5>
            <p>$<font size="22">12</font>/mo</p>
            <br />
            <p>5 Users</p>
            <p>10 Projects</p>
            <p>100GB space</p>
            <div className="px-md-3 px-lg-5">
              <button className="btn btn-outline-primary btn-lg btn-round"
                onClick={this.handleClick}
              >Get Started</button>
            </div>
          </div>
          <div className="col-s-6 col-md-6 col-lg-4 d-flex col-md flex-column py-4 d-inline-block text-center">
            <span>
              <img src="https://png.icons8.com/ios/1600/small-business.png" alt="" height="75px" width="75px"></img>
            </span>
            <br />
            <h5>Lead Organization with Partners</h5>
            <p>$<font size="22">20</font>/mo</p>
            <br />
            <p>20 Users</p>
            <p>100 Projects</p>
            <p>300GB space</p>
            <div className="px-md-3 px-lg-5">
              <button className="btn btn-outline-primary btn-lg btn-round"
                onClick={this.handleClickTwo}
              >Get Started</button>
            </div>
          </div>
          <div className="col-s-6 col-md-6 col-lg-4 d-flex col-md flex-column py-4 d-inline-block text-center">
            <span>
              <img src="http://cdn.onlinewebfonts.com/svg/img_327592.png" alt="" height="75px" width="75px"></img>
            </span>
            <br />
            <h5>Custom</h5>
            <hr height="10px; visibility:hidden;" />
            <p><font size="5">Call for Quote</font></p>
            <br />
            <p>Unlimited Users</p>
            <p>Unlimited Projects</p>
            <p>1000GB space</p>
            <div className="px-md-3 px-lg-5">
              <button className="btn btn-outline-primary btn-lg btn-round"
                onClick={this.handleSweetAlert}> Get Started</button>
            </div>
          </div>
        </div>
        <br />
        <br />
        <h4 className="text-center">Get started with a 90 day free trial</h4>
      </React.Fragment >
    );
  }
}

export default PaymentOptions;