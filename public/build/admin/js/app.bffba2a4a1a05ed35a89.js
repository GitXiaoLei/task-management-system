webpackJsonp([1],{"5R34":function(e,t){},BurA:function(e,t,r){"use strict";var a=r("//Fk"),n=r.n(a),s=r("n5Qe");t.a={name:"user",data:function(){return{userData:[],addUserForm:{username:""},editUserForm:{username:"",real_name:"",sex:0,department_name:"",class_name:"",student_id:"",phone_num:"",qq_num:""},editDialogVisible:!1,roleDialogVisible:!1,editIndex:-1,canVisit:-1,departmentArr:[],sexArr:[],checkboxArr:[],roleData:[],tempRow:{}}},methods:{getUser:function(){var e=this;r.i(s.r)().then(function(t){if(t=t.data,1!==t.code)return void e.errorMsg(t.message);t.data.forEach(function(e,t,r){1===e.user_id&&r.splice(t,1)}),e.userData=t.data}).catch(function(t){e.errorMsg(t)})},addUser:function(e){var t=this;this.$refs[e].validate(function(e){e&&r.i(s.s)({username:t.addUserForm.username}).then(function(e){if(e=e.data,1!==e.code)return void t.errorMsg(e.message);t.successMsg(e.message),t.getUser()}).catch(function(e){t.errorMsg(e)})})},delUser:function(e,t){var a=this;r.i(s.t)({user_id:t.user_id}).then(function(t){if(t=t.data,1!==t.code)return void a.errorMsg(t.message);a.successMsg(t.message),a.userData.splice(e,1)}).catch(function(e){a.errorMsg(e)})},editDialog:function(e,t){var a=this;this.editUserForm=t,this.sexArr=[{value:0,label:"不设置"},{value:1,label:"男"},{value:2,label:"女"}],r.i(s.e)().then(function(e){if(e=e.data,1!==e.code)return void a.errorMsg(e.message);a.departmentArr=e.data,a.editDialogVisible=!0}).catch(function(e){a.errorMsg(e)})},updateUser:function(){var e=this;r.i(s.u)(this.editUserForm).then(function(t){if(t=t.data,1!==t.code)return void e.errorMsg(t.message);e.successMsg(t.message),e.editDialogVisible=!1}).catch(function(t){e.errorMsg(t)})},chooseRoleDialog:function(e,t){var a=this,i=this;this.roleDialogVisible=!0,this.checkboxArr=[],this.tempRow=t,new n.a(function(e,t){r.i(s.l)().then(function(r){r=r.data,1!==r.code&&(i.errorMsg(r.message),t(r.message)),r.data.forEach(function(e,t,r){1===e.role_id&&r.splice(t,1)}),i.roleData=r.data,e()}).catch(function(e){i.errorMsg(e)})}).then(function(e){r.i(s.v)({user_id:t.user_id}).then(function(e){if(e=e.data,1!==e.code)return void i.errorMsg(e.message);e.data.forEach(function(e){i.checkboxArr.push(e.role_id)})})}).catch(function(e){a.errorMsg(e)})},updateUserRole:function(e){var t=this,a=e.srcElement;a.checked?r.i(s.w)({user_id:this.tempRow.user_id,role_id:a.value}).then(function(e){if(e=e.data,1!==e.code)return t.errorMsg(e.message),void(a.checked=!1);t.successMsg(e.message)}).catch(function(e){t.errorMsg(e)}):r.i(s.x)({user_id:this.tempRow.user_id,role_id:a.value}).then(function(e){if(e=e.data,1!==e.code)return t.errorMsg(e.message),void(a.checked=!0);t.successMsg(e.message)}).catch(function(e){t.errorMsg(e)})},successMsg:function(e){this.$message({message:e,type:"success"})},errorMsg:function(e){this.$message({message:e,type:"error"})}},created:function(){var e=this;this.checkAuth("/admin/user").then(function(t){1===t?(e.getUser(),e.canVisit=1):-1===t?window.location.href="/":0===t&&(e.canVisit=0)}).catch(function(t){e.errorMsg(t)})}}},DfcI:function(e,t,r){"use strict";function a(e){r("rr0M")}var n=r("t1iz"),s=r("kk4D"),i=r("VU/8"),o=a,c=i(n.a,s.a,o,"data-v-6bec2a22",null);t.a=c.exports},E2vT:function(e,t){},ENxN:function(e,t){},EbPf:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[1===e.canVisit?r("div",[r("h2",[e._v("添加用户")]),e._v(" "),r("el-form",{ref:"addUserForm",staticClass:"add-form",attrs:{inline:!0,model:e.addUserForm}},[r("el-form-item",{attrs:{label:"用户名",required:""}},[r("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:e.addUserForm.username,callback:function(t){e.addUserForm.username=t},expression:"addUserForm.username"}})],1),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addUser("addUserForm")}}},[e._v("添加")])],1),e._v(" "),r("h2",[e._v("用户列表")]),e._v(" "),r("el-table",{staticClass:"main-table",attrs:{data:e.userData,border:""}},[r("el-table-column",{attrs:{prop:"user_id",label:"ID"}}),e._v(" "),r("el-table-column",{attrs:{prop:"username",label:"用户名"}}),e._v(" "),r("el-table-column",{attrs:{prop:"real_name",label:"真实姓名"}}),e._v(" "),r("el-table-column",{attrs:{prop:"sex",label:"性别"}}),e._v(" "),r("el-table-column",{attrs:{prop:"department_name",label:"所属院系"}}),e._v(" "),r("el-table-column",{attrs:{prop:"class_name",label:"所属班级"}}),e._v(" "),r("el-table-column",{attrs:{prop:"student_id",label:"学号"}}),e._v(" "),r("el-table-column",{attrs:{prop:"phone_num",label:"电话号码"}}),e._v(" "),r("el-table-column",{attrs:{prop:"qq_num",label:"QQ号码"}}),e._v(" "),r("el-table-column",{attrs:{label:"操作",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"small"},on:{click:function(r){e.editDialog(t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),r("el-button",{attrs:{size:"small"},on:{click:function(r){e.chooseRoleDialog(t.$index,t.row)}}},[e._v("角色")]),e._v(" "),r("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(r){e.delUser(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),r("el-dialog",{attrs:{title:"编辑用户信息",visible:e.editDialogVisible},on:{"update:visible":function(t){e.editDialogVisible=t}}},[r("el-form",{ref:"editUserForm",staticClass:"dialog-form",attrs:{model:e.editUserForm,"label-position":"right"}},[r("el-form-item",{attrs:{label:"用户名",required:""}},[r("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:e.editUserForm.username,callback:function(t){e.editUserForm.username=t},expression:"editUserForm.username"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"真实姓名",required:""}},[r("el-input",{attrs:{placeholder:"请输入真实姓名"},model:{value:e.editUserForm.real_name,callback:function(t){e.editUserForm.real_name=t},expression:"editUserForm.real_name"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"性别",required:""}},[r("el-select",{model:{value:e.editUserForm.sex,callback:function(t){e.editUserForm.sex=t},expression:"editUserForm.sex"}},e._l(e.sexArr,function(e){return r("el-option",{key:e.id,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),r("el-form-item",{attrs:{label:"所属院系",required:""}},[r("el-select",{model:{value:e.editUserForm.department_name,callback:function(t){e.editUserForm.department_name=t},expression:"editUserForm.department_name"}},e._l(e.departmentArr,function(e){return r("el-option",{key:e.id,attrs:{label:e.department_name,value:e.department_name}})}))],1),e._v(" "),r("el-form-item",{attrs:{label:"所属班级",required:""}},[r("el-input",{attrs:{placeholder:"请输入班级名称"},model:{value:e.editUserForm.class_name,callback:function(t){e.editUserForm.class_name=t},expression:"editUserForm.class_name"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"电话号码",required:""}},[r("el-input",{attrs:{placeholder:"请输入电话号码"},model:{value:e.editUserForm.phone_num,callback:function(t){e.editUserForm.phone_num=t},expression:"editUserForm.phone_num"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"QQ号码",required:""}},[r("el-input",{attrs:{placeholder:"请输入QQ号码"},model:{value:e.editUserForm.qq_num,callback:function(t){e.editUserForm.qq_num=t},expression:"editUserForm.qq_num"}})],1)],1),e._v(" "),r("span",{attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:function(t){e.editDialogVisible=!1}}},[e._v("取消")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:e.updateUser}},[e._v("提交")])],1)],1),e._v(" "),r("el-dialog",{attrs:{title:"更新用户的角色",visible:e.roleDialogVisible},on:{"update:visible":function(t){e.roleDialogVisible=t}}},[r("el-form",{ref:"accessForm"},[r("el-checkbox-group",{model:{value:e.checkboxArr,callback:function(t){e.checkboxArr=t},expression:"checkboxArr"}},e._l(e.roleData,function(t){return r("el-checkbox",{key:t.id,staticClass:"label",attrs:{label:t.role_id,name:"role"},on:{change:e.updateUserRole}},[e._v("【ID:"+e._s(t.role_id)+"】"+e._s(t.role_name))])}))],1)],1)],1):0===e.canVisit?r("div",[e._v("你没有权限访问该页面")]):r("div")])},n=[],s={render:a,staticRenderFns:n};t.a=s},Hs6F:function(e,t,r){"use strict";var a=r("//Fk"),n=r.n(a),s=r("n5Qe");t.a={name:"role",data:function(){return{roleData:[],addRoleForm:{role_name:""},accessData:[],checkboxArr:[],dialogVisible:!1,tempRow:{},canVisit:-1}},methods:{getRole:function(){var e=this;r.i(s.l)().then(function(t){if(t=t.data,1!==t.code)return void e.errorMsg(t.message);e.roleData=t.data}).catch(function(t){e.errorMsg(t)})},addRole:function(e){var t=this;this.$refs[e].validate(function(e){e&&r.i(s.m)({role_name:t.addRoleForm.role_name}).then(function(e){if(e=e.data,1!==e.code)return void t.errorMsg(e.message);t.successMsg(e.message),t.getRole()}).catch(function(e){t.errorMsg(e)})})},delRole:function(e,t){var a=this;r.i(s.n)({role_id:t.role_id}).then(function(t){if(t=t.data,1!==t.code)return void a.errorMsg(t.message);a.successMsg(t.message),a.roleData.splice(e,1)}).catch(function(e){a.errorMsg(e)})},editDialog:function(e,t){var a=this;this.dialogVisible=!0,this.checkboxArr=[],this.tempRow=t,new n.a(function(e,t){r.i(s.h)().then(function(r){if(r=r.data,1!==r.code)return a.errorMsg(r.message),void t(r.message);a.accessData=r.data,e()}).catch(function(e){a.errorMsg(e),t(e)})}).then(function(e){r.i(s.o)({role_id:t.role_id}).then(function(e){if(e=e.data,1!==e.code)return void a.errorMsg(e.message);e.data.forEach(function(e){a.checkboxArr.push(e.access_id)})}).catch(function(e){a.errorMsg(e)})}).catch(function(e){a.errorMsg(e)})},updateRoleAccess:function(e){var t=this,a=e.srcElement;a.checked?r.i(s.p)({role_id:this.tempRow.role_id,access_id:a.value}).then(function(e){if(e=e.data,1!==e.code)return t.errorMsg(e.message),void(a.checked=!1);t.successMsg(e.message)}).catch(function(e){t.errorMsg(e)}):r.i(s.q)({role_id:this.tempRow.role_id,access_id:a.value}).then(function(e){if(e=e.data,1!==e.code)return t.errorMsg(e.message),void(a.checked=!0);t.successMsg(e.message)}).catch(function(e){t.errorMsg(e)})},successMsg:function(e){this.$message({message:e,type:"success"})},errorMsg:function(e){this.$message({message:e,type:"error"})}},created:function(){var e=this;this.checkAuth("/admin/role").then(function(t){1===t?(e.getRole(),e.canVisit=1):-1===t?window.location.href="/":0===t&&(e.canVisit=0)}).catch(function(t){e.errorMsg(t)})}}},LEAN:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[1===e.canVisit?r("div",[r("h2",[e._v("添加权限")]),e._v(" "),r("el-form",{ref:"addAccessForm",staticClass:"add-form",attrs:{inline:!0,model:e.addAccessForm}},[r("el-form-item",{attrs:{label:"标题",required:""}},[r("el-input",{attrs:{placeholder:"请输入标题"},model:{value:e.addAccessForm.title,callback:function(t){e.addAccessForm.title=t},expression:"addAccessForm.title"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"URL",required:""}},[r("el-input",{attrs:{placeholder:"请输入地址"},model:{value:e.addAccessForm.url,callback:function(t){e.addAccessForm.url=t},expression:"addAccessForm.url"}})],1),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addAccess("addAccessForm")}}},[e._v("添加")])],1)],1),e._v(" "),r("h2",[e._v("权限列表")]),e._v(" "),r("el-table",{staticClass:"main-table",attrs:{data:e.accessData,height:"450"}},[r("el-table-column",{attrs:{prop:"access_id",label:"ID"}}),e._v(" "),r("el-table-column",{attrs:{prop:"access_title",label:"标题"}}),e._v(" "),r("el-table-column",{attrs:{prop:"access_url",label:"地址"}}),e._v(" "),r("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"small"},on:{click:function(r){e.editDialog(t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),r("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(r){e.delAccess(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),r("el-dialog",{attrs:{title:"编辑权限",visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[r("el-form",{ref:"editAccessForm",attrs:{inline:!0,model:e.editAccessForm}},[r("el-form-item",{attrs:{label:"标题",required:""}},[r("el-input",{attrs:{placeholder:"请输入标题"},model:{value:e.editAccessForm.access_title,callback:function(t){e.editAccessForm.access_title=t},expression:"editAccessForm.access_title"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"URL",required:""}},[r("el-input",{attrs:{placeholder:"请输入地址"},model:{value:e.editAccessForm.access_url,callback:function(t){e.editAccessForm.access_url=t},expression:"editAccessForm.access_url"}})],1)],1),e._v(" "),r("span",{attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取消")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:e.updateAccess}},[e._v("提交")])],1)],1)],1):0===e.canVisit?r("div",[e._v("你没有权限访问该页面")]):r("div")])},n=[],s={render:a,staticRenderFns:n};t.a=s},M93x:function(e,t,r){"use strict";function a(e){r("5R34")}var n=r("xJD8"),s=r("XouX"),i=r("VU/8"),o=a,c=i(n.a,s.a,o,"data-v-20c9a2f8",null);t.a=c.exports},NHnr:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r("7+uW"),n=r("M93x"),s=r("YaEn"),i=r("zL8q"),o=r.n(i),c=r("q8zI"),l=(r.n(c),r("feh2")),u=(r.n(l),r("UoXg")),d=(r.n(u),r("ENxN"));r.n(d);a.default.config.productionTip=!1,a.default.use(o.a),new a.default({el:"#app",router:s.a,template:"<App/>",components:{App:n.a}})},RU0y:function(e,t){},UoXg:function(e,t){},We04:function(e,t,r){"use strict";var a=r("n5Qe");t.a={name:"subject",data:function(){return{subjectData:[],addSubjectForm:{name:""},canVisit:-1}},methods:{getSubject:function(){var e=this;r.i(a.b)().then(function(t){if(t=t.data,1!==t.code)return void e.errorMsg(t.message);e.subjectData=t.data}).catch(function(t){e.errorMsg(t)})},addSubject:function(e){var t=this;this.$refs[e].validate(function(e){e&&r.i(a.c)({subject_name:t.addSubjectForm.name}).then(function(e){if(e=e.data,1!==e.code)return void t.errorMsg(e.message);t.successMsg(e.message),t.getSubject()}).catch(function(e){t.errorMsg(e)})})},delSubject:function(e,t){var n=this;r.i(a.d)({subject_id:t.subject_id}).then(function(t){if(t=t.data,1!==t.code)return void n.errorMsg(t.message);n.successMsg(t.message),n.subjectData.splice(e,1)}).catch(function(e){n.errorMsg(e)})},successMsg:function(e){this.$message({message:e,type:"success"})},errorMsg:function(e){this.$message({message:e,type:"error"})}},created:function(){var e=this;this.checkAuth("/admin/subject").then(function(t){1===t?(e.getSubject(),e.canVisit=1):-1===t?window.location.href="/":0===t&&(e.canVisit=0)}).catch(function(t){e.errorMsg(t)})}}},XouX:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("el-menu",{attrs:{theme:"dark","default-active":e.activeIndex,mode:"horizontal"}},[r("el-menu-item",{attrs:{index:"1"}},[r("router-link",{attrs:{to:"/admin/user"}},[e._v("用户管理")])],1),e._v(" "),r("el-menu-item",{attrs:{index:"2"}},[r("router-link",{attrs:{to:"/admin/role"}},[e._v("角色管理")])],1),e._v(" "),r("el-menu-item",{attrs:{index:"3"}},[r("router-link",{attrs:{to:"/admin/access"}},[e._v("权限管理")])],1),e._v(" "),r("el-menu-item",{attrs:{index:"4"}},[r("router-link",{attrs:{to:"/admin/department"}},[e._v("院系管理")])],1),e._v(" "),r("el-menu-item",{attrs:{index:"5"}},[r("router-link",{attrs:{to:"/admin/subject"}},[e._v("科目管理")])],1),e._v(" "),r("el-button",{staticStyle:{float:"right",margin:"10px","background-color":"#324157",color:"#fff"},on:{click:e.loginout}},[e._v("退出登录")])],1),e._v(" "),r("router-view")],1)},n=[],s={render:a,staticRenderFns:n};t.a=s},YaEn:function(e,t,r){"use strict";var a=r("7+uW"),n=r("/ocq"),s=r("ia7Y"),i=r("rvBQ"),o=r("thLP"),c=r("u5li"),l=r("DfcI"),u=r("kE1v");a.default.use(n.a),t.a=new n.a({routes:[{path:"/",redirect:"/admin/user"},{path:"/admin",redirect:"/admin/user"},{path:"/admin/user",component:s.a},{path:"/admin/role",component:i.a},{path:"/admin/access",component:c.a},{path:"/admin/department",component:l.a},{path:"/admin/subject",component:u.a},{path:"*",component:o.a}]})},d0if:function(e,t){},feh2:function(e,t){},gXVa:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",[e._v("404")])},n=[],s={render:a,staticRenderFns:n};t.a=s},ia7Y:function(e,t,r){"use strict";function a(e){r("E2vT")}var n=r("BurA"),s=r("EbPf"),i=r("VU/8"),o=a,c=i(n.a,s.a,o,"data-v-00fb8fca",null);t.a=c.exports},kE1v:function(e,t,r){"use strict";function a(e){r("d0if")}var n=r("We04"),s=r("s7PP"),i=r("VU/8"),o=a,c=i(n.a,s.a,o,"data-v-5ad1a0e8",null);t.a=c.exports},kk4D:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[1===e.canVisit?r("div",[r("h2",[e._v("添加院系")]),e._v(" "),r("el-form",{ref:"addDepartmentForm",staticClass:"add-form",attrs:{inline:!0,model:e.addDepartmentForm}},[r("el-form-item",{attrs:{label:"院系名称",required:""}},[r("el-input",{attrs:{placeholder:"请输入院系名称"},model:{value:e.addDepartmentForm.name,callback:function(t){e.addDepartmentForm.name=t},expression:"addDepartmentForm.name"}})],1),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addDepartment("addDepartmentForm")}}},[e._v("添加")])],1),e._v(" "),r("h2",[e._v("院系列表")]),e._v(" "),r("el-table",{staticClass:"main-table",attrs:{data:e.departmentData}},[r("el-table-column",{attrs:{prop:"department_id",label:"ID"}}),e._v(" "),r("el-table-column",{attrs:{prop:"department_name",label:"院系名称"}}),e._v(" "),r("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(r){e.delDepartment(t.$index,t.row)}}},[e._v("删除")])]}}])})],1)],1):0===e.canVisit?r("div",[e._v("你没有权限访问该页面")]):r("div")])},n=[],s={render:a,staticRenderFns:n};t.a=s},n5Qe:function(e,t,r){"use strict";r.d(t,"h",function(){return u}),r.d(t,"i",function(){return d}),r.d(t,"k",function(){return m}),r.d(t,"j",function(){return f}),r.d(t,"l",function(){return p}),r.d(t,"m",function(){return v}),r.d(t,"n",function(){return g}),r.d(t,"o",function(){return h}),r.d(t,"p",function(){return _}),r.d(t,"q",function(){return b}),r.d(t,"e",function(){return F}),r.d(t,"f",function(){return M}),r.d(t,"g",function(){return k}),r.d(t,"b",function(){return x}),r.d(t,"c",function(){return D}),r.d(t,"d",function(){return y}),r.d(t,"r",function(){return A}),r.d(t,"s",function(){return U}),r.d(t,"t",function(){return V}),r.d(t,"u",function(){return w}),r.d(t,"v",function(){return R}),r.d(t,"w",function(){return j}),r.d(t,"x",function(){return $}),r.d(t,"a",function(){return q});var a=r("//Fk"),n=r.n(a),s=r("mtWM"),i=r.n(s),o=r("mw3O"),c=r.n(o),l=r("7+uW");i.a.defaults.baseURL="http://localhost:3000",i.a.defaults.withCredentials=!0,l.default.prototype.checkAuth=function(e,t){return new n.a(function(t,r){i.a.get(e).then(function(e){e=e.data,t(e.code)}).catch(function(e){r(e)})})};var u=function(){return i.a.get("/api/access/list")},d=function(e){return i.a.post("/api/access/add",c.a.stringify(e))},m=function(e){return i.a.post("/api/access/update",c.a.stringify(e))},f=function(e){return i.a.post("/api/access/del",c.a.stringify(e))},p=function(){return i.a.get("/api/role/list")},v=function(e){return i.a.post("/api/role/add",c.a.stringify(e))},g=function(e){return i.a.post("/api/role/del",c.a.stringify(e))},h=function(e){return i.a.post("/api/role_access/list",c.a.stringify(e))},_=function(e){return i.a.post("/api/role_access/add",c.a.stringify(e))},b=function(e){return i.a.post("/api/role_access/del",c.a.stringify(e))},F=function(){return i.a.get("/api/department/list")},M=function(e){return i.a.post("/api/department/add",c.a.stringify(e))},k=function(e){return i.a.post("/api/department/del",c.a.stringify(e))},x=function(){return i.a.get("/api/subject/list")},D=function(e){return i.a.post("/api/subject/add",c.a.stringify(e))},y=function(e){return i.a.post("/api/subject/del",c.a.stringify(e))},A=function(){return i.a.get("/api/user/list")},U=function(e){return i.a.post("/api/user/add",c.a.stringify(e))},V=function(e){return i.a.post("/api/user/del",c.a.stringify(e))},w=function(e){return i.a.post("/api/user/update",c.a.stringify(e))},R=function(e){return i.a.post("/api/user_role/list",c.a.stringify(e))},j=function(e){return i.a.post("/api/user_role/add",c.a.stringify(e))},$=function(e){return i.a.post("/api/user_role/del",c.a.stringify(e))},q=function(){return i.a.get("/loginout")}},pg2O:function(e,t,r){"use strict";t.a={name:"notFound"}},q8zI:function(e,t){},rr0M:function(e,t){},rvBQ:function(e,t,r){"use strict";function a(e){r("vwyI")}var n=r("Hs6F"),s=r("tSwb"),i=r("VU/8"),o=a,c=i(n.a,s.a,o,null,null);t.a=c.exports},s7PP:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[1===e.canVisit?r("div",[r("h2",[e._v("添加科目")]),e._v(" "),r("el-form",{ref:"addSubjectForm",staticClass:"add-form",attrs:{inline:!0,model:e.addSubjectForm}},[r("el-form-item",{attrs:{label:"科目名称",required:""}},[r("el-input",{attrs:{placeholder:"请输入科目名称"},model:{value:e.addSubjectForm.name,callback:function(t){e.addSubjectForm.name=t},expression:"addSubjectForm.name"}})],1),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addSubject("addSubjectForm")}}},[e._v("添加")])],1),e._v(" "),r("h2",[e._v("科目列表")]),e._v(" "),r("el-table",{staticClass:"main-table",attrs:{data:e.subjectData}},[r("el-table-column",{attrs:{prop:"subject_id",label:"ID"}}),e._v(" "),r("el-table-column",{attrs:{prop:"subject_name",label:"科目名称"}}),e._v(" "),r("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(r){e.delSubject(t.$index,t.row)}}},[e._v("删除")])]}}])})],1)],1):0===e.canVisit?r("div",[e._v("你没有权限访问该页面")]):r("div")])},n=[],s={render:a,staticRenderFns:n};t.a=s},t1iz:function(e,t,r){"use strict";var a=r("n5Qe");t.a={name:"department",data:function(){return{departmentData:[],addDepartmentForm:{name:""},canVisit:-1}},methods:{getDepartment:function(){var e=this;r.i(a.e)().then(function(t){if(t=t.data,1!==t.code)return void e.errorMsg(t.message);e.departmentData=t.data}).catch(function(t){e.errorMsg(t)})},addDepartment:function(e){var t=this;this.$refs[e].validate(function(e){e&&r.i(a.f)({department_name:t.addDepartmentForm.name}).then(function(e){if(e=e.data,1!==e.code)return void t.errorMsg(e.message);t.successMsg(e.message),t.getDepartment()}).catch(function(e){t.errorMsg(e)})})},delDepartment:function(e,t){var n=this;r.i(a.g)({department_id:t.department_id}).then(function(t){if(t=t.data,1!==t.code)return void n.errorMsg(t.message);n.successMsg(t.message),n.departmentData.splice(e,1)}).catch(function(e){n.errorMsg(e)})},successMsg:function(e){this.$message({message:e,type:"success"})},errorMsg:function(e){this.$message({message:e,type:"error"})}},created:function(){var e=this;this.checkAuth("/admin/department").then(function(t){1===t?(e.getDepartment(),e.canVisit=1):-1===t?window.location.href="/":0===t&&(e.canVisit=0)}).catch(function(t){e.errorMsg(t)})}}},tSwb:function(e,t,r){"use strict";var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[1===e.canVisit?r("div",[r("h2",[e._v("添加角色")]),e._v(" "),r("el-form",{ref:"addRoleForm",staticClass:"add-form",attrs:{inline:!0,model:e.addRoleForm}},[r("el-form-item",{attrs:{label:"角色名",required:""}},[r("el-input",{attrs:{placeholder:"请输入角色名"},model:{value:e.addRoleForm.role_name,callback:function(t){e.addRoleForm.role_name=t},expression:"addRoleForm.role_name"}})],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:function(t){e.addRole("addRoleForm")}}},[e._v("添加")])],1)],1),e._v(" "),r("h2",[e._v("角色列表")]),e._v(" "),r("el-table",{staticClass:"main-table",attrs:{data:e.roleData}},[r("el-table-column",{attrs:{prop:"role_id",label:"ID"}}),e._v(" "),r("el-table-column",{attrs:{prop:"role_name",label:"角色名"}}),e._v(" "),r("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[1!==t.row.role_id?r("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(r){e.delRole(t.$index,t.row)}}},[e._v("删除")]):e._e(),e._v(" "),r("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(r){e.editDialog(t.$index,t.row)}}},[e._v("权限")])]}}])})],1),e._v(" "),r("el-dialog",{attrs:{title:"更新角色的权限",visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[r("el-form",{ref:"accessForm"},[r("el-checkbox-group",{model:{value:e.checkboxArr,callback:function(t){e.checkboxArr=t},expression:"checkboxArr"}},e._l(e.accessData,function(t){return r("el-checkbox",{key:t.id,staticClass:"label",attrs:{label:t.access_id,name:"access"},on:{change:e.updateRoleAccess}},[e._v("【ID:"+e._s(t.access_id)+"】"+e._s(t.access_url)),r("span",{staticStyle:{float:"right"}},[e._v("【"+e._s(t.access_title)+"】")])])}))],1)],1)],1):0===e.canVisit?r("div",[e._v("你没有权限访问该页面！")]):r("div")])},n=[],s={render:a,staticRenderFns:n};t.a=s},thLP:function(e,t,r){"use strict";var a=r("pg2O"),n=r("gXVa"),s=r("VU/8"),i=s(a.a,n.a,null,null,null);t.a=i.exports},u5li:function(e,t,r){"use strict";function a(e){r("RU0y")}var n=r("wfzA"),s=r("LEAN"),i=r("VU/8"),o=a,c=i(n.a,s.a,o,"data-v-785cc198",null);t.a=c.exports},vwyI:function(e,t){},wfzA:function(e,t,r){"use strict";var a=r("n5Qe");t.a={name:"access",data:function(){return{accessData:[],addAccessForm:{title:"",url:""},editAccessForm:{access_id:-1,access_title:"",access_url:""},dialogVisible:!1,editIndex:-1,canVisit:-1}},methods:{getAccess:function(){var e=this;r.i(a.h)().then(function(t){if(t=t.data,1!==t.code)return void e.errorMsg(t.message);e.accessData=t.data}).catch(function(t){e.errorMsg(t)})},addAccess:function(e){var t=this;this.$refs[e].validate(function(e){e&&r.i(a.i)({access_title:t.addAccessForm.title,access_url:t.addAccessForm.url}).then(function(e){if(e=e.data,1!==e.code)return void t.errorMsg(e.message);t.successMsg(e.message),t.getAccess()}).catch(function(e){t.errorMsg(e)})})},delAccess:function(e,t){var n=this;r.i(a.j)({access_id:t.access_id}).then(function(t){if(t=t.data,1!==t.code)return void n.errorMsg(t.message);n.successMsg(t.message),n.accessData.splice(e,1)}).catch(function(e){n.errorMsg(e)})},editDialog:function(e,t){this.editAccessForm=t,this.dialogVisible=!0,this.editIndex=e},updateAccess:function(){var e=this;r.i(a.k)(this.editAccessForm).then(function(t){if(t=t.data,e.dialogVisible=!1,1!==t.code)return void e.errorMsg(t.message);e.successMsg(t.message)}).catch(function(t){e.errorMsg(t)})},successMsg:function(e){this.$message({message:e,type:"success"})},errorMsg:function(e){this.$message({message:e,type:"error"})}},created:function(){var e=this;this.checkAuth("/admin/access").then(function(t){1===t?(e.getAccess(),e.canVisit=1):-1===t?window.location.href="/":0===t&&(e.canVisit=0)}).catch(function(t){e.errorMsg(t)})}}},xJD8:function(e,t,r){"use strict";var a=r("n5Qe");t.a={name:"app",data:function(){return{activeIndex:"1"}},methods:{loginout:function(){var e=this;r.i(a.a)().then(function(t){if(t=t.data,1!==t.code)return void e.errorMsg(t.message);e.errorMsg(t.message),window.location.href="/"}).catch(function(e){console.error(e)})},successMsg:function(e){this.$message({message:e,type:"success"})},errorMsg:function(e){this.$message({message:e,type:"error"})}},created:function(){}}}},["NHnr"]);
//# sourceMappingURL=app.bffba2a4a1a05ed35a89.js.map