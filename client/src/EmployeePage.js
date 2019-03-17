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
                     "latitude" : 40.442169,
                     "time": "11:30",
                     "longitude" : -79.994957,
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
                     "longitude" : -79.994957,
                     "orderID":2,
                    }],
            message: "Haven't heard from the express server yet..",
            drones: []
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

    getDrones() {
        const url =
	      'http://drones.17-356.isri.cmu.edu/api/airbases/dronuts_group_4';
	    axios.get(url).then(response => {
	      this.setState({
	        drones: response.data.drones
	      });
	      console.log(this.state.drones);
	    });
    }

	componentWillMount() {
		this.getOrders();
		this.getDrones();
	}

     // Add to Cart
    deleteItem(id) {
         var droneID = Number(prompt("Specify drone:", "Drone Options are " + this.state.drones));
         const url =
              'http://drones.17-356.isri.cmu.edu/api/drones/' + droneID;
         console.log(droneID);
         console.log(this.state.drones);
         console.log(this.state.drones.indexOf(droneID));
         if (this.state.drones.indexOf(droneID) >= 0) {
            axios.get(url).then(response => {
              console.log(response.data)
              if (response.data.current_delivery.status != "in_route"){
                    var order = this.state.orders.filter(el => el.orderID == id )[0];
                    console.log(order);

                    axios.put('http://drones.17-356.isri.cmu.edu/api/drones/' + droneID + '/send', {
                    "lat": order.latitude,
                    "lon": order.longitude,
                    }).then(response => {
                        this.setState(prevState => ({
                            orders: prevState.orders.filter(el => el.orderID != id )
                            }));
                    });

              }else{
                alert("Drone Already in Route");
              }
            });
        }else {
           alert("Invalid Drone Id");
        }

        console.log(id);


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
