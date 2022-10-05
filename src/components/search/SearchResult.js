import React from 'react'
import SearchResultItem from './SearchResultItem';

function SearchResult(props) {
    let {searchList,filterData,isPage,lessPage,greatPage} = props;
    return (
        <div className="col-12 col-lg-8 col-md-7">
            {searchList.map((item,index)=>{
                return <SearchResultItem key={index} item={item}/>;
            })}

            
            <div className="col-12 pagination d-flex justify-content-center">
                <ul className="pages">
                    <li onClick={() => lessPage()}>&lt;</li>
                    <li className={isPage === 1?"active":null} onClick={(event) => filterData(event,"page")} value="1">1</li>
                    <li className={isPage === 2?"active":null} onClick={(event) => filterData(event,"page")} value="2">2</li>
                    <li className={isPage === 3?"active":null} onClick={(event) => filterData(event,"page")} value="3">3</li>
                    <li className={isPage === 4?"active":null} onClick={(event) => filterData(event,"page")} value="4">4</li>
                    <li onClick={() => greatPage()}>&gt;</li>
                </ul>
            </div>
        </div>
    );
}

export default SearchResult