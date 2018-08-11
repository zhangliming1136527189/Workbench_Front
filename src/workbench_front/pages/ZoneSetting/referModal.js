import React, { Component } from "react";
import _ from "lodash";
import Ajax from "Pub/js/ajax";
import { connect } from "react-redux";
import { Modal, Button, Select, Checkbox } from "antd";
const Option = Select.Option;
//参照模态框
class ReferModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pk_refinfo: "",
            refname: this.props.refname,
            iscode: this.props.iscode,
            option: []
        };
        this.onOkDialog = this.onOkDialog.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisibel !== true) {
            return;
        } else {
            let dataval = this.props.dataval;
            if (!_.isEmpty(dataval)) {
                let pk_refinfo = dataval.split(",")[0];
                this.setState({
                    pk_refinfo: pk_refinfo,
                    refname: nextProps.refname,
                    iscode: nextProps.iscode
                });
            }
            let url, data;
            url = "/nccloud/platform/templet/queryrefinfo.do";
            data = {
                defdoc: nextProps.selectCard && nextProps.selectCard.metaid
            };
            Ajax({
                url: url,
                data: data,
                info: {
                    name: "参照",
                    action: "查询参照"
                },
                success: ({ data }) => {
                    if (data.success && data.data) {
                        this.setState({ option: data.data });
                    } else {
                        Notice({ status: "error", msg: data.data.true });
                    }
                }
            });
        }
    }

	showModalHidden = () => {
		this.props.setModalVisibel('referModalVisibel', false);
	};
	async  onOkDialog(){
		let { refname, iscode, pk_refinfo,option } = this.state;
		const mycode = iscode ? 'Y' : 'N';
		const filterOption = _.filter(option,(o)=>{
			return o.pk_refinfo === pk_refinfo
		})
		if(filterOption){
			await this.props.handleSelectChange(filterOption[0].refpath, "refcode");
		}
        //设置参照refname
        await this.props.handleSelectChange(refname, "refname");
        // 设置参照名称
        await this.props.handleSelectChange(
            `${pk_refinfo},code=${mycode}`,
            "dataval"
        );
        // 设置iscode
        await this.props.handleSelectChange(iscode, "iscode");
        Ajax({
            url: `/nccloud/platform/templet/getMetaByRefName.do`,
            info: {
                scode: "关联元数据",
                action: "获取元数据数据"
            },
            data: {
                iscode: mycode,
                refname: refname
            },
            success: res => {
                if (res) {
                    let { data, success } = res.data;
                    if (success && data) {
                        // 设置元数据属性
                        this.props.handleSelectChange(data, "metadataproperty");
                    }
                }
            }
        });
        this.showModalHidden();
    }
    handleSelectChange = (pk_refinfo, name) => {
        this.setState({ pk_refinfo: pk_refinfo, refname: name });
    };
    saveValue = (e, type) => {
        let val;
        val = e.target.checked;
        this.setState({ iscode: val });
    };
    render() {
        let { iscode, option, refname, pk_refinfo } = this.state;
        // console.log(refname, iscode, this.props.selectCard);
        return (
            <div className="myZoneModal">
                <Modal
                    closable={false}
                    title="参照类型设置"
                    mask={false}
                    wrapClassName="zonesetting-referModal"
                    visible={this.props.modalVisibel}
                    onOk={this.onOkDialog}
                    destroyOnClose={true}
                    onCancel={this.showModalHidden}
                    footer={[
                        <Button
                            key="submit"
                            // disabled={}
                            type="primary"
                            onClick={this.onOkDialog}
                        >
                            确定
                        </Button>,
                        <Button key="back" onClick={this.showModalHidden}>
                            取消
                        </Button>
                    ]}
                >
                    <div>
                        <div className="descrip_label">参照设置 </div>
                        <div className="mdcontent">
                            <div>
                                <span className="refer_label">参照选择:</span>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    value={pk_refinfo}
                                    onChange={(value, optionObj) => {
										console.log(value,optionObj)
                                        this.handleSelectChange(
                                            value,
                                            optionObj.props.children
                                        );
                                    }}
                                    style={{ width: 200 }}
                                >
                                    {option.map((c, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                value={c.pk_refinfo}
                                            >
                                                {c.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="descrip_label">关联设置 </div>
                        <div className="mdcontent">
                            <div>
                                <span className="refer_label">
                                    焦点离开后参照显示编码:
                                </span>
                                <Checkbox
                                    checked={iscode}
                                    onChange={e => {
                                        this.saveValue(e);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default connect(
    state => ({
        selectCard: state.zoneSettingData.selectCard
    }),
    {}
)(ReferModal);
