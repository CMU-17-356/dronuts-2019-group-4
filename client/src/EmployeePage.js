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
			orders: [{
                    "items": [{
                            "id": 1,
                            "name": "Brocolli - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg",
                            "quantity": "3"
                          },
                          {
                            "id": 1,
                            "name": "Cauliflower - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg",
                            "quantity": "2"
                          },
                          {
                            "id": 1,
                            "name": "Cucumber - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg",
                            "quantity": "1"
                          }],
                     "time": "11:30",
                     "id":0,

                    },
                    {
                    "items": [{
                            "id": 1,
                            "name": "Brocolli - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg",
                            "quantity": "3"
                          },
                          {
                            "id": 1,
                            "name": "Cucumber - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg",
                            "quantity": "1"
                          }],
                     "time": "11:35",
                       "id":1,
                    },
                    {
                    "items": [{
                            "id": 1,
                            "name": "Brocolli - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg",
                            "quantity": "2"
                          },
                          {
                            "id": 1,
                            "name": "Cauliflower - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg",
                            "quantity": "1"
                          },
                          {
                            "id": 1,
                            "name": "Cucumber - 1 Kg",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg",
                            "quantity": "3"
                          }],
                     "time": "11:38",
                     "id":2,
                    }],
               message: "Haven't heard from the express server yet.."
		}
	}




	getOrders() {
	    const url =
	      "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json"; //GET actual from express backend
	    axios.get(url).then(response => {
	      this.setState({
	        orders: response.data
	      });
	    });
    }

	componentWillMount() {
		//this.getOrders();
	}

     // Add to Cart
    deleteItem(id) {
    console.log(id);
   this.setState(prevState => ({
        orders: prevState.orders.filter(el => el.id != id )
    }));

  }

	render() {
	    console.log(this.state.orders);
	    const items = this.state.orders
	    .map(item => {
        return (
          <Order
            key={item.id}
            itemsList={item.items}
            time={item.time}
            id={item.id}
            deleteButton={this.deleteItem.bind(
              this,
              item.id,
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
