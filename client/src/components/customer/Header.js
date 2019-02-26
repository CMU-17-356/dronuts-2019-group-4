import React, { Component } from "react";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCart: false,
      cart: this.props.cartItems,
    };
  }

  handleCart = (e) => {
    e.preventDefault();
    this.setState({
      showCart: !this.state.showCart
    });
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
          className="checkout">
          CHECKOUT
          </button> ) : "" }
        </div>
        </div>
        </div>
        </header>
        );
      }
    }

  export default Header;