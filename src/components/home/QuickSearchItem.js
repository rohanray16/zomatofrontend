import React from 'react'
import { useNavigate } from 'react-router-dom';

function QuickSearchItem(props) {
    let {meal} = props;
    let navigate = useNavigate();
    let goToSearch = (id) => {
        sessionStorage.setItem("flag",1);
        navigate("/quick-search?meal_type="+ id);
    }
    return (
        <div className="d-flex block-size mt-4 p-0" onClick={()=>goToSearch(meal.meal_type)}>
            <div>
                <img src={`./${meal.image}`} alt={`${meal.name}`} className="size" />
            </div>
            <div className="pt-3 ps-3">
                <p className="srch-heading">{meal.name}</p>
                <p className="srch-sub">{meal.content}</p>
            </div>
        </div>
    )
}

export default QuickSearchItem