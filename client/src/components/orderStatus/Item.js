import React, { Component } from "react";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    const image = this.props.image;
    const name = this.props.name;
    const id = this.props.id;
    const quantity = this.props.itemQuantity;
    return (
      <div className="item">
          <img className="item-image"
            src={image}
            alt={this.props.name}
          />
        <h4 className="item-name">{this.props.name}</h4>
        <p className="item-quantity">{this.props.itemQuantity}</p>
      </div>
    );
  }
}

export default Item;