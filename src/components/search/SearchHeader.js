import React from 'react'
import Login from '../user/Login'
import SignUp from '../user/SignUp'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { createRef } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchHeader(props) {
    let [userLogin, setUserLogin] = useState(null);
    let [invisible, setInvisible] = useState('');
    let navigate = useNavigate();
    let clickOnLoad = createRef();
    let onSuccess = (response) => {
        let token = response.credential;
        localStorage.setItem("auth-token", token);
        setInvisible('invisible');
        Swal.fire({
            icon: "success",
            title: "Login Successfully",
        }).then(() => {
            window.location.reload();
        });
    }
    let onError = () => {
        alert("Something went wrong try again...");
    };
    let logout = () => {
        Swal.fire({
            title: "Confirm Logout?",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("auth-token");
                sessionStorage.setItem("flag",0);
                window.location.reload();
            }
        })
    }
    // let onClickOnLoad = () => {
    //     let sessionFlag = sessionStorage.getItem("flag");
    //     if (sessionFlag > 0)
    //         clickOnLoad.current.click();
    //     else {
    //         sessionStorage.setItem("flag", 1);
    //     }
    // }
    let goToHome = () => {
        navigate("/");
    }
    useEffect(() => {

        let token = localStorage.getItem("auth-token");
        if (token) {
            let tokenDecoded = jwtDecode(token);
            console.log("tkd")
            console.log(tokenDecoded);
            setUserLogin(tokenDecoded);
        }
        else {
            setUserLogin(null);
            let sessionFlag = sessionStorage.getItem("flag");
            if (sessionFlag) {
                if (sessionFlag > 0) {
                    sessionStorage.setItem("flag",0);
                    clickOnLoad.current.click();
                }
                // else {
                //     sessionStorage.setItem("flag", 1);
                // }
            }
            else {
                sessionStorage.setItem("flag", 0);
            }

        }
    }, [])
    return (
        <>
            <GoogleOAuthProvider clientId="670355259218-bi38dujagkthd5r4afg4adf46u025e8g.apps.googleusercontent.com">
                <Login success={onSuccess} error={onError} invisible={invisible} />
                <SignUp />
                <div className={`row ${props.bgColor} justify-content-center`}>
                    <div className="col-10 d-flex justify-content-between py-4">
                        <span className={`curso ${props.disp}`} onClick={goToHome}><p className={`m-0 brand ${props.disp}`}>e!</p></span>
                        {userLogin == null ? (
                            <div>
                                <span className="btn text-white"
                                    data-bs-toggle="modal"
                                    data-bs-target="#login"
                                    ref={clickOnLoad}
                                >Login</span>
                                <button className="btn btn-outline-light ms-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#sign-up"
                                >
                                    {/* <i className="fa fa-search ms-1" aria-hidden="true"></i> */}
                                    Create a Account
                                </button>
                            </div>
                        ) : (
                            <div>
                                <span className=" text-white me-3">
                                    Welcome, {userLogin.name}
                                </span>
                                <button className="btn btn-warning" onClick={logout} >
                                    Logout
                                </button>
                            </div>

                        )}
                    </div>
                </div>
            </GoogleOAuthProvider>
        </>
    )
}

export default SearchHeader