import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import CreditService from '../../services/CreditCardService';
import MoneyConverter from '../../utilities/MoneyConverter';
import { withRouter } from 'react-router-dom';
import UsersServices from '../../services/UsersService';
import ProfileDataService from '../../services/ProfileDataService'
import LoadingAnimation from './LoadingAnimation'
import logo from '../../common/logo.png'

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      paymentId: '',
      firstName: '',
      promoCode: '',
      paid: '',
      transactionNum: '',
      baseAmount: '',
      currency: 'usd',
      description: '',
      sourceId: '',
      value: '',
      oneCoupon: false,
      email: '',
      loading: null
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    UsersServices.getCurrent(
      response => {
        const user = response.data
        ProfileDataService.getById(user.id,
          response => {
            let fullName = (response.data.item.firstName + ' ' + response.data.item.lastName);
            this.setState({ description: fullName, email: response.data.item.email, userId: response.data.item.userId })
          }, error => console.error(error))
      }, error => console.error(error)
    );
    if (this.props.location.state.plan > 3000) {
      this.setState({ oneCoupon: true })
    }
    this.setState({ paid: this.props.location.state.plan, baseAmount: this.props.location.state.plan });
  }

  onChange = evt => {
    const key = evt.target.name;
    const val = evt.target.value;
    this.setState({ [key]: val });
  }

  async submit(ev) {
    this.showLoadingModal();
    let { token } = await this.props.stripe.createToken({ name: "Name" })
    if (token == null) {
      alert('Please enter your Credit Card Info');
      this.closeLoadingModal();
    } else {
      const { paid, currency, description } = this.state;
      const data = { amount: paid, currency: currency, description: description, sourceId: token.id };
      CreditService.chargeTransaction(data, this.onChargeSuccess, this.onChargeError);
    };
  }

  onChargeSuccess = () => {
    const { paid } = this.state;
    const dbData = { value: paid };
    CreditService.paymentStore(dbData, this.onPaymentSuccess, this.onPaymentError);
  }

  onChargeError = () => alert('please fill everything in');

  onPaymentSuccess = response => {
    const paymentJoin = { userId: this.state.userId, paymentId: response.data.item };
    CreditService.insertTransaction(paymentJoin, this.onPInsertSuccess, this.onPInsertError);
    const { description, promoCode, paid, baseAmount, email } = this.state;
    const emailData = { firstName: description, promoCode: promoCode, value: baseAmount, email: email, paid: paid };
    this.closeLoadingModal();
    this.props.history.push({
      pathname: '/payment/done',
      id: response.data.item,
      emailData,
    });
  }

  showLoadingModal = () => {
    this.showLoading.click();
  }

  closeLoadingModal = () => {
    this.closeLoading.click();
  }

  onPaymentError = () => alert("Something went wrong please try again");

  onSearchSuccess = response => {
    if (response.data.item.id === 0) {
      this.onSearchError();
    } else {
      this.setState({ value: response.data.item.value / 100 });
      let couponPrice = (this.state.paid - (this.state.paid * this.state.value));
      this.setState({ paid: couponPrice, promoCode: this.state.promoCode, oneCoupon: true });
    }
  }

  onSearchError = () => {
    this.setState({ promoCode: '' });
    alert('Promo code does not exist or no longer valid');
  }

  onPInsertSuccess = () => '';

  onPInsertError = response => console.error(response);

  render() {
    let loadingModal = (
      <div
        className="modal show"
        id="modals-loading"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog">
          <button
            type="button"
            className="modalShow"
            data-toggle="modal"
            data-target="#modals-loading"
            ref={modal => (this.showLoading = modal)}
          >
            Show
          </button>
          <button
            type="button"
            className="close modalShow"
            data-dismiss="modal"
            aria-label="Close"
            ref={modal => (this.closeLoading = modal)}
          >
            Close
          </button>
        </div>
        <LoadingAnimation />
      </div>
    );
    return (
      <React.Fragment>
        {this.state.loading}
        <div >
          <img className="inline-block" src={logo} alt="Logo" style={{ width: "20vw" }}></img>
          <br />
          <br />
        </div>
        <div className="row">
          <div className="checkout col-md-6 card mb-4">
            <br />
            <p>Payment Options</p>
            <label>Name</label>
            <input
              name="description"
              type="text"
              value={this.state.description}
              onChange={this.onChange}
              className="form-control"
            />
            <hr />
            <CardElement />
            <hr />
            <div className="input-group">
              <label className="form-label" htmlFor="promoCode">Promo Code</label>
              <div className="input-group">
                <input
                  name="promoCode"
                  type="text"
                  value={this.state.promoCode}
                  onChange={this.onChange}
                  disabled={this.state.oneCoupon}
                  className="form-control"
                />
                <span className="input-group-append">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      CreditService.SelectByCoupon(
                        this.state.promoCode,
                        this.onSearchSuccess,
                        this.onSearchError,
                      )
                    }}
                    disabled={this.state.oneCoupon}
                  >
                    Apply Code</button>
                </span>
              </div>
            </div>
            <br />
          </div>
          <div className="col-md-5 offset-md-1 card mb-4">
            <br />
            <h3>Charge Amount: {MoneyConverter.CentsIntoDollars(this.state.paid)}</h3>
            <p>Promo Code:{this.state.promoCode}</p>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="form-group">
              <button
                type="button"
                className="btn btn-success btn-block mt-4"
                onClick={this.submit}
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>
        {loadingModal}
      </React.Fragment >
    );
  }
}

export default withRouter(injectStripe(CheckoutForm));