import React, { Component } from "react";
import Order from "./Order";

class OrderList extends Component {
  render() {
    const items = this.props.itemsList
      .map(item => {
        return (
          <Order
            itemsList={item.items}
            time={item.time}
          />
        );
      });

    return <div className="OrderList">{items}</div>;
  }
}

export default OrderList;