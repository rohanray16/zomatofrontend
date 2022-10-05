import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import SearchFilter from './SearchFilter';
import SearchHeader from './SearchHeader';
import SearchResult from './SearchResult';
function SearchPage() {
    let [searchList, setSearchList] = useState([]);
    let [searchParams] = useSearchParams();
    let [locList, setLocList] = useState([]);
    let [filter, setFilter] = useState({});
    let [isPage, setIsPage] = useState(1);
    let lessPage = () => {
        let _page = isPage;
        _page -= 1;
        if (_page > 0) {
            setIsPage(_page);
            filterData({
                target: {
                    value: _page
                }
            }, "page");

        }
    }
    let greatPage = () => {
        let _page = isPage;
        _page += 1;
        if (_page > 0 && _page < 5) {
            setIsPage(_page);
            filterData({
                target: {
                    value: _page
                }
            }, "page");

        }
    }



        let getFilterDetails = async (_filter) => {
            _filter = { ..._filter };
            let URL = "https://aqueous-peak-96084.herokuapp.com/api/filter";
            if (searchParams.get("meal_type")) _filter['mealtype'] = searchParams.get("meal_type");

            try {
                console.log("filter final:-");
                console.log(_filter);
                let response = await axios.post(URL, _filter);
                let data = response.data;
                console.log(data);
                setSearchList([...data.result]);
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
        let getLocationDetails = async () => {
            let URL = "https://aqueous-peak-96084.herokuapp.com/api/get-location";
            try {
                let response = await axios.get(URL);
                let data = response.data;
                setLocList([...data.location]);

            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
        let filterData = (event, option) => {
            let _filter = {};
            let flag=true;
            switch (option) {
                case "location":
                    _filter["location"] = event.target.value;
                    break;
                case "sort":
                    _filter["sort"] = event.target.value;
                    break;
                case "cuisine":
                    if (event.target.checked) {
                        if (Object.keys(filter).indexOf("cuisine") >= 0) {
                            _filter["cuisine"] = [...filter.cuisine];
                        }
                        else {
                            _filter["cuisine"] = [];
                        }
                        _filter["cuisine"].push(Number(event.target.value));
                    }
                    else {
                        _filter["cuisine"] = [...filter.cuisine];
                        _filter["cuisine"].splice(_filter["cuisine"].indexOf(Number(event.target.value)), 1);
                        console.log("splicing man")
                        console.log(_filter["cuisine"])
                        if(_filter["cuisine"].length === 0) {
                            delete _filter.cuisine;
                            flag=false;
                        }
                    }
                    break;
                case "cost":
                    let cost = event.target.value.split("-");
                    _filter["lcost"] = cost[0];
                    _filter["hcost"] = cost[1];
                    break;
                case "page":
                    _filter["page"] = Number(event.target.value);
                    setIsPage(Number(event.target.value))
                    break;
            }
            if(flag===true){
            setFilter({ ...filter, ..._filter });
            }
            else{
                let filtertemp = {...filter};
                delete filtertemp.cuisine;
                setFilter({ ...filtertemp, ..._filter });
            }

        }
        useEffect(() => {
            getLocationDetails();
        }, [])
        useEffect(() => {
            getFilterDetails(filter);
        }, [filter])
        return (
            <div className="container-fluid">
                <SearchHeader bgColor="bg-danger" disp=""/>
                {/* <!-- section --/> */}
                <div className="row">
                    <div className="col-12 px-5 pt-4">
                        <p className="h3">Breakfast Places In Mumbai</p>
                    </div>
                    {/* <!-- food item --> */}
                    <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
                        <SearchFilter location={locList} filterData={filterData} />
                        {/* <!-- search result --> */}
                        <SearchResult searchList={searchList} filterData={filterData} isPage={isPage} lessPage={lessPage} greatPage={greatPage} />
                    </div>
                </div>
            </div>
        );
    }

    export default SearchPage