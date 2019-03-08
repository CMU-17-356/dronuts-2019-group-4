import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/employee/Header";
import Order from "./components/employee/Order";
import axios from "axios";

//based on https://github.com/sivadass/react-shopping-cart
class EmployeePage extends Component {
	constructor() {
		super();
		this.state = {
			orders: [],
            message: "Haven't heard from the express server yet.."
		}
	}




	getOrders() {
	    const url =
	      "api/allOrders"; //GET actual from express backend
	    axios.post(url).then(response => {
	      this.setState({
	        orders: response.data
	      });
	    });
    }

	componentWillMount() {
		this.getOrders();
	}

     // Add to Cart
    deleteItem(id) {
    console.log(id);
   this.setState(prevState => ({
        orders: prevState.orders.filter(el => el.orderID != id )
    }));

  }

	render() {
	    console.log(this.state.orders);
	    const items = this.state.orders
	    .map(item => {
        return (
          <Order
            key={item.orderID}
            itemsList={item.items}
            time={item.time}
            id={item.orderID}
            deleteButton={this.deleteItem.bind(
              this,
              item.orderID,
            )}
          />
        );
      });

		return (
               <div className="Employee">
			<div className="container">
			<Header/>
			<div className="OrderList">{items}</div>
			</div>
               </div>
			);
		}
	}

	export default EmployeePage;
