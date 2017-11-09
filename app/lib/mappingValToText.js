define(['./service'],function(service){
	var mappings={
		idcard_type: {},//证件类型
	    unit_status: {},//使用单位状态
	    unit_nature: {},//使用单位企业性质
	    seal_type: {},//印章类型
	    seal_shape:{},
	    seal_material:{},//印章材料
	    seal_center_design:{},
	    seal_text_comparison:{},
	    seal_width:{},
	    seal_height:{},
	    seal_edge_width:{},
	    seal_name: {},
	    unit_type: {},
	    eseal_status: {},
	    seal_status: {},
	    to_areas: {},//转区使用
	    seal_cancel_type:{},
	    transferStatusMap : {
	        0: '转区中',
	        1: '未转区'
	    },//转区使用
        seal_deliver_status:{},//交付采集
        seal_system_install_state:{},
        enterprise_state:{},
        place_level:{}      
	}
	mappings.mapList = [
	    'seal_type',
	    'seal_shape',
	    'seal_material',
	    'seal_center_design',
	    'seal_text_comparison',
	    'seal_width',
	    'seal_height',
	    'seal_edge_width',
	    'idcard_type',
	    'unit_nature',
	    'unit_type',
	    'seal_name',
	    'unit_status',
	    'eseal_status',
	    'seal_status',
	    'seal_cancel_type',
	    'seal_deliver_status'
	];
	mappings.getMutipleMapping=function(list){
	    var dtd = $.Deferred();
	    var type, postList = [], postStr, postItem;
	    for(var i=0, j=list.length; i<j; i++){
	        postList.push(list[i]);
	    }
	    postStr = postList.join(",");
	    service.getMappingByType(postStr).done(function(ret){
	        if(service.successCheckCode(ret)){
                mappings.list = ret.data;
	            for(var m in ret.data){
	                var list = ret.data[m]
	                for(var k=0 ; k<list.length;k++){
	                    mappings[m][list[k].value]=list[k].name
	                }
	            }
	            dtd.resolve();

	        }
	    });
	    
	    return dtd.promise();
	}
	return mappings;
})