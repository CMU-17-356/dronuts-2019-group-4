import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/employee/Header";
import Order from "./components/orderStatus/Order";
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
                     "latitude" : 40.442169,
                     "time": "11:30",
                     "longitude" : -79.994957,
                     "orderStatus" : "Being Prepared",
                     "orderID":0,

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
                     "latitude" : 40.442169,
                     "longitude" : -79.994957,
                     "orderStatus" : "Delivered",
                       "orderID":1,
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
                     "latitude" : 40.442169,
                     "orderStatus" : "On its way",
                     "longitude" : -79.994957,
                     "orderID":2,
                    }],
            message: "Haven't heard from the express server yet..",
            drones: []
		}
	}




	getOrders() {
	    const url =
	      "api/myOrders/userID"; //GET actual from express backend
	    axios.post(url).then(response => {
	      this.setState({
	        orders: response.data
	      });
	    });

    }


    componentDidMount() {
      this.interval = setInterval(() => this.getOrders(), 5000);
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }


	render() {
	    console.log(this.state.orders);
	    const items = this.state.orders
	    .map(item => {
	    return (
          <Order
            key={item.orderID}
            itemsList={item.items}
            status ={item.orderStatus}
            id={item.orderID}
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