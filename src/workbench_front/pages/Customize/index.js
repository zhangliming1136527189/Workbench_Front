import React, { Component } from "react";
import {
    PageLayout,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import MenuList from "./MenuList";
import { high } from "nc-lightapp-front";
import Loadable from "react-loadable";
import Loading from "Components/Loading";
import Ajax from "Pub/js/ajax";
import "./index.less";
const { Refer } = high;
const DefaultSetting = Loadable({
    loader: () => import("./DefaultSetting"),
    loading: Loading
});
const IfrContainer = Loadable({
    loader: () => import("./IfrContainer"),
    loading: Loading
});
class Customize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "default",
            listArray: []
        };
    }
    /**
     * 个性化页面页面
     * @param {String} key 菜单标识
     */
    hanleMenuListClick = key => {
        console.log(key);
        let { listArray } = this.state;
        // 为选中list 项添加 活跃标识
        listArray = listArray.map((item, index) => {
            delete item.active;
            if (item.url === key) {
                item.active = true;
            }
            return item;
        });
        this.setState({ listArray, activeKey: key });
    };
    /**
     *
     */
    loadCom = key => {
        switch (key) {
            case "default":
                return <DefaultSetting title={"默认设置"} />;
            default:
                // let listItem = this.state.listArray.find((item)=>item.page_part_url === key);
                return <IfrContainer ifr = {key} />;
        }
    };
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryindividualreg.do`,
            info: {
                name: "个性化",
                action: "查询"
            },
            success: ({ data: { data } }) => {
                if (data) {
                    let listArray = data.map((item, index) => {
                        if (index === 0) {
                            return {
                                active: true,
                                name: item.name,
                                code: item.code,
                                url: item.page_part_url
                            };
                        }
                        return {
                            name: item.name,
                            code: item.code,
                            url: item.page_part_url
                        };
                    });
                    this.setState({ listArray });
                }
            }
        });
    }

    render() {
        let { listArray } = this.state;
        return (
            <PageLayout>
                <PageLayoutLeft>
                    {listArray.length > 0 ? (
                        <MenuList
                            onClick={this.hanleMenuListClick}
                            listArray={listArray}
                        />
                    ) : (
                        ""
                    )}
                </PageLayoutLeft>
                <PageLayoutRight>
                    {listArray.length > 0
                        ? this.loadCom(this.state.activeKey)
                        : ""}
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
export default Customize;
