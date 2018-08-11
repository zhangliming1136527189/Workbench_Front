import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Input, Checkbox, InputNumber, Select } from "antd";
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import Ajax from "Pub/js/ajax";
import * as utilService from "./utilService";
import { updateSelectCard, updateAreaList } from "Store/ZoneSetting/action";
import MoneyModal from "./moneyModal";
import ReferModal from "./referModal";
import CustomModal from "./customModal";
import RelateMetaModal from "./relateMetaModal";
import DefaultValueModal from "./defaultValueModal";
import { high } from "nc-lightapp-front";
const { Refer, FormulaEditor } = high;
const Search = Input.Search;
//右边栏基本属性、高级属性
function Formula({ setName, setExplain, name }) {
    return (
        <div className="Formula">
            <ul>
                {(() => {
                    let propertyList = name && name.queryPropertyList;
                    return (
                        propertyList &&
                        propertyList.map((v, i) => {
                            return (
                                <li
									onClick={() => {
                                        setExplain(`${name.code}.${v.code}`);
                                    }}
                                    onDoubleClick={() => {
                                        setName(`${name.code}.${v.code}`);
                                    }}
                                    key={i}
                                >
                                    {v.label}
                                </li>
                            );
                        })
                    );
                })()}
            </ul>
        </div>
    );
}
class MyRightSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moneyModalVisibel: false,
            referModalVisibel: false,
            relateMetaModalVisibel: false,
            customModalVisibel: false,
            defaultValueModalVisibel: false,
            showformula: false,
            editformula: false,
            validateformula: false
        };
    }

    componentDidMount() {}

    changeValue = (value, propertyKey) => {
        let { selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            console.log("empty");
            return;
        }

        selectCard = { ...selectCard };
        selectCard[propertyKey] = value;
        this.props.updateSelectCard(selectCard);
    };
    updateCardInArea = () => {
        let { areaList, selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            return;
        }
        let targetAreaIndex = 0;
        let targetCardIndex = 0;
        areaList = _.cloneDeep(areaList);
        _.forEach(areaList, (a, i) => {
            _.forEach(a.queryPropertyList, (q, index) => {
                if (
                    q.areaid === selectCard.areaid &&
                    q.pk_query_property === selectCard.pk_query_property
                ) {
                    targetAreaIndex = i;
                    targetCardIndex = index;
                    return false;
                }
            });
        });
        areaList[targetAreaIndex].queryPropertyList[
            targetCardIndex
        ] = selectCard;
        this.props.updateAreaList(areaList);
    };
    getCardListInAreaBySelectCard = () => {
        let { areaList, selectCard } = this.props;
        let targetAreaIndex = 0;
        _.forEach(areaList, (a, i) => {
            if (a.pk_area === selectCard.areaid) {
                targetAreaIndex = i;
                return false;
            }
        });
        return areaList[targetAreaIndex].queryPropertyList;
    };
    changeCheckboxValue = (value, property) => {
        let { selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            return;
        }
        selectCard = { ...selectCard };
        selectCard[property] = value;
        if (property === "visible") {
            selectCard.visibleposition = "";
        }
        this.asyncUpdataCardAndAreaList(selectCard, property);
    };
    onPressEnter = (value, property) => {
        this[`${property}input`].blur();
    };

    getMyNumberInput = (placeholder, property) => {
        return (
            <InputNumber
                min={1}
                value={this.props.selectCard[property]}
                onChange={value => {
                    this.changeValue(value, property);
                }}
                onBlur={e => {
                    this.updateCardInArea();
                }}
                ref={input => (this[`${property}input`] = input)}
                onPressEnter={e => {
                    this.onPressEnter(e.target.value, property);
                }}
            />
        );
    };

    getMyInput(placeholder, property) {
        return (
            <Input
                style={{ height: 23, width: 176 }}
                placeholder={placeholder}
                value={this.props.selectCard[property]}
                onChange={e => {
                    this.changeValue(e.target.value, property);
                }}
                onBlur={ e => {this.updateCardInArea(); }}
                ref={input => (this[`${property}input`] = input)}
                onPressEnter={e => {
                    this.onPressEnter(e.target.value, property);
                }}
            />
        );
    }

    getMyCheckbox = property => {
        return (
            <Checkbox
                checked={Boolean(this.props.selectCard[property])}
                onChange={e => {
                    this.changeCheckboxValue(e.target.checked, property);
                }}
            />
        );
    };
    //原用做下拉选择的事件处理,现用来先更新selectCard后更新areaList
    handleSelectChange = (value, property) => {
        let { selectCard } = this.props;
        if (_.isEmpty(selectCard)) {
            return;
        }
        selectCard = { ...selectCard };
        selectCard[property] = value;
        //进行业务相关的联动处理
        if (property === "datatype") {
            selectCard.dataval = "";
            selectCard.itemtype = utilService.getItemtypeByDatatype(
                selectCard.datatype
            );
            //小数或者金额
            if (value === "2" || value === "52") {
                selectCard.dataval = "2,,";
            }
        }

        this.asyncUpdataCardAndAreaList(selectCard, property);
    };
    //异步更新selectCard后更新areaList
    async asyncUpdataCardAndAreaList(selectCard, property) {
        await this.props.updateSelectCard(selectCard);
        await this.updateCardInArea();
    }
    //获取下拉选择Dom
    getMySelect = (mySelectObj, property) => {
        return (
            <Select
                value={
                    _.isEmpty(this.props.selectCard[property])
                        ? mySelectObj[0].value
                        : this.props.selectCard[property]
                }
                onChange={value => {
                    this.handleSelectChange(value, property);
                }}
                style={{ width: 176 }}
                size={"small"}
            >
                {(() => {
                    if (property === "color") {
                        return mySelectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    <span className="template-setting-color-select">
                                        <span>{c.name}</span>
                                        <span
                                            className="color-select-color"
                                            style={{ backgroundColor: c.value }}
                                        />
                                    </span>
                                </Option>
                            );
                        });
                    } else {
                        return mySelectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    {c.name}
                                </Option>
                            );
                        });
                    }
                })()}
            </Select>
        );
    };
    //
    getMetaType = selectCard => {
        if (!!selectCard.metapath) return true; // 是元数据
        return false; // 不是元数据 默认没选的情况是false
    };
    // 获取当前区域的类型
    getAreaType = (areaList, selectCard) => {
        let result;
        _.forEach(areaList, (val, index) => {
            _.forEach(val.queryPropertyList, (v, i) => {
                if (selectCard.areaid === v.areaid) {
                    result = val.areatype;
                    return;
                }
            });
        });
        return result;
    };
    // 获取当前区域
    getArea = (areaList, selectCard) => {
        let result;
        _.forEach(areaList, (val, index) => {
            _.forEach(val.queryPropertyList, (v, i) => {
                if (selectCard.areaid === v.areaid) {
                    result = val;
                    return;
                }
            });
        });
        return result;
    };
    // 设置不同弹框的显示和隐藏
    setModalVisibel = (whichModalVisibel, val) => {
        this.setState({ [whichModalVisibel]: val });
    };
    getMySearch = (key, whichModalVisibel) => {
        const { selectCard } = this.props;
        return (
            <Search
                size="small"
                style={{ width: 176 }}
                value={selectCard[key]}
                onChange={() => {}}
                onSearch={() => {
                    this.setState({ [whichModalVisibel]: true });
                }}
            />
        );
    };
    getMyFormulaSearch = key => {
        const { selectCard } = this.props;
        return (
            <Search
                size="small"
                style={{ width: 176 }}
                value={selectCard[key]}
                onChange={() => {}}
                onSearch={() => {
                    //this.refs[key].setShow(true);
                    this.handleFormula();
                    this.setState({ [key]: true });
                    //	this.refs[key].handleTextAreaChange(selectCard[key]);
                }}
            />
        );
    };
    //查询区，元数据属性
    getDom1 = () => {
        const { selectCard } = this.props;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="显示属性" key="1">
                    <ul className="basic-property">
                        <li>显示名称</li>
                        <li>{this.getMyInput("显示名称", "label")}</li>
                        <li>多语字段</li>
                        <li>{this.getMyInput("多语字段", "resid")}</li>
                        <li>数据类型</li>
                        {/* 元数据，禁止设置datatype属性，除了56自定义项*/}
                        {(() => {
                            if (selectCard.isdefined) {
                                //通过isdefined判断是否为自定义项，可以选择数据类型
                                return (
                                    <li>
                                        {this.getMySelect(
                                            utilService.dataTypeObj,
                                            "datatype"
                                        )}
                                    </li>
                                );
                            } else {
                                let showDataTypeName = utilService.getDatatypeName(
                                    selectCard.datatype
                                );
                                showDataTypeName =
                                    showDataTypeName === ""
                                        ? selectCard.datatype
                                        : showDataTypeName;
                                return <li>{showDataTypeName}</li>;
                            }
                        })()}
                        <li>类型设置</li>
                        <li>{this.getMyInput("类型设置", "dataval")}</li>
                        <li>非元数据条件</li>
                        <li>{this.getMyCheckbox("isnotmeta")}</li>
                        <li>使用</li>
                        <li>{this.getMyCheckbox("isuse")}</li>
                        <li>编码</li>
                        <li>{this.getMyInput("编码", "code")}</li>
                        <li>操作符编码</li>
                        <li>{this.getMyInput("操作符编码", "opersign")}</li>
                        <li>操作符名称</li>
                        <li>{this.getMyInput("操作符名称", "opersignname")}</li>
                        <li>默认取值</li>
                        {(() => {
                            if (
                                selectCard.datatype === "204" &&
                                selectCard.refname !== "-99"
                            ) {
                                return (
                                    <li>
                                        {this.getMySearch(
                                            "defaultvalue",
                                            "defaultValueModalVisibel"
                                        )}
                                        <DefaultValueModal
                                            areatype="0"
                                            refcode={selectCard.refcode}
                                            refname={selectCard.refname}
                                            isMultiSelectedEnabled={Boolean(
                                                selectCard.ismultiselectedenabled
                                            )}
                                            handleSelectChange={
                                                this.handleSelectChange
                                            }
                                            defaultvalue={
                                                selectCard.defaultvalue
                                            }
                                            modalVisibel={
                                                this.state
                                                    .defaultValueModalVisibel
                                            }
                                            setModalVisibel={
                                                this.setModalVisibel
                                            }
                                        />
                                    </li>
                                );
                            } else {
                                return (
                                    <li>
                                        {this.getMyInput(
                                            "默认取值",
                                            "defaultvalue"
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>不可修改</li>
                        <li>{this.getMyCheckbox("disabled")}</li>
                        <li>默认显示</li>
                        <li>{this.getMyCheckbox("visible")}</li>
                        {/* 如果默认显示为true才显示*/}
                        {(() => {
                            if (selectCard.visible) {
                                return [
                                    <li key="visibleposition0">
                                        默认显示字段排序
                                    </li>,
                                    <li key="visibleposition1">
                                        {this.getMyInput(
                                            "默认显示字段排序",
                                            "visibleposition"
                                        )}
                                    </li>
                                ];
                            }
                        })()}
                        <li>多选</li>
                        <li>{this.getMyCheckbox("ismultiselectedenabled")}</li>
                        <li>固定条件</li>
                        <li>{this.getMyCheckbox("isfixedcondition")}</li>
                        <li>必输条件</li>
                        <li>{this.getMyCheckbox("required")}</li>
                        <li>查询条件</li>
                        <li>{this.getMyCheckbox("isquerycondition")}</li>
                        <li>参照名称</li>
                        <li>{this.getMyInput("参照名称", "refname")}</li>
                        <li>参照包含下级</li>
                        <li>{this.getMyCheckbox("containlower")}</li>
                        <li>参照自动检查</li>
                        <li>{this.getMyCheckbox("ischeck")}</li>
                        <li>参照跨集团</li>
                        <li>{this.getMyCheckbox("isbeyondorg")}</li>
                        <li>使用系统函数</li>
                        <li>{this.getMyCheckbox("usefunc")}</li>
                        <li>组件类型</li>
                        <li>
                            {this.getMySelect(
                                utilService.getItemtypeObjByDatatype(
                                    selectCard.datatype
                                ),
                                "itemtype"
                            )}
                        </li>
                        <li>显示类型</li>
                        <li>
                            {this.getMySelect(utilService.showType, "showtype")}
                        </li>
                        <li>返回类型</li>
                        <li>
                            {this.getMySelect(
                                utilService.returnType,
                                "returntype"
                            )}
                        </li>
                        <li>自定义1</li>
                        <li>{this.getMyInput("自定义1", "define1")}</li>
                        <li>自定义2</li>
                        <li>{this.getMyInput("自定义2", "define2")}</li>
                        <li>自定义3</li>
                        <li>{this.getMyInput("自定义3", "define3")}</li>
                        <li>自定义4</li>
                        <li>{this.getMyInput("自定义4", "define4")}</li>
                        <li>自定义5</li>
                        <li>{this.getMyInput("自定义5", "define5")}</li>
                    </ul>
                </TabPane>
            </Tabs>
        );
    };
    //查询区，非元数据属性
    getDom2 = () => {
        const { selectCard } = this.props;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="显示属性" key="1">
                    <ul className="basic-property">
                        <li>显示名称</li>
                        <li>{this.getMyInput("显示名称", "label")}</li>
						<li>多语字段</li>
                        <li>{this.getMyInput("多语字段", "resid")}</li>
                        <li>非元数据条件</li>
                        <li>{this.getMyCheckbox("isnotmeta")}</li>
                        <li>使用</li>
                        <li>{this.getMyCheckbox("isuse")}</li>
                        <li>元数据属性</li>
                        <li>
                            {this.getMyInput("元数据属性", "metadataproperty")}
                        </li>
                        <li>编码</li>
                        <li>{this.getMyInput("编码", "code")}</li>
                        <li>操作符编码</li>
                        <li>{this.getMyInput("操作符编码", "opersign")}</li>
                        <li>操作符名称</li>
                        <li>{this.getMyInput("操作符名称", "opersignname")}</li>
                        <li>默认取值</li>
                        {(() => {
                            if (
                                selectCard.datatype === "204" &&
                                selectCard.refname !== "-99"
                            ) {
                                return (
                                    <li>
                                        {this.getMySearch(
                                            "defaultvalue",
                                            "defaultValueModalVisibel"
                                        )}
                                        <DefaultValueModal
                                            areatype="0"
                                            refcode={selectCard.refcode}
                                            refname={selectCard.refname}
                                            isMultiSelectedEnabled={Boolean(
                                                selectCard.ismultiselectedenabled
                                            )}
                                            handleSelectChange={
                                                this.handleSelectChange
                                            }
                                            defaultvalue={
                                                selectCard.defaultvalue
                                            }
                                            modalVisibel={
                                                this.state
                                                    .defaultValueModalVisibel
                                            }
                                            setModalVisibel={
                                                this.setModalVisibel
                                            }
                                        />
                                    </li>
                                );
                            } else {
                                return (
                                    <li>
                                        {this.getMyInput(
                                            "默认取值",
                                            "defaultvalue"
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>不可修改</li>
                        <li>{this.getMyCheckbox("disabled")}</li>
                        <li>默认显示</li>
                        <li>{this.getMyCheckbox("visible")}</li>
                        {/* 如果默认显示为true才显示*/}
                        {(() => {
                            if (selectCard.visible) {
                                return [
                                    <li key="visibleposition0">
                                        默认显示字段排序
                                    </li>,
                                    <li key="visibleposition1">
                                        {this.getMyInput(
                                            "默认显示字段排序",
                                            "visibleposition"
                                        )}
                                    </li>
                                ];
                            }
                        })()}
                        <li>多选</li>
                        <li>{this.getMyCheckbox("ismultiselectedenabled")}</li>
                        <li>固定条件</li>
                        <li>{this.getMyCheckbox("isfixedcondition")}</li>
                        <li>必输条件</li>
                        <li>{this.getMyCheckbox("required")}</li>
                        <li>查询条件</li>
                        <li>{this.getMyCheckbox("isquerycondition")}</li>
                        <li>参照名称</li>
                        <li>{this.getMyInput("参照名称", "refname")}</li>
                        <li>参照包含下级</li>
                        <li>{this.getMyCheckbox("containlower")}</li>
                        <li>参照自动检查</li>
                        <li>{this.getMyCheckbox("ischeck")}</li>
                        <li>参照跨集团</li>
                        <li>{this.getMyCheckbox("isbeyondorg")}</li>
                        <li>使用系统函数</li>
                        <li>{this.getMyCheckbox("usefunc")}</li>
                        <li>显示类型</li>
                        <li>
                            {this.getMySelect(utilService.showType, "showtype")}
                        </li>
                        <li>返回类型</li>
                        <li>
                            {this.getMySelect(
                                utilService.returnType,
                                "returntype"
                            )}
                        </li>
                    </ul>
                </TabPane>
                <TabPane tab="高级属性" key="2">
                    <ul className="basic-property">
                        <li>数据类型</li>
                        <li>
                            {this.getMySelect(
                                utilService.dataTypeObj,
                                "datatype"
                            )}
                        </li>
                        <li>类型设置</li>
                        <li>{this.getMyInput("类型设置", "dataval")}</li>
                        <li>组件类型</li>
                        <li>
                            {this.getMySelect(
                                utilService.getItemtypeObjByDatatype(
                                    selectCard.datatype
                                ),
                                "itemtype"
                            )}
                        </li>
                        <li>自定义1</li>
                        <li>{this.getMyInput("自定义1", "define1")}</li>
                        <li>自定义2</li>
                        <li>{this.getMyInput("自定义2", "define2")}</li>
                        <li>自定义3</li>
                        <li>{this.getMyInput("自定义3", "define3")}</li>
                        <li>自定义4</li>
                        <li>{this.getMyInput("自定义4", "define4")}</li>
                        <li>自定义5</li>
                        <li>{this.getMyInput("自定义5", "define5")}</li>
                    </ul>
                </TabPane>
            </Tabs>
        );
    };
    //非查询区，元数据属性||非元数据
    getDom3 = (areaType, isMetaData) => {
        const { selectCard } = this.props;
        const isShowRelateMeta =
            selectCard.datatype === "204" ? "block" : "none"; //判断是否为参照
        const areaCardList = this.getCardListInAreaBySelectCard();
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="显示属性" key="1">
                    <ul className="basic-property">
                        <li>显示名称</li>
                        <li>{this.getMyInput("显示名称", "label")}</li>
						<li>多语字段</li>
                        <li>{this.getMyInput("多语字段", "resid")}</li>
                        <li>编码</li>
                        <li>{this.getMyInput("编码", "code")}</li>
                        {(() => {
                            if (!isMetaData) {
                                return [
                                    <li key="metadataproperty0">元数据属性</li>,
                                    <li key="metadataproperty1">
                                        {this.getMyInput(
                                            "元数据属性",
                                            "metadataproperty"
                                        )}
                                    </li>
                                ];
                            }
                        })()}
                        {(() => {
                            if (areaType === "1") {
                                //表单
                                return [
                                    <li key="colnum0">占用列数</li>,
                                    <li key="colnum1">
                                        {this.getMyInput("占用列数", "colnum")}
                                    </li>
                                ];
                            } else {
                                return [
                                    <li key="width0">组件长度</li>,
                                    <li key="width1">
                                        {this.getMyInput("组件长度", "width")}
                                    </li>
                                ];
                            }
                        })()}
                        <li>最大长度</li>
                        <li>{this.getMyInput("最大长度", "maxlength")}</li>
                        <li>可修订</li>
                        <li>{this.getMyCheckbox("isrevise")}</li>
                        {(() => {
                            if (areaType === "1") {
                                //表单
                                return [
                                    <li key="nextrow0">另起一行</li>,
                                    <li key="nextrow1">
                                        {this.getMyCheckbox("isnextrow")}
                                    </li>
                                ];
                            } else {
                                return [
                                    <li key="istotal0">合计</li>,
                                    <li key="istotal1">
                                        {this.getMyCheckbox("istotal")}
                                    </li>
                                ];
                            }
                        })()}
                        <li>可见</li>
                        <li>{this.getMyCheckbox("visible")}</li>
                        <li>必输项</li>
                        <li>{this.getMyCheckbox("required")}</li>
                        <li>不可修改</li>
                        <li>{this.getMyCheckbox("disabled")}</li>
                        <li>默认取值</li>
                        {(() => {
                            if (
                                selectCard.datatype === "204" &&
                                !_.isUndefined(selectCard.refcode) &&
                                selectCard.refcode !== "" &&
                                selectCard.refcode !== null
                            ) {
                                //参照
                                return (
                                    <li>
                                        {this.getMySearch(
                                            "defaultvalue",
                                            "defaultValueModalVisibel"
                                        )}
                                        <DefaultValueModal
                                            refcode={selectCard.refcode}
                                            isMultiSelectedEnabled={Boolean(
                                                selectCard.ismultiselectedenabled
                                            )}
                                            handleSelectChange={
                                                this.handleSelectChange
                                            }
                                            defaultvalue={
                                                selectCard.defaultvalue
                                            }
                                            modalVisibel={
                                                this.state
                                                    .defaultValueModalVisibel
                                            }
                                            setModalVisibel={
                                                this.setModalVisibel
                                            }
                                        />
                                    </li>
                                );
                            } else {
                                return (
                                    <li>
                                        {this.getMyInput(
                                            "默认取值",
                                            "defaultvalue"
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>默认系统变量</li>
                        <li>
                            {this.getMySelect(
                                utilService.defaultvarObj,
                                "defaultvar"
                            )}
                        </li>
                        <li>显示颜色</li>
                        <li>
                            {this.getMySelect(utilService.colorObj, "color")}
                        </li>
                    </ul>
                </TabPane>
                <TabPane tab="高级属性" key="2">
                    <ul className="basic-property">
                        <li>数据类型</li>
                        {/* 元数据，禁止设置datatype属性，除了56自定义项*/}
                        {(() => {
                            if (isMetaData) {
                                if (selectCard.isdefined) {
                                    //通过isdefined判断是否为自定义项，可以选择数据类型
                                    return (
                                        <li>
                                            {this.getMySelect(
                                                utilService.dataTypeObj,
                                                "datatype"
                                            )}
                                        </li>
                                    );
                                } else {
                                    let showDataTypeName = utilService.getDatatypeName(
                                        selectCard.datatype
                                    );
                                    showDataTypeName =
                                        showDataTypeName === ""
                                            ? selectCard.datatype
                                            : showDataTypeName;
                                    return <li>{showDataTypeName}</li>;
                                }
                            } else {
                                return (
                                    <li>
                                        {this.getMySelect(
                                            utilService.dataTypeObj,
                                            "datatype"
                                        )}
                                    </li>
                                );
                            }
                        })()}
                        <li>类型设置</li>
                        {(() => {
                            switch (true) {
                                case selectCard.datatype === "204": //参照
                                    return (
                                        <li>
                                            {this.getMySearch(
                                                "refname",
                                                "referModalVisibel"
                                            )}
                                            <ReferModal
                                                handleSelectChange={
                                                    this.handleSelectChange
                                                }
                                                dataval={selectCard.dataval}
                                                refname={selectCard.refname}
                                                iscode={selectCard.iscode}
                                                modalVisibel={
                                                    this.state.referModalVisibel
                                                }
                                                setModalVisibel={
                                                    this.setModalVisibel
                                                }
                                            />
                                        </li>
                                    );
                                case selectCard.datatype === "2" ||
                                    selectCard.datatype === "52" ||
                                    selectCard.datatype === "4": //2小数、4整数、52金额
                                    return (
                                        <li>
                                            {this.getMySearch(
                                                "dataval",
                                                "moneyModalVisibel"
                                            )}
                                            <MoneyModal
                                                datatype={selectCard.datatype}
                                                handleSelectChange={
                                                    this.handleSelectChange
                                                }
                                                initVal={selectCard.dataval}
                                                modalVisibel={
                                                    this.state.moneyModalVisibel
                                                }
                                                setModalVisibel={
                                                    this.setModalVisibel
                                                }
                                            />
                                        </li>
                                    );
                                case selectCard.datatype === "57": //自定义档案
                                    return (
                                        <li>
                                            {this.getMySearch(
                                                "dataval",
                                                "customModalVisibel"
                                            )}
                                            <CustomModal
                                                handleSelectChange={
                                                    this.handleSelectChange
                                                }
                                                initVal={selectCard.dataval}
                                                modalVisibel={
                                                    this.state
                                                        .customModalVisibel
                                                }
                                                setModalVisibel={
                                                    this.setModalVisibel
                                                }
                                            />
                                        </li>
                                    );
                                default:
                                    return (
                                        <li>
                                            {this.getMyInput(
                                                "类型设置",
                                                "dataval"
                                            )}
                                        </li>
                                    );
                            }
                        })()}

                        {(() => {
                            if (isMetaData) {
                                return (
                                    <li style={{ display: isShowRelateMeta }}>
                                        元数据编辑关联项
                                    </li>
                                );
                            }
                        })()}
                        {(() => {
                            if (isMetaData) {
                                return (
                                    <li style={{ display: isShowRelateMeta }}>
                                        {this.getMySearch(
                                            "relatemeta",
                                            "relateMetaModalVisibel"
                                        )}
                                        <RelateMetaModal
                                            cards={areaCardList}
                                            handleSelectChange={
                                                this.handleSelectChange
                                            }
                                            initVal={selectCard.relatemeta}
                                            modalVisibel={
                                                this.state
                                                    .relateMetaModalVisibel
                                            }
                                            setModalVisibel={
                                                this.setModalVisibel
                                            }
                                        />
                                    </li>
                                );
                            }
                        })()}

                        <li>组件类型</li>
                        <li>
                            {this.getMySelect(
                                utilService.getItemtypeObjByDatatype(
                                    selectCard.datatype
                                ),
                                "itemtype"
                            )}
                        </li>
                        <li>显示公式</li>
                        <li>
                            {this.getMyFormulaSearch("showformula")}
                            {(() => {
                                if (this.state.showformula) {
                                    return (
                                        <FormulaEditor
                                            value={selectCard["showformula"]}
                                            isValidateOnOK={true}
                                            validateUrl={
                                                "/nccloud/platform/formula/check.do"
                                            }
                                            formulaUrl={`/nccloud/platform/formula/control.do`}
                                            treeParam={{
                                                pk_billtype: "CM02",
                                                bizmodelStyle: "fip",
                                                classid: ""
                                            }}
                                            noShowAttr={["元数据属性"]}
                                            show={this.state.showformula}
                                            onHide={() => {
                                                this.setState({
                                                    showformula: false
                                                });
                                            }}
                                            attrConfig={this.state.tab}
                                            onOk={val => {
                                                this.handleSelectChange(
                                                    val,
                                                    "showformula"
                                                );
                                                this.setState({
                                                    showformula: false
                                                });
                                            }}
                                            onCancel={() => {
                                                this.setState({
                                                    showformula: false
                                                });
                                            }}
                                        />
                                    );
                                }
                            })()}
                        </li>
                        <li>编辑公式</li>
                        <li>
                            {this.getMyFormulaSearch("editformula")}
                            {(() => {
                                if (this.state.editformula) {
                                    return (
                                        <FormulaEditor
                                            value={selectCard["editformula"]}
                                            isValidateOnOK={true}
                                            validateUrl={
                                                "/nccloud/platform/formula/check.do"
                                            }
                                            formulaUrl={`/nccloud/platform/formula/control.do`}
                                            noShowAttr={["元数据属性"]}
                                            show={this.state.editformula}
                                            onHide={() => {
                                                this.setState({
                                                    editformula: false
                                                });
                                            }}
                                            attrConfig={this.state.tab}
                                            onOk={val => {
                                                this.handleSelectChange(
                                                    val,
                                                    "editformula"
                                                );
                                                this.setState({
                                                    editformula: false
                                                });
                                            }}
                                            onCancel={() => {
                                                this.setState({
                                                    editformula: false
                                                });
                                            }}
                                        />
                                    );
                                }
                            })()}
                        </li>

                        <li>验证公式</li>
                        <li>
                            {this.getMyFormulaSearch("validateformula")}
                            {(() => {
                                if (this.state.validateformula) {
                                    return (
                                        <FormulaEditor
                                            value={
                                                selectCard["validateformula"]
                                            }
                                            isValidateOnOK={true}
                                            validateUrl={
                                                "/nccloud/platform/formula/check.do"
                                            }
                                            formulaUrl={`/nccloud/platform/formula/control.do`}
                                            noShowAttr={["元数据属性"]}
                                            show={this.state.validateformula}
                                            onHide={() => {
                                                this.setState({
                                                    validateformula: false
                                                });
                                            }}
                                            attrConfig={this.state.tab}
                                            onOk={val => {
                                                this.handleSelectChange(
                                                    val,
                                                    "validateformula"
                                                );
                                                this.setState({
                                                    validateformula: false
                                                });
                                            }}
                                            onCancel={() => {
                                                this.setState({
                                                    validateformula: false
                                                });
                                            }}
                                        />
                                    );
                                }
                            })()}
                        </li>
                        <li>元数据访问路径</li>
                        <li title={selectCard.metapath} className="metapath">
                            {selectCard.metapath}
                        </li>
                        <li>自定义1</li>
                        <li>{this.getMyInput("自定义1", "define1")}</li>
                        <li>自定义2</li>
                        <li>{this.getMyInput("自定义2", "define2")}</li>
                        <li>自定义3</li>
                        <li>{this.getMyInput("自定义3", "define3")}</li>
                    </ul>
                </TabPane>
            </Tabs>
        );
    };

    // 获取主表
    getMainArea = (areaList, headcode) => {
        if (!headcode) return;
        let result;
        _.forEach(areaList, (val, index) => {
            if (val.code === headcode) {
                result = val;
                return;
            }
        });
        return result;
    };

    // componentWillUpdate(nextProps,nextState) {
    // 		this.handleFormula(nextProps);
    // }
    // 公式编辑器
    handleFormula = () => {
        const { selectCard, areaList } = this.props;
        if (_.isEmpty(selectCard) || _.isEmpty(areaList)) return;
        let headcode = areaList[0] && areaList[0].headcode;
        let area = this.getArea(areaList, selectCard); //当前区域
        let tab;
        //  tab页需要展示当前区域和表头区域
        //如果headcode不存在存在
        if (!headcode || (headcode && headcode === area.code)) {
            tab = [
                {
                    tab: area.name,
                    TabPaneContent: Formula,
                    params: { name: area }
                }
            ];
        } else if (headcode && headcode !== area.code) {
            //如果headcode不存在存在
            let mainArea = this.getMainArea(areaList, headcode); //表头区域
            tab = [
                {
                    tab: area.name,
                    key: "main",
                    TabPaneContent: Formula,
                    params: { name: area }
                },
                {
                    tab: mainArea.name,
                    key: "head",
                    TabPaneContent: Formula,
                    params: { name: mainArea }
                }
            ];
        }
        this.setState({ tab });
    };
    render() {
        const { selectCard, areaList } = this.props;
        // 1 判断是否是元数据 2 判断所属的类型是否是查询区  默认是 不是元数据 不是查询区
        // 处理公式编辑器
        let result_div;
        if (_.isEmpty(selectCard)) {
            result_div = <div />;
        } else {
            let isMetaData = this.getMetaType(selectCard);
            let areaType = this.getAreaType(areaList, selectCard);
            let isSearch = areaType === "0";
            if (isSearch) {
                //不区分显示属性和高级属性
                if (isMetaData) {
                    //元数据中metapath 和datatype和类型设置 为只读
                    result_div = this.getDom1();
                } else {
                    //非元数据metapath为空且只读，datatype和类型设置 为可以设置
                    result_div = this.getDom2();
                }
            } else {
                //非查询区，元数据||非元数据
                result_div = this.getDom3(areaType, isMetaData);
            }
        }

        return (
            <div className="template-setting-right-sider template-setting-sider">
                <div className="sider-content">
                    <div className="sider-tab">{result_div}</div>
                </div>
            </div>
        );
    }
}
export default connect(
    state => ({
        areaList: state.zoneSettingData.areaList,
        selectCard: state.zoneSettingData.selectCard
    }),
    {
        updateAreaList,
        updateSelectCard
    }
)(MyRightSider);
