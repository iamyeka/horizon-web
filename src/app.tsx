import type {MenuDataItem, Settings as LayoutSettings} from '@ant-design/pro-layout';
import {PageLoading} from '@ant-design/pro-layout';
import {Menu, notification, Tooltip, Button} from 'antd';
import type {RequestConfig, RunTimeLayoutConfig} from 'umi';
import {history} from 'umi';
import RBAC from '@/rbac';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {currentUser as queryCurrentUser} from './services/login/login';
import {
  AppstoreOutlined,
  BankOutlined,
  ContactsOutlined,
  FundOutlined,
  SettingOutlined,
  SmileOutlined,
  TagsOutlined,
  DownOutlined
} from '@ant-design/icons/lib';
import Utils, {pathnameInStaticRoutes} from '@/utils';
import {queryResource} from '@/services/core';
import {stringify} from 'querystring';
import {routes} from '../config/routes';
import {ResourceType} from '@/const'
import {queryRoles, querySelfMember} from "@/services/members/members";

const loginPath = '/user/login';
const queryUserPath = '/apis/login/v1/status';
const sessionExpireHeaderKey = 'X-OIDC-Redirect-To';
const {SubMenu} = Menu;

const IconMap = {
  smile: <SmileOutlined/>,
  contacts: <ContactsOutlined/>,
  setting: <SettingOutlined/>,
  bank: <BankOutlined/>,
  appstore: <AppstoreOutlined/>,
  fundout: <FundOutlined/>,
  tags: <TagsOutlined/>
};

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({icon, children, ...item}) => ({
    ...item,
    icon: icon && IconMap[icon as string],
    children: children && loopMenuItem(children),
  }));

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading/>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  roles?: API.Role[];
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  resource: API.Resource;
  accordionCollapse: boolean;
}> {
  const settings: Partial<LayoutSettings> = {};
  const resource: API.Resource = {
    fullName: '',
    fullPath: '',
    id: 0,
    name: '',
    type: 'group',
    parentID: 0,
  };
  let currentUser: API.CurrentUser | undefined = {
    id: 0,
    name: "",
    isAdmin: false,
    role: RBAC.AnonymousRole,
  }
  let roles: API.Role[] = [];

  try {
    const {data: userData} = await queryCurrentUser();

    if (userData?.id && history.location.pathname.startsWith(loginPath)) {
      history.replace('/');
    }

    currentUser.id = userData.id
    currentUser.name = userData.name
    currentUser.isAdmin = userData.isAdmin

    const {data: rolesData} = await queryRoles()
    roles = rolesData


  } catch (e) {
    currentUser = undefined
  }

  // 资源类型的URL
  if (!pathnameInStaticRoutes()) {
    const path = Utils.getResourcePath();
    try {
      const {data: resourceData} = await queryResource(path);
      resource.id = resourceData.id;
      resource.name = resourceData.name;
      resource.type = resourceData.type;
      resource.fullName = resourceData.fullName;
      resource.fullPath = resourceData.fullPath;

      const {data: memberData} = await querySelfMember(resource.type, resource.id)
      if (memberData.total > 0) {
        currentUser!.role = memberData.items[0].role;
      } else {
        currentUser!.role = RBAC.AnonymousRole;
      }
      if (currentUser!.isAdmin) {
        currentUser!.role = RBAC.AdminRole
      }

      RBAC.RefreshPermissions(roles, currentUser!);

    } catch (e) {
      settings.menuRender = false;
    }
  }

  return {
    currentUser,
    roles,
    settings,
    resource,
    accordionCollapse: false,
  };
}

export const request: RequestConfig = {
  responseInterceptors: [
    (response) => {
      // 我们认为只有查询用户接口的响应带上了session过期的头，才跳转到登陆页
      if (response.headers.get(sessionExpireHeaderKey) && response.url.endsWith(queryUserPath)) {
        history.push({
          pathname: loginPath,
          search: stringify({
            redirect: history.location.pathname + history.location.search,
          }),
        });
        return response
      }
      // 其他接口请求（在非登陆页面下），如果响应里有session过期的头，调一次查询用户接口，进行一次二次确认
      if (response.headers.get(sessionExpireHeaderKey) && !history.location.pathname.startsWith(loginPath)) {
        // double check session
        queryCurrentUser()
      }
      return response;
    },
  ],
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        success: !resData.errorCode,
      };
    },
  },
  errorHandler: (error: any) => {
    const {response, data} = error;
    if (!response) {
      notification.error({
        message: '网络异常',
        description: '您的网络发生异常，无法连接服务器',
      });
    }
    if (data.errorCode || data.errorMessage) {
      notification.error({
        message: data.errorCode,
        description: data.errorMessage,
      });
    } else {
      notification.error({
        message: response.status,
        description: response.statusText,
      });
    }
    throw error;
  },
};

