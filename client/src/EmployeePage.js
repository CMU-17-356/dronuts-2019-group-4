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
            message: "Haven't heard from the express server yet..",
            drones: []
		}
	}




	getOrders() {
	    const url =
	      "api/allUndoneOrders"; //GET actual from express backend
	    axios.post(url).then(response => {
					if(response.data.success) {
	        console.log(response.data.data);
		      this.setState({
		        orders: response.data.data
		      });
				}
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
              if (response.data.current_delivery == null || response.data.current_delivery.status != "in_route"){
                    var order = this.state.orders.filter(el => el._id == id )[0];
                    console.log(order);

                    axios.put('http://drones.17-356.isri.cmu.edu/api/drones/' + droneID + '/send', {
                    "lat": order.latitude,
                    "lon": order.longitude,
                    }).then(response => {
                        order.completed = true;
                        console.log(order);
                        axios.post("api/markOrderDone", { orderID: order._id }).then(response => {
                           console.log(response);
                           this.getOrders();
                        });
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
              item._id,
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
