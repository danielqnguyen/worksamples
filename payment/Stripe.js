import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckOutForm';

class CheckoutStructure extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: ''
    };
  }

  componentWillMount() {
    let aKey = this.props.location.state.key
    this.setState({ key: aKey });
  }

  render() {
    return (
      <StripeProvider apiKey={this.state.key}>
        <Elements>
          <CheckoutForm />
        </Elements>
      </StripeProvider>
    );
  }
}

export default CheckoutStructure;