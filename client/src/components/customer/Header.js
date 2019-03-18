import React, { Component } from "react";
import axios from "axios";
import AddressInput from './AddressInput';
import Geocode from "react-geocode";

class Header extends Component {
  constructor(props) {
    Geocode.setApiKey('AIzaSyDH60azLLKvgrMa1KMocCadsKzrSACC95o');
    super(props);
    this.state = {
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''},
      showCart: false,
      cart: this.props.cartItems,
    };
    this.onAddressChange = this.onAddressChange.bind(this);
  }


  onAddressChange(evt) {
    const id = evt.target.id;
    const val = evt.target.value;
    console.log(id);
    console.log(val);
    let state = this.state;
    console.log(state);
    state.address[id] = val;
    this.setState(state);
  }

  handleCart = (e) => {
    e.preventDefault();
    this.setState({
      showCart: !this.state.showCart
    });
  }

  formatAddress(address) {
        return address.street + ", " + address.city + ", " +
        address.state + " " + address.postalCode + ", " + address.country



  }
  handleCheckout(){
        //TODO also post order to backend
        console.log(this.state.address);
        var addr = this.formatAddress(this.state.address);
        console.log(addr);
        Geocode.fromAddress(addr).then(
        response => {
            const { lat, lng } = response.results[0].geometry.location;
            console.log(lat, lng);
            axios.post('api/addOrder', {
            items: this.props.cartItems,
            "time": "11:30",
            "latitude": lat,
            "orderStatus": "Being Prepared", 
            "longitude": lng
            });
            axios.post('http://credit.17-356.isri.cmu.edu/api/transactions', {
            "companyId": "dronuts_group_4",
            "amount": this.props.total,
            })
            .then(function (response) {
            console.log(response);
            console.log(response.data.id)
            //window.location = 'http'://credit.17-356.isri.cmu.edu?transaction_id=' + response.data.id;
             var win = window.open('http://credit.17-356.isri.cmu.edu?transaction_id=' + response.data.id, '_blank');
             win.focus();
            }).catch(function (error) {
                console.log(error);
            });
            },
        error => {
            alert("Invalid Address")
            console.log(error);
        }
        );


  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    let cartItems = this.state.cart.map(item => {
      return (
        <div className="cart-item" key={item.name}>
        <img className="cart-image" src={item.image} alt={item.name}/>
        <div className="item-info">
        <p className="item-name">{item.name}</p>
        <p className="item-price">{item.price}$</p>
        </div>
        <div className="item-total">
        <p className="quantity">x{item.quantity} </p>
        <p className="amount">Total: {item.quantity * item.price}$</p>
        <button
        className="item-remove"
        onClick={this.props.removeItem.bind(this, item.id)}
        >
        ×
        </button>
        </div></div>
        );
      });

      return (
      <header>
      <div className="container">
      <div className="brand">
      <img
      className="logo"
      src="https://cmu-17-356.github.io/Dronuts/assets/Dronut.png"
      alt="Dronuts Logo"
      />
      </div>

      <div className="cart">
      <div className="cart-info">
      <table>
      <tbody>
      <tr>
      <td>No. of items</td>
      <td>:</td>
      <td>
      <strong>{this.props.totalItems}</strong>
      </td>
      </tr>
      <tr>
      <td>Sub Total</td>
      <td>:</td>
      <td>
      <strong>{this.props.total}$</strong>
      </td>
      </tr>
      </tbody>
      </table>
      </div>
      <button
      className="cart-icon"
      href="#"
      onClick={this.handleCart.bind(this)}
      ref="cartButton"
      >
      <img
      src="https://res.cloudinary.com/sivadass/image/upload/v1493548928/icons/bag.png"
      alt="Cart"
      />
      {this.props.totalItems ? (
        <span className="cart-count">{this.props.totalItems}</span>
        ) : ("")
      }
      </button>
        <div className="cart-items"> {this.state.showCart && cartItems} </div>
        <div className="action-block">
        {this.state.cart.length > 0 ? (
          <button
          type="button"
          className="checkout"
          onClick={this.handleCheckout.bind(this)}>
          CHECKOUT

          </button> ) : "" }
        </div>
         <AddressInput
            street={this.state.address.street}
            city={this.state.address.city}
            state={this.state.address.state}
            postalCode={this.state.address.postalCode}
            country={this.state.address.country}
            onChange={this.onAddressChange}
            />
        </div>
        </div>
        </header>
        );
      }
    }

  export default Header;