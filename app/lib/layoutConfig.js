define([
], function() {
    'use strict';
    var layoutConfig ={
        shopManageDetail: [
            [{'title':'发证机关', 'name':'approveCode', 'showName':'approveCodeText', 'type':'text'},
            {'title':'特行证号', 'required':true, 'name':'specialIndustryCertificateNum'}],

            [{'title':'印章系统安装情况', 'name':'sealSystemInstallState', 'type':'select', 'map':'seal_system_install_state'},
            {'title':'企业状态', 'name':'enterpriseState', 'type':'select', 'map':'enterprise_state'}],

            [{'title':'发证日期', 'required':true, 'name':'certificationDate', 'type':'date'},
            {'title':'初次发证日期', 'required':true, 'name':'firstCertificationDate', 'type':'date'}],

            [{'title':'有效起始日期', 'required':true, 'name':'certificationStart', 'type':'date'},
            {'title':'有效截止日期', 'required':true, 'name':'certificationEnd', 'type':'date'}],

            [{'title':'责任民警姓名', 'name':'policeName'},
            {'title':'责任民警电话', 'name':'policePhone'}],

            [{'title':'治安级别', 'name':'placeLevel', 'type':'select', 'map':'place_level'}],

            [{'title':'法定代表人', 'required':true, 'name':'legalPerson'},
            {'title':'企业负责人', 'required':true, 'name':'enterprisePrincipal'}],
            
            [{'title':'手机号码', 'name':'legalPersonPhone'},
            {'title':'手机号码', 'name':'enterprisePrincipalPhone'}],

            [{'title':'身份证号码', 'name':'legalPersonIdno'},
            {'title':'身份证号码', 'name':'enterprisePrincipalIdno'}],

            [{'title':'执照名称', 'required':true, 'name':'name'},
            {'title':'营业执照号', 'name':'businessLicenseNum'}],

            [{'title':'招牌名称', 'name':'signboardName'},
            {'title':'成立日期', 'name':'createdAt', 'type':'date'}],

            [{'title':'企业性质', 'name':'property', 'type':'select', 'map':'unit_nature'},
            {'title':'注册资本(万元)', 'name':'registerCapital'}],

            [{'title':'执照地址', 'name':'licenseAddress'},
            {'title':'经营范围(主营)', 'name':'operatingScope'}],

            [{'title':'实际经营地址', 'name':'address'},
            {'title':'经营项目(兼营)', 'name':'operatingProject'}],

            [{'title':'经营楼层', 'name':'operatingFloor'},
            {'title':'经营面积(平方米)', 'name':'operatingArea'}],

            [{'title':'灭火器(个)', 'name':'fireExtinguisher'},
            {'title':'喷淋头(个)', 'name':'sprayHeader'}],

            [{'title':'监控探头(个)', 'name':'monitorCamera'},
            {'title':'监控保存时间(天)', 'name':'monitorSaveTime'}],

            [{'title':'保安负责人', 'name':'securityChief'},
            {'title':'手机号码', 'name':'securityChiefPhone'}],

            [{'title':'保安员(人)', 'name':'securityPeople'},
            {'title':'所属保安单位', 'name':'securityCompany'}]
        ]
    };
    return layoutConfig;
});