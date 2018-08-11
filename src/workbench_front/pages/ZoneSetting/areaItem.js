import React, { Component } from "react";
import { Icon, Checkbox } from "antd";
import { connect } from "react-redux";
import MyCard from "./card";
import { updateSelectCard } from "Store/ZoneSetting/action";
import BatchSettingModal from "./batchSettingModal";
import AddNotMetaDataModal from "./addNotMetaDataModal";
//区域
class AreaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: props.areaListLength > 1 ? false : true,
            batchSettingModalVisibel: false,
            addDataModalVisibel: false,
            shouldHideGray: false
        };
    }

    moveCard = (dragIndex, hoverIndex) => {
        this.props.moveCard(dragIndex, hoverIndex, this.props.index);
    };
    deleteCard = cardIndex => {
        this.props.deleteCard(cardIndex, this.props.index);
    };
    addMetaInArea = () => {
        this.props.addMetaInArea(
            this.props.metaid,
            this.props.id,
            this.props.areatype
        );
    };
    selectThisCard = cardIndex => {
        this.props.selectThisCard(cardIndex, this.props.index);
    };
    openBatchSetting = () => {
        this.props.updateSelectCard({});
        this.setModalVisibel(true);
    };
    setModalVisibel = visibel => {
        this.setState({ batchSettingModalVisibel: visibel });
    };
    openAddNotMetaInArea = () => {
        this.setAddDataModalVisibel(true);
    };
    setAddDataModalVisibel = visibel => {
        this.setState({ addDataModalVisibel: visibel });
    };
    showOrHideAreaItem = () => {
        this.setState({ isShow: !this.state.isShow });
    };
    render() {
        const { areaItem, selectCard } = this.props;
        return (
            <div className="area-item">
                <div className="area-item-header">
                    <span
                        className="area-item-name"
                        onClick={this.showOrHideAreaItem}
                    >
                        {(() => {
                            const showOrHide = this.state.isShow ? (
                                <Icon type="down" />
                            ) : (
                                <Icon type="right" />
                            );
                            return <strong>{showOrHide}</strong>;
                        })()}
                        &nbsp;{areaItem.name}
                    </span>
                    <span className="area-item-button">
                        <Checkbox
                            onChange={e => {
                                this.setState({
                                    shouldHideGray: e.target.checked
                                });
                            }}
                        >
                            隐藏不显示属性
                        </Checkbox>
                        <a onClick={this.addMetaInArea}>新增元数据</a>
                        <a onClick={this.openAddNotMetaInArea}>新增非元数据</a>
                        <a onClick={this.openBatchSetting}>批量设置</a>
                    </span>
                </div>
                <ul
                    className="area-item-content"
                    style={{ display: this.state.isShow ? "block" : "none" }}
                >
                    {areaItem.queryPropertyList.map((q, index) => {
                        return (
                            <MyCard
                                index={index}
                                key={index}
                                shouldHideGray={this.state.shouldHideGray}
                                id={q.pk_query_property}
                                name={q.label}
                                areaid={areaItem.pk_area}
                                visible={q.visible}
                                color={q.color}
                                required={q.required}
                                selectThisCard={this.selectThisCard}
                                moveCard={this.moveCard}
                                deleteCard={this.deleteCard}
                            />
                        );
                    })}
                </ul>
                <BatchSettingModal
                    batchSettingModalVisibel={
                        this.state.batchSettingModalVisibel
                    }
                    areaIndex={this.props.index}
                    setModalVisibel={this.setModalVisibel}
                />
                <AddNotMetaDataModal
                    areatype={this.props.areatype}
                    addDataModalVisibel={this.state.addDataModalVisibel}
                    areaIndex={this.props.index}
                    setAddDataModalVisibel={this.setAddDataModalVisibel}
                />
            </div>
        );
    }
}
export default connect(
    state => ({}),
    {
        updateSelectCard
    }
)(AreaItem);
