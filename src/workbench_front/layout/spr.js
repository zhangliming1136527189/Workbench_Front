import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
import moment from 'moment';
let resTime;
export const sprLog =(type,callback)=>{
    if(type){
        Ajax({
            url:'/nccloud/platform/spr/start.do',
            info:{
				name:'spr',
				action:'开启'
			},
            data:{
                oprtime:moment().format('YYYY-MM-DD HH:mm:SS'),
                userid:'1001A4100000000055NR'
            },
            success:(res)=>{
                let {data} = res.data;
                if(data){
                    resTime = data;
                    callback(!type);
                }else{
                    Notice({ status: 'error', msg: res.error.message });
                }
            }
        });
    }else{
        let win = window.open('','_blank');
        Ajax({
            url:'/nccloud/platform/spr/end.do',
            info:{
				name:'spr',
				action:'结束'
			},
            data:{
                oprtime:resTime,
                userid:'1001A4100000000055NR'
            },
            success:(res)=>{
                let {data} = res.data;
                if(data){
                    callback(!type);
                    win.location.href = data;
                    win.focus();
                }else{
                    win.close();
                    Notice({ status: 'error', msg: res.error.message });
                }
            }
        });
    }
}