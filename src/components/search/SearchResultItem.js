import React from 'react'
import { useNavigate } from 'react-router-dom';

function SearchResultItem(props) {
    let {item} = props;
    let navigate = useNavigate();
    let goToRestaurant = (id) => {
        navigate("/restaurant/"+id);
    }
    return (
        <div className="col-12 food-shadow p-4 mb-4" onClick={()=>goToRestaurant(item._id)}>
            <div className="d-flex align-items-center">
                <img src={`./${item.image}`} className="food-item" alt="" />
                <div className="ms-5">
                    <p className="h4 fw-bold">{item.name}</p>
                    <span className="fw-bold text-muted">FORT</span>
                    <p className="m-0 text-muted">
                        <i
                            className="fa fa-map-marker fa-2x text-danger"
                            aria-hidden="true"
                        ></i>
                        {item.locality} , {item.city}
                    </p>
                </div>
            </div>
            <hr />
            <div className="d-flex">
                <div>
                    <p className="m-0">CUISINES:</p>
                    <p className="m-0">COST FOR TWO:</p>
                </div>
                <div className="ms-5">
                    <p className="m-0 fw-bold">{item.cuisine.reduce((pV,cV)=>{
                        return pV + " , " + cV.name},"").substring(2)
                }
                    </p>
                    <p className="m-0 fw-bold">
                        <i className="fa fa-inr" aria-hidden="true"></i> {item.min_price}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SearchResultItem