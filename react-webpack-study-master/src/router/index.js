import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { createBundle } from 'widget/Common';

// 页面找不到组件
import NotFound from 'bundle-loader?lazy&name=NotFoundView!widget/NotFound/NotFoundView';
// 默认首页
import Home from 'bundle-loader?lazy&name=homeView!pages/Home/HomeView';
// 富文本组件
import RichEditor from 'bundle-loader?lazy&name=RichEditorView!pages/Demo/RichEditor/RichEditorView';
// 列表页组件
import EmpList from 'bundle-loader?lazy&name=EmpListView!pages/Demo/Emp/EmpList/EmpListView';
// 上传组件
import UploadDemo from 'bundle-loader?lazy&name=UploadDemoView!pages/Demo/Upload/UploadDemoView';
// 简易表格组件
import SimpleTable from 'bundle-loader?lazy&name=SimpleTableView!pages/Demo/SimpleTable/SimpleTableView';
// 可编辑表格组件
import EditTableDemo from 'bundle-loader?lazy&name=EditTableDemoView!pages/Demo/EditTable/EditTableDemoView';
// 面板组件
import PanelDemo from 'bundle-loader?lazy&name=PanelDemoView!pages/Demo/Panel/PanelDemoView';
// 类目树组件
import CategoryDemo from 'bundle-loader?lazy&name=CategoryDemoView!pages/Demo/Category/CategoryDemoView';
// 图片放大镜组件
import BoostDemo from 'bundle-loader?lazy&name=BoostDemoView!pages/Demo/Boost/BoostDemoView';
// 地图组件
import MapDemo from 'bundle-loader?lazy&name=MapDemoView!pages/Demo/Map/MapDemoView';
// 右侧边栏组件
import SiderPanelDemo from 'bundle-loader?lazy&name=SiderPanelDemoView!pages/Demo/SiderPanel/SiderPanelDemoView';
// 单选表格组件
import RadioTableDemo from 'bundle-loader?lazy&name=RadioTableDemoView!pages/Demo/RadioTable/RadioTableDemoView';
// 地址三级联动
import ThreeLevelDemo from 'bundle-loader?lazy&name=ThreeLevelDemoView!pages/Demo/ThreeLevel/ThreeLevelDemoView';
// 千分位组件
import ThousandBitDemo from 'bundle-loader?lazy&name=ThousandBitDemoView!pages/Demo/ThousandBit/ThousandBitDemoView';
// 树形穿梭框组件
import TreeTransferDemo from 'bundle-loader?lazy&name=TreeTransferDemoView!pages/Demo/TreeTransfer/TreeTransferDemoView';
// 打印组件
import PrintDemo from 'bundle-loader?lazy&name=PrintDemoView!pages/Demo/Print/PrintDemoView';
// 弹出选择组件
import PopupSelectDemo from 'bundle-loader?lazy&name=PopupSelectDemoView!pages/Demo/PopupSelect/PopupSelectDemoView';
// 多级树组件
import SimpleTreeDemo from 'bundle-loader?lazy&name=SimpleTreeDemoView!pages/Demo/SimpleTree/SimpleTreeDemoView';
// 右键菜单组件
import ContextMenuDemo from 'bundle-loader?lazy&name=ContextMenuDemoView!pages/Demo/ContextMenu/ContextMenuDemoView';
// 图片裁剪组件
import ImgCuttingDemo from 'bundle-loader?lazy&name=ImgCuttingDemoView!pages/Demo/ImgCutting/ImgCuttingDemoView';
// 剪贴板组件
import ClipboardDemo from 'bundle-loader?lazy&name=ClipboardDemoView!pages/Demo/Clipboard/ClipboardDemoView';
// // 用户列表模块
// import UserList from 'pages/Demo/User/UserList/UserListView';
// // 用户编辑模块
// import UserEdit from 'pages/Demo/User/UserEdit/UserEditView';
// 示例视图组件
import Hello from 'bundle-loader?lazy&name=HelloView!pages/Hello/HelloView';
// 输入框扩展组件
import InputExtDemo from 'bundle-loader?lazy&name=InputExtDemoView!pages/Demo/InputExt/InputExtDemoView';

// <!--ROUTER_IMPORT-->
const routerList = [
  {
    path: '/',
    // // 直接渲染内容，用render
    // render: () => {
    //   return <h3>默认首页</h3>
    // }
    // 懒加载组件，用component，且组件使用createBundle包裹
    component: () => { return createBundle(Home) }
  },
  {
    path: '/editor',
    // 懒加载组件，用component，且组件使用createBundle包裹
    component: () => { return createBundle(RichEditor) }
  },
  {
    path: '/emp_list',
    component: () => { return createBundle(EmpList) }
  },
  {
    path: '/upload',
    component: () => { return createBundle(UploadDemo) }
  },
  {
    path: '/simple_table',
    component: () => { return createBundle(SimpleTable) }
  },
  {
    path: '/edit_table',
    component: () => { return createBundle(EditTableDemo) }
  },
  {
    path: '/panel',
    component: () => { return createBundle(PanelDemo) }
  },
  {
    path: '/category',
    component: () => { return createBundle(CategoryDemo) }
  },
  {
    path: '/boost',
    component: () => { return createBundle(BoostDemo) }
  },
  {
    path: '/map',
    component: () => { return createBundle(MapDemo) }
  },
  {
    path: '/sider_panel',
    component: () => { return createBundle(SiderPanelDemo) }
  },
  {
    path: '/radio_table',
    component: () => { return createBundle(RadioTableDemo) }
  },
  {
    path: '/three_level',
    component: () => { return createBundle(ThreeLevelDemo) }
  },
  {
    path: '/thousand_bit',
    component: () => { return createBundle(ThousandBitDemo) }
  },
  {
    path: '/tree_transfer',
    component: () => { return createBundle(TreeTransferDemo) }
  },
  {
    path: '/print',
    component: () => { return createBundle(PrintDemo) }
  },
  {
    path: '/popup_select',
    component: () => { return createBundle(PopupSelectDemo) }
  },
  {
    path: '/tree',
    component: () => { return createBundle(SimpleTreeDemo) }
  },
  {
    path: '/context_menu',
    component: () => { return createBundle(ContextMenuDemo) }
  },
  {
    path: '/img_cutting',
    component: () => { return createBundle(ImgCuttingDemo) }
  },
  {
    path: '/clipboard',
    component: () => { return createBundle(ClipboardDemo) }
  },
  {
    path: '/user_list',
    component: () => { return createBundle(UserList) }
  },
  {
    path: '/user_edit',
    component: () => { return createBundle(UserEdit) }
  },
  {
    path: '/hello',
    component: () => { return createBundle(Hello) }
  },
  {
    path: '/input_ext',
    component: () => { return createBundle(InputExtDemo) }
  },
  // <!--ROUTER_APPEND-->
]

const getRouter = _ => (
  <div>
    <Switch>
      {
        routerList.map((route, idx) => {
          if(route.render){
            return <Route key={'route_' + idx} path={route.path} exact component={route.render} />
          }else{
            return <Route key={'route_' + idx} path={route.path} exact component={route.component()} />
          }
        })
      }
      <Route component={createBundle(NotFound)}/>
    </Switch>
  </div>
);

export { getRouter }