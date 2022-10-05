import axios from 'axios';
import React, { useEffect, useState } from 'react'
import QuickSearchItem from './QuickSearchItem';
function QuickSearch() {
    let [mealType,setMealType] = useState([]);
    let getQuickSearchData = async () => {
        let URL = "https://aqueous-peak-96084.herokuapp.com/api/get-meal-types";
        console.log("hehe");
        
        try {
            let response = await axios.get(URL);
            console.log(response);
            let { status, meal_type } = response.data;
            if (status) {
                console.log(meal_type);
                setMealType([...meal_type]);
            }
            else {
                alert("Meal types  not found");
            }
        }catch(error){
            alert(error);
            console.log(error);
        }
        console.log(mealType);
    };
    useEffect(()=>{
        getQuickSearchData();
    },[]);
    return (
        <div className="container-fluid pb-5">
            <div className="row mt-4 d-flex justify-content-evenly mx-1 px-5">
                <div className="block-size3 mt-4 p-0">
                    <p className="srch-h">Quick Search</p>
                    <p className="srch-s">Discover restaurants by type of meal</p>
                </div>
                <div className="block-size2 mt-4 p-0"></div>
                <div className="block-size2 mt-4 p-0 xcld"></div>
                {mealType.map((meal)=>{
                 return <QuickSearchItem meal={meal} key={meal._id}/>;
                })}
                
            </div>
        </div>
    );
}

export default QuickSearch