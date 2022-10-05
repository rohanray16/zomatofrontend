import React, { useRef, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import SearchHeader from '../search/SearchHeader';
function Wallpaper() {
    let locRef = useRef();
    let navigate = useNavigate();
    let [locList, setLocList] = useState([]);
    let [selLoc, setSelLoc] = useState(null);
    let [restaurant, setRestaurant] = useState([]);
    let [restdisabled, setRestDisabled] = useState(true);
    let getLocationList = async (event) => {

        let city = event.target.value;
        if (city === "" || city.length < 2) {
            setLocList([]);
            setRestDisabled(true);
            return false;
        }

        let URL = "https://aqueous-peak-96084.herokuapp.com/api/get-location-by-city?city=" + city;
        try {
            let response = await axios.get(URL);
            let { location } = response.data;
            setLocList([...location]);
            console.log(locList);

        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    };
    let emptyLoc = (event) => {
        // setTimeout(() => {
        setLocList([]);
        // }, 200);

    }
    let selectLoc = (loc) => {
        console.log("clicked");
        loc = JSON.parse(loc);
        setSelLoc({ ...loc });
        setLocList([]);
        locRef.current.value = `${loc.name},${loc.city} `;
        console.log(loc);
        setRestDisabled(false);

    }
    let getRestaurantDetails = async (event) => {
        let rest = event.target.value;
        if (rest === "" || rest.length < 2) {
            setRestaurant([]);
            return false;
        }
        let URL = `https://aqueous-peak-96084.herokuapp.com/api/get-restaurant-by-location-id?lid=${selLoc.location_id}&rest=${rest}`;
        try {
            let response = await axios.get(URL);
            let { result } = response.data;
            setRestaurant([...result]);
            console.log(restaurant);

        } catch (error) {
            if (error) {
                console.log(error);
            }
        }

    };
    let emptyRes = (event) => {
        // setTimeout(() => {
        setRestaurant([]);
        // }, 200);

    }
    let goToRestaurant = (id) => {
        sessionStorage.setItem("flag",1)
        navigate("/restaurant/" + id);
      };
    return (
        <>
            <div className="container-fluid header pb-5">
                {/* <div className="row py-3 d-flex align-items-center mx-3">
                    <div className="col-lg-9 col-md-7"></div>
                    <div className="col-lg-1 col-md-2 col-12 text-center">

                        <button className=" login login-signup" data-bs-toggle="modal" data-bs-target="#login">Login</button>
                    </div>
                    <div className="col-lg-2 col-md-2 col-12 text-center">
                        <button className="login-signup signup text-nowrap p-2" data-bs-toggle="modal" data-bs-target="#sign-up">Create an account</button>
                    </div>
                </div> */}
                <SearchHeader bgColor="bg-transparent" disp="invisible"/>
                <div className="d-flex justify-content-center border-primary mt-5">
                    <div className="icon d-flex justify-content-center pt-2">
                        <p className="logo">e!</p>
                    </div>
                </div>
                <div className="row d-flex justify-content-center pt-3 mt-3">
                    <div className="col-10 text-white fw-bolder text-center">
                        <h2 className="heading-h2">Find the best restaurants, cafés, and bars </h2>
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <div className="row mx-auto" >
                            <div className="col-xl-2"></div>
                            <div className="col-xl-3 col-lg-10 mt-3">
                                <div className="hvr"  >
                                    <input type="text" className="py-3 px-2 srch" placeholder="Please type a location"
                                        onBlur={emptyLoc}
                                        onChange={getLocationList}
                                        ref={locRef} />
                                    <div className="location-result">
                                        {locList.map((loc) => {
                                            return <div className="px-2 py-1 fontg opt bg-white" key={loc._id} onMouseDown={() => selectLoc(`${JSON.stringify(loc)}`)}>
                                                {loc.name + "," + loc.city}
                                            </div>
                                        })}
                                        {/* <div className="px-2 py-1 fontg opt bg-white">
                                            HSR Layout, Bengaluru
                                        </div>
                                        <div className="px-2 py-1 fontg opt bg-white">
                                            Kormangala, Bengaluru
                                        </div>
                                        <div className="px-2 py-1 fontg opt bg-white">
                                            Jay Nagar, Bengaluru
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-5 col-lg-10 mt-3">
                                <div className="hvr">
                                    <div className="d-flex align-items-center px-2 bg-white">
                                        <div className="fa fa-search"></div>
                                        <input type="text" className="srch py-3 ms-2" placeholder="Search for restaurants"
                                            onBlur={emptyRes}
                                            onChange={getRestaurantDetails}
                                            disabled = {restdisabled}
                                        />
                                    </div>
                                    <div className="location-result bg-white">
                                        {restaurant.map((rest) => {
                                            return (
                                            <div className="d-flex justify-content-start align-items-center" key={rest._id}
                                            onMouseDown = {(()=> goToRestaurant(rest._id))}
                                            >
                                                <div className="icon2 opt pt-2 ps-3">
                                                    <img src={`./${rest.image}`} className="card-img" alt="" />
                                                </div>
                                                <div className="opt mt-2 ms-3">
                                                    <div className="heading">{rest.name}</div>
                                                    <div className="subheading">{rest.locality}</div>
                                                </div>
                                            </div>
                                            )

                                        })}


                                            {/* < hr className="line opt ms-3" /> */}

                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2"></div>
                        </div>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        </>
    );
}

export default Wallpaper