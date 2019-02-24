import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/employee/Header";
import OrderList from "./components/employee/OrderList";
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

	render() {
		return (
               <div className="Employee">
			<div className="container">
			<Header/>
			<OrderList
			itemsList={this.state.orders}
			/>
			</div>
               </div>
			);
		}
	}

	export default EmployeePage;