const formatSubMenu = (title: string, selected: boolean) => {
  return selected ? <Button>
    {title}
    <DownOutlined style={{color: 'black'}}/>
  </Button> : <div>
    {title}
    <DownOutlined  style={{marginLeft: 8}}/>
  </div>
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// @ts-ignore
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  return {
    headerContentRender: () => {
      const pathname = history.location.pathname
      return <Menu mode="horizontal" theme={'dark'}  style={{marginLeft: '10px', color: '#989898'}} selectable={false}>
        <SubMenu key="sub1" title={formatSubMenu('Clusters', pathname === '/dashboard/clusters' || pathname === '/explore/clusters')}>
          <Menu.Item key="1">
            <a style={{fontWeight: 'bold'}} href={'/dashboard/clusters'}>Your clusters</a>
          </Menu.Item>
          <Menu.Item key="2">
            <a style={{fontWeight: 'bold'}} href={'/explore/clusters'}>All clusters</a>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="sub2" title={formatSubMenu('Applications', pathname === '/dashboard/applications' || pathname === '/explore/applications')}>
          <Menu.Item key="3">
            <a style={{fontWeight: 'bold'}} href={'/dashboard/applications'}>Your applications</a>
          </Menu.Item>
           <Menu.Item key="4">
             <a style={{fontWeight: 'bold'}} href={'/explore/applications'}>All applications</a>
           </Menu.Item>
        </SubMenu>

        <SubMenu key="sub3" title={formatSubMenu('Groups', pathname === '/dashboard/groups')}>
          <Menu.Item key="5">
            <a style={{fontWeight: 'bold'}} href={'/dashboard/groups'}>All groups</a>
          </Menu.Item>
        </SubMenu>
      </Menu>
    },
    rightContentRender: () => <RightContent/>,
    footerRender: () => <Footer/>,
    onPageChange: () => {
    },
    menuHeaderRender: () => {
      const {name: title, fullPath} = initialState?.resource || {};
      if (!title || !fullPath) {
        return false;
      }

      const {accordionCollapse = false} = initialState || {};
      const firstLetter = title.substring(0, 1).toUpperCase();
      if (!accordionCollapse) {
        const titleContent = title.length <= 15 ? title : `${title.substr(0, 12)}...`
        return (
          <Tooltip title={title}>
            <span
              style={{alignItems: 'center', lineHeight: '40px'}}
              onClick={() => {
                window.location.href = fullPath;
              }}
            >
              <span className={`avatar-40 identicon bg${Utils.getAvatarColorIndex(title)}`}>
                {firstLetter}
              </span>
              <span style={{alignItems: 'center', marginLeft: 60, color: 'black', fontSize: '16px'}}>
                {titleContent}
              </span>
            </span>
          </Tooltip>
        );
      }

      return (
        <Tooltip title={title}>
          <span
            style={{alignItems: 'center', lineHeight: '40px'}}
            onClick={() => {
              window.location.href = fullPath;
            }}
          >
            <span className={`avatar-40 identicon bg${Utils.getAvatarColorIndex(title)}`}>
              {firstLetter}
            </span>
            <span style={{alignItems: 'center', marginLeft: 60, color: 'black', fontSize: '16px'}}/>
          </span>
        </Tooltip>
      );
    },
    menu: {
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: {
        resource: initialState?.resource
      },
      request: async (params, defaultMenuData) => {
        if (pathnameInStaticRoutes() || !initialState) {
          return defaultMenuData;
        }

        // 根据ResourceType决定菜单
        const {type, fullPath} = initialState.resource;
        switch (type) {
          case ResourceType.GROUP:
            return loopMenuItem(formatGroupMenu(fullPath));
          case ResourceType.APPLICATION:
            return loopMenuItem(formatApplicationMenu(fullPath));
          case ResourceType.CLUSTER:
            return loopMenuItem(formatClusterMenu(fullPath));
          default:
            return defaultMenuData;
        }
      },
    },
    onCollapse: (collapsed) => {
      // @ts-ignore
      setInitialState((s) => ({...s, accordionCollapse: collapsed}));
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    logo: <div/>
  };
};

function formatGroupMenu(fullPath: string) {
  return [
    ...routes,
    {
      name: 'Group overview',
      icon: 'bank',
      path: `${fullPath}`,
    },
    {
      path: `/groups${fullPath}/-/members`,
      name: 'Members',
      icon: 'contacts',
    },
    {
      path: `/groups${fullPath}/-/settings`,
      name: 'Settings',
      icon: 'setting',
      children: [
        {
          path: `/groups${fullPath}/-/edit`,
          name: 'General',
        },
      ],
    },
    {
      path: `/groups${fullPath}/-/newsubgroup`,
      menuRender: false,
    },
    {
      path: `/groups${fullPath}/-/newapplication`,
      menuRender: false,
    },
  ];
}

function formatApplicationMenu(fullPath: string) {
  return [
    ...routes,
    {
      name: 'Application overview',
      icon: 'bank',
      path: `${fullPath}`,
    },
    {
      path: `/applications${fullPath}/-/clusters`,
      name: 'Clusters',
      icon: 'appstore',
    },
    {
      path: `/applications${fullPath}/-/members`,
      name: 'Members',
      icon: 'contacts',
    },
    {
      path: `/applications${fullPath}/-/edit`,
      menuRender: false,
    },
    {
      path: `/applications${fullPath}/-/clusters/new`,
      menuRender: false,
    },
  ];
}

function formatClusterMenu(fullPath: string) {
  return [
    ...routes,
    {
      name: 'Cluster overview',
      icon: 'bank',
      path: `${fullPath}`,
    },
    {
      path: `/clusters${fullPath}/-/pods`,
      name: 'Pods',
      icon: 'appstore',
    },
    {
      path: `/clusters${fullPath}/-/edit`,
      menuRender: false,
    },
    {
      path: `/clusters${fullPath}/-/pipelines`,
      name: 'Pipelines',
      icon: 'tags',
    },
    {
      path: `/clusters${fullPath}/-/pipelines/new`,
      parentKeys: [`/clusters${fullPath}/-/pipelines`],
    },
    {
      path: `/clusters${fullPath}/-/pipelines/:id`,
      parentKeys: [`/clusters${fullPath}/-/pipelines`],
    },
    {
      path: `/clusters${fullPath}/-/monitoring`,
      name: 'Monitoring',
      icon: 'fundout'
    },
    {
      path: `/clusters${fullPath}/-/members`,
      name: 'Members',
      icon: 'contacts',
    },
    {
      path: `/clusters${fullPath}/-/webconsole`,
    },
  ];
}
