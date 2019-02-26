import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/customer/Header";
import Menu from "./components/customer/Menu";
import axios from "axios";

//based on https://github.com/sivadass/react-shopping-cart
class App extends Component {
	constructor() {
		super();
		this.state = {
			items: [],
			cart: [],
			totalItems: 0,
			totalAmount: 0,
			quantity: 1,
               message: "Haven't heard from the express server yet.."
		}
	}

     componentDidMount() {
     axios.get("/message").then(response => {
	      console.log(response);
	    });
     }

		
	getItems() {
	    //TODO change to backend by changing url
	    const url =
	      "api/allItems";
	    axios.get(url).then(response => {
	      this.setState({
	        items: response.data
	      });
	    });
    }

	componentWillMount() {
		this.getItems();
	}

     // Add to Cart
    handleAddToCart = (selectedItems) => {
     	const cartItem = this.state.cart;
     	const itemID = selectedItems.id;
     	const itemQty = selectedItems.quantity;
     	if (this.checkItem(itemID)) {
     		let index = cartItem.findIndex(x => x.id === itemID);
     		cartItem[index].quantity =
     		Number(cartItem[index].quantity) + Number(itemQty);
     		this.setState({
     			cart: cartItem
     		});
     	} else {
     		cartItem.push(selectedItems);
     	}
     	this.setState({
     		cart: cartItem,
     	});
     	setTimeout(
     		function() {
     			this.setState({
     				quantity: 1
     			});
     			console.log(this.state.quantity);
     			console.log(this.state.cart);
     		}.bind(this),
     		1000
     		);
     	this.sumTotalItems(this.state.cart);
     	this.sumTotalAmount(this.state.cart);
     }
     handleRemoveItem = (id, e) => {
     	const cart = this.state.cart;
     	const index = cart.findIndex(x => x.id === id);
     	cart.splice(index, 1);
     	this.setState({
     		cart: cart
     	});
     	this.sumTotalItems(this.state.cart);
     	this.sumTotalAmount(this.state.cart);
     	e.preventDefault();
     }

     checkItem = (itemID) => {
     	const cart = this.state.cart;
     	return cart.some(function(item) {
     		return item.id === itemID;
     	});
     }
     sumTotalItems = () => {
     	//const total = 0;
     	const cart = this.state.cart;
     	const total = cart.length;
     	this.setState({
     		totalItems: total
     	});
     }
     sumTotalAmount = () => {
     	var total = 0;
     	const cart = this.state.cart;
     	for (var i = 0; i < cart.length; i++) {
     		total += cart[i].price * parseInt(cart[i].quantity);
     	}
     	this.setState({
     		totalAmount: total
     	});
     }

	//Reset Quantity
	updateQuantity = (qty) => {
		this.setState({
			quantity: qty
		});
	}

	render() {
		return (
               <div className="App">
			<div className="container">
			<Header
			total={this.state.totalAmount}
			totalItems={this.state.totalItems}
			cartItems={this.state.cart}
			removeItem={this.handleRemoveItem}
			updateQuantity={this.updateQuantity}
			itemQuantity={this.state.moq}
			/>
			<Menu
			itemsList={this.state.items}
			addToCart={this.handleAddToCart}
			itemQuantity={this.state.quantity}
			updateQuantity={this.updateQuantity}
			/>
			</div>
               </div>
			);
		}
	}

	export default App;
