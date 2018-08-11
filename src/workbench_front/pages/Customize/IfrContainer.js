import React, { Component } from "react";
class IfrContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="customize-iframe">
                <iframe
                    field="customize-iframe"
                    fieldname="个性化主框架"
                    id="customizeiframe"
                    src={this.props.ifr}
                    frameBorder="0"
                    scrolling="yes"
                />
            </div>
        );
    }
}
export default IfrContainer;
