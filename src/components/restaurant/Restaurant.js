import React, { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SearchHeader from "../search/SearchHeader";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Swal from "sweetalert2";
import { createRef } from "react";
function Restaurant(props) {
  let params = useParams();
  let initRest = {
    aggregate_rating: 0,
    city: "",
    city_id: 0,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "",
    locality: "",
    location_id: 0,
    mealtype_id: 0,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: "-1",
  };
  let userNameRef = useRef();
  let emailRef = useRef();
  let addressRef = useRef();
  let closeModal = createRef();
  let [rDetails, setRDetails] = useState({ ...initRest });
  let [isContact, setIsContact] = useState(false);
  let [subTotal, setSubTotal] = useState(0);
  let [menuItem, setMenuItem] = useState([]);
  let getRestaurantDetails = async () => {
    let URL = "https://aqueous-peak-96084.herokuapp.com/api/get-restaurant-by-id/" + params.id;
    try {
      let response = await axios.get(URL);
      let data = response.data;
      if (data.status === true) {
        setRDetails({ ...data.result });
      } else {
        setRDetails({ ...initRest });
      }
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };
  let getMenuList = async () => {
    let URL = "https://aqueous-peak-96084.herokuapp.com/api/get-menu-item?rid=" + params.id;
    try {
      let response = await axios.get(URL);
      let data = response.data;
      if (data.status === true) {
        setMenuItem([...data.menu_items]);
      } else {
        alert("menu items not found");
      }
    } catch (error) {
      alert("Error");
      console.log(error);
    }
  };
  let incMenuItemCount = (index) => {
    let _menuItem = [...menuItem];
    _menuItem[index].qty += 1;
    setMenuItem(_menuItem);
  };
  let decMenuItemCount = (index) => {
    let _menuItem = [...menuItem];
    _menuItem[index].qty -= 1;
    setMenuItem(_menuItem);
  };


  //Payment methods
  let loadScript = async () => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://checkout.razorpay.com/v1/checkout.js";
    scriptElement.onload = () => { return true };
    scriptElement.onerror = () => { return false };
    document.body.appendChild(scriptElement);
  }
  let makePayment = async () => {

    let isLoaded = await loadScript();
    if (isLoaded) {
      alert('unable to load');
      return false;
    }
    let URL = "https://aqueous-peak-96084.herokuapp.com/api/payment";
    let sendData = {
      "amount": ""+subTotal,
       "email": ""+emailRef.current.value
    }
    closeModal.current.click();
    try{
    let {data} = await axios.post(URL,sendData);
    let {order} = data;
    var options = {
      key: "rzp_test_stg4Xq3wPuMpMj", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Zomato Clone Payment",
      description: "Food payment",
      image: "https://en.m.wikipedia.org/wiki/File:Zomato_logo.png",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async (response) => {
        let URL = "https://aqueous-peak-96084.herokuapp.com/api/callback";
        let sendData = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
        }
        try {
          let paymentStatus = await axios.post(URL,sendData);
          let {data} = paymentStatus
          let {signatureIsValid} = data;
          if(signatureIsValid){
            Swal.fire({
              icon: "success",
              title: "Payment Successful",
          }).then(() => {
            window.location.assign("/");
          });
          }
        } catch (error) {
          
        }
      },
      prefill: {
        name: "Rohan Ray",
        email: "rohanandmail@gmail.com",
        contact: "8768366427"
      },
      notes: {
        address: "Razorpay Corporate Office"
      },
      theme: {
        color: "#3399cc"
      }
    };
    var paymentObject = new window.Razorpay(options);
    paymentObject.open();
    }catch(error){
      console.log(error)
    }
  }





  // on mounting
  useEffect(() => {
    getRestaurantDetails();
  },[]);

  useEffect(() => {
    let subTotal = menuItem.reduce((pValue, cValue) => {
      return pValue + cValue.price * cValue.qty;
    }, 0);
    setSubTotal(subTotal);
  }, [menuItem]);

  return (
    <>
      <div className="modal fade" id="slide" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document" style={{ width: "80wh" }}>
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div> */}
            <div className="modal-body">
              <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={2000} selectedItem={0} showStatus={false} >
                {rDetails.thumb.length && rDetails.thumb.map((value, index) => {
                  // A workaround that worked for me was not to render the Carousel until the slides are loaded:
                  return (
                    <div key={index} className="">
                      <img src={`/${value}`} alt=""/>
                    </div>
                  )
                })
                }
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {rDetails.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuItem.map((item, index) => {
                return (
                  <div className="row p-2" key={index}>
                    <div className="col-8">
                      <p className="mb-1 h6">{item.name}</p>
                      <p className="mb-1">{item.price}</p>
                      <p className="small text-muted">{item.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/" + item.image} alt="" />
                        {item.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => incMenuItemCount(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => decMenuItemCount(index)}
                            >
                              -
                            </span>
                            <span>{item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => incMenuItemCount(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
                );
              })}

              {subTotal === 0 ? null : (
                <div className="d-flex justify-content-between">
                  <h3>Subtotal {subTotal}</h3>
                  <button
                    className="btn btn-danger"
                    data-bs-target="#exampleModalToggle2"
                    data-bs-toggle="modal"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {rDetails.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter full Name"
                  ref={userNameRef}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  ref={emailRef}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  ref={addressRef}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button
                className="btn btn-success"
                onClick={makePayment}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="row bg-danger justify-content-center">
        <div className="col-10 d-flex justify-content-between py-2">
          <p className="m-0 brand">e!</p>
          <div>
            <button className="btn text-white">Login</button>
            <button className="btn btn-outline-light">
              <i className="fa fa-search" aria-hidden="true"></i>Create a
              Account
            </button>
          </div>
        </div>
      </div> */}

      <SearchHeader bgColor="bg-danger" disp="" />
      {/* <!-- section --> */}
      <div className="row justify-content-center">
        <div className="col-10">
          <div className="row">
            <div className="col-12 mt-5">
              <div className="restaurant-main-image position-relative">
                <img src={"/" + rDetails.image} alt="" className="" />
                <button className="btn btn-outline-light position-absolute btn-gallery"
                  data-bs-toggle="modal"
                  data-bs-target="#slide"

                >
                  Click To Get Image Gallery
                </button>
              </div>
            </div>
            <div className="col-12">
              <h3 className="mt-4">{rDetails.name}</h3>
              <div className="d-flex justify-content-between">
                <ul className="list-unstyled d-flex gap-3">
                  <li
                    className={
                      isContact === false
                        ? "border-bottom border-3 border-danger cursor-pointer"
                        : "hand"
                    }
                    onClick={() => setIsContact(false)}
                  >
                    Overview
                  </li>
                  <li
                    className={
                      isContact === true
                        ? "border-bottom border-3 border-danger "
                        : "hand"
                    }
                    onClick={() => setIsContact(true)}
                  >
                    Contact
                  </li>
                </ul>
                <a
                  className="btn btn-danger align-self-start"
                  data-bs-toggle="modal"
                  href="#exampleModalToggle"
                  role="button"
                  onClick={getMenuList}
                >
                  Place Online Order
                </a>
              </div>
              <hr className="mt-0" />
              {isContact === false ? (
                <div className="over-view">
                  <p className="h5 mb-4">About this place</p>

                  <p className="mb-0 fw-bold">Cuisine</p>
                  <p>
                    {rDetails.cuisine
                      .reduce((pV, cV) => pV + ", " + cV.name, "")
                      .substring(2)}
                  </p>

                  <p className="mb-0 fw-bold">Average Cost</p>
                  <p>₹{rDetails.min_price} for two people (approx.)</p>
                </div>
              ) : (
                <div className="over-view">
                  <p className="mb-0 fw-bold">Phone Number</p>
                  <p>+{rDetails.contact_number}</p>

                  <p className="mb-0 fw-bold">Address</p>
                  <p>
                    {rDetails.locality},{rDetails.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Restaurant;
