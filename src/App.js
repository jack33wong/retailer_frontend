import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";


function App() {

  const urlNewOrder = "http://localhost:8080/retailer/v0/products";
  const urlCheckout = "http://localhost:8080/retailer/v0/order/checkout";
  const urlOrderHistory = "http://localhost:8080/retailer/v0/order/history";

  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);

  const postOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
  };
  const checkoutRequest = () => {

     return fetch(urlCheckout,postOptions)
        .then((res) => res.json())
        .then((d) => setData(d))
        .then((result) => fetchHistory())
  }

  const fetchInfo = () => {

    return fetch(urlNewOrder)
      .then((res) => res.json())
      .then((d) => setData(d))
  }

  const fetchHistory = () => {

      return fetch(urlOrderHistory)
        .then((res) => res.json())
        .then((d) => setHistory(d))
    }

  useEffect(() => {

    fetchInfo();
    fetchHistory();
  }, []);

  function handleIncrementClick(index, counter) {

       const nextTrolley = data.trolley?.map((c, i) => {
        if (i === index) {
          if(counter >0 || counter < 0 && c.quantity > 0)
            c.quantity += counter;
          return c;
        } else {
          return c;
        }
      });
      setData({...data,trolley: nextTrolley});
  }

  return (
     <div className="App">
        <h1>Online Retailer</h1>
        <div class="contain1er">

          <div class="right">
            <label>
              Date: <input style={{width:"120px"}} name="date" value={data.date} onChange={e => setData({...data, date: e.target.value})}/>
            </label>
          </div>
          <div class="right">
            <table >
              <tr >
                <th style={{width:"100px"}}>Name</th>
                <th style={{width:"50px"}}>Price</th>
                <th style={{width:"50px"}}>Quantity</th>
                <th style={{width:"50px"}}>Total</th>
              </tr>

             {
              data.trolley?.map((dataObj, index) => {
               return (
                 <tr>
                    <td style={{textAlign:"left"}}>{dataObj.name}</td>
                    <td style={{textAlign:"right"}}>£{dataObj.price}</td>
                    <td style={{textAlign:"left"}}><button onClick={() => handleIncrementClick(index,-1)}>-</button>{dataObj.quantity}<button onClick={() => handleIncrementClick(index,1)}>+</button></td>
                    <td style={{textAlign:"right"}}>£{dataObj.subtotal}</td>
                 </tr>
               );
             })}
             {
              data.discounts?.map((dataObj, index) => {
               return (
                 <tr>
                    <td colSpan={3} style={{textAlign:"left"}}>{dataObj.name}</td>
                    <td style={{textAlign:"right"}}>-£{dataObj.subtotal}</td>
                 </tr>
               );
             })}
              <tr>
                <td colSpan={3} style={{textAlign:"left"}}>Total:</td><td style={{textAlign:"right"}}>£{data.total}</td>
              </tr>
              <tr>
                <td colSpan={4} style={{textAlign:"right"}}><button onClick={() => checkoutRequest()}>Checkout</button></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="middle">
          <p style={{textAlign:"left", width:"500px"}}>History</p>
          <ul style={{border: "0px"}}>
          {
            history?.map((dataObj, index) => {
              return (
                <li style={{textAlign:"left"}}>
                  Items: {dataObj.trolley.reduce((a,v) =>  a = a + v.quantity , 0 )},  Discounts: -£{dataObj.discounts.reduce((a,v) =>  a = a + v.subtotal , 0 )}
                </li>
              );
            })}
          </ul>
       </div>
    </div>
   );
}

export default App;
