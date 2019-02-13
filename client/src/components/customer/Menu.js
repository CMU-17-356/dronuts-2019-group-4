import React, { Component } from "react";
import Item from "./Item";

class Menu extends Component {
  render() {
    const items = this.props.itemsList
      .map(item => {
        return (
          <Item
            key={item.id}
            price={item.price}
            name={item.name}
            image={item.image}
            id={item.id}
            addToCart={this.props.addToCart}
            itemQuantity={this.props.itemQuantity}
            updateQuantity={this.props.updateQuantity}
          />
        );
      });

    return <div className="menu">{items}</div>;
  }
}

export default Menu;