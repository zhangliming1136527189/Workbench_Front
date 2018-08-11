import React, { Component } from "react";
import NoData from "Assets/images/nodata.png";
import "./index.less";
class CoverPosition extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="CoverPosition-container">
                <div className="CoverPosition-content">
                    <img src={NoData} />
                    <span>暂无数据</span>
                </div>
            </div>
        );
    }
}
export default CoverPosition;
