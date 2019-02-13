import React, { Component } from "react";
import Counter from "./Counter";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: {},
      isAdded: false
    };
  }
  addToCart(image, name, price, id, quantity) {
    this.setState(
      {
        selectedProduct: {
          image: image,
          name: name,
          price: price,
          id: id,
          quantity: quantity
        }
      },
      function() {
        this.props.addToCart(this.state.selectedProduct);
      }
    );
    this.setState(
      {
        isAdded: true
      },
      function() {
        setTimeout(() => {
          this.setState({
            isAdded: false,
            selectedProduct: {}
          });
        }, 3500);
      }
    );
  }
  
  render() {
    const image = this.props.image;
    const name = this.props.name;
    const price = this.props.price;
    const id = this.props.id;
    const quantity = this.props.itemQuantity;
    return (
      <div className="item">
          <img className="item-image"
            src={image}
            alt={this.props.name}
          />
        <h4 className="item-name">{this.props.name}</h4>
        <p className="item-price">{this.props.price}$</p>
        <Counter
          itemQuantity={quantity}
          updateQuantity={this.props.updateQuantity}
          resetQuantity={this.resetQuantity}
        />
        <div className="item-action">
          <button
            className={!this.state.isAdded ? "" : "added"}
            type="button"
            onClick={this.addToCart.bind(
              this,
              image,
              name,
              price,
              id,
              quantity
            )}
          >
            {!this.state.isAdded ? "ADD TO CART" : "✔ ADDED"}
          </button>
        </div>
      </div>
    );
  }
}

export default Item;