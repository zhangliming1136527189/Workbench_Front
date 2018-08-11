import Ajax from "Pub/js/ajax";
export default function(props) {
    let url, data;
    url = "/nccloud/platform/templet/previewtemplet.do";
    data = {
        templetid: props.templetid
    };
    Ajax({
        url: url,
        data: data,
        info: {
            name: "模板",
            action: "模板预览"
        },
        success: ({ data: { data } }) => {
            if (data && data.length > 0) {
                let meta = data.reduce((pre, cur, i) => {
                    if (
                        cur[Object.keys(cur)[0]] &&
                        cur[Object.keys(cur)[0]].moduletype === "form"
                    ) {
                        cur[Object.keys(cur)[0]].status = "edit";
                        cur[Object.keys(cur)[0]].items.map(formItem => {
                            if (formItem.col) {
                                console.log(formItem.col - 0);
                                if(formItem.col === '3'||formItem.col === '4'||formItem.col === '6'||formItem.col === '12'){

                                }else{
                                    formItem.col = "4";
                                }
                            }
                        });
                    }
                    return { ...pre, ...cur }; // 数组拆开 展开为模板数据格式
                }, {});
                props.meta.setMeta(meta);
                props.updatePreviewData(data);
            }
        }
    });
}
