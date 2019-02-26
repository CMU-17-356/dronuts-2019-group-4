import React, { Component } from "react";
import Item from "./Item";
class Order extends Component {
  render() {
    const items = this.props.itemsList
      .map(item => {
        return (
          <Item
            name={item.name}
            image={item.image}
            id={item.id}
            itemQuantity={item.quantity}
          />
        );
      });

    return <div className="order">
            {items}

            <p className="time-placed">{this.props.time}</p>
             <button
            className="mark-done"
            type="button"
                onClick={this.props.deleteButton}
             >
                Done
            </button>

            </div>;
  }
}

export default Order;