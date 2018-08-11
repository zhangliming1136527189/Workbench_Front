import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
/**
 * 预警消息提示
 * @param {String} c  应用编码
 * @param {String} n  应用名称
 */
export const Forewarning = (c, n) => {
    Ajax({
        url: `/nccloud/platform/appregister/queryalertmessages.do`,
        data: {
            appcode: c
        },
        info: {
            name: n,
            action: "预警信息"
        },
        success: ({ data: { data } }) => {
            if (data && data.length > 0) {
                data.map(item => {
                    Notice({
                        status: "warning",
                        duration: null,
                        msg: (
                            <a href={`${item.alertFileUrl}`}  target="_blank">
                                {item.alertName}
                            </a>
                        )
                    });
                });
            }
        }
    });
};
