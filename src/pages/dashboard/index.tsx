import {Button, Col, Divider, Input, Pagination, Row, Tabs, Tooltip, Tree} from 'antd';
import {history} from 'umi';
import './index.less';
import {useIntl} from '@@/plugin-locale/localeExports';
import {useModel} from "@@/plugin-model/useModel";
import {querySubGroups, searchGroups} from "@/services/groups/groups";
import {searchApplications} from "@/services/applications/applications"
import {searchClusters} from "@/services/clusters/clusters"
import React, {useState} from "react";
import Utils, {handleHref} from "@/utils";
import type {DataNode, EventDataNode, Key} from "rc-tree/lib/interface";
import {BookOutlined, DownOutlined, FolderOutlined} from "@ant-design/icons";
import '@/components/GroupTree/index.less'
import {useRequest} from "@@/plugin-request/request";
import {ResourceType} from "@/const";
import withTrim from "@/components/WithTrim";
import {queryEnvironments} from "@/services/environments/environments";
import {FundOutlined, GitlabOutlined} from '@ant-design/icons/lib';
import styles from "@/pages/clusters/Pods/index.less";

const {DirectoryTree} = Tree;
const Search = withTrim(Input.Search);

const {TabPane} = Tabs;

const groupsURL = '/dashboard/groups'
const applicationsURL = '/dashboard/applications'
const allApplicationsURL = '/explore/applications'
const clustersURL = '/dashboard/clusters'
const allClustersURL = '/explore/clusters'

export default (props: any) => {
  const {location} = props;
  const {pathname} = location;

  const groupsDashboard = pathname === groupsURL

  const intl = useIntl();
  const {initialState} = useModel('@@initialState');
  const newGroup = '/groups/new';

  const isAdmin = initialState?.currentUser?.isAdmin || false

  const [filter, setFilter] = useState('');
  const [total, setTotal] = useState(location.state?.total);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState(0);
  const [groups, setGroups] = useState<API.GroupChild[]>([]);
  const defaultExpandedKeys: (string | number)[] = [];
  const [expandedKeys, setExpandedKeys] = useState(defaultExpandedKeys);
  const [applications, setApplications] = useState<API.Application[]>([]);
  const [clusters, setClusters] = useState<CLUSTER.Cluster[]>([]);
  const [env2DisplayName, setEnv2DisplayName] = useState<Map<string, string>>();

  const {data: envs} = useRequest(queryEnvironments, {
    onSuccess: () => {
      const e = new Map<string, string>();
      envs!.forEach(item => e.set(item.name, item.displayName))
      setEnv2DisplayName(e)
    }
  });

  const updateExpandedKeySet = (data: API.GroupChild[], expandedKeySet: Set<string | number>) => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      if (filter) {
        expandedKeySet.add(node.parentID);
      }
      if (node.children) {
        updateExpandedKeySet(node.children, expandedKeySet);
      }
    }
  };

  const updateExpandedKeys = (newGroups: API.GroupChild[]) => {
    const expandedKeySet = new Set<string | number>();
    updateExpandedKeySet(newGroups, expandedKeySet);
    setExpandedKeys([...expandedKeySet]);
  }

  // search groups
  const {data: groupsData} = useRequest(() => {
    return searchGroups({
        filter,
        pageSize,
        pageNumber
      }
    )
  }, {
    ready: pathname === groupsURL,
    refreshDeps: [query, filter, pageNumber, pageSize],
    debounceInterval: 200,
    onSuccess: () => {
      const {items, total: t} = groupsData!
      setGroups(items);
      setTotal(t)
      updateExpandedKeys(items);
    }
  });

  // search your applications
  useRequest(() => {
    return searchApplications({
        filter,
        pageSize,
        pageNumber
      }
    )
  }, {
    ready: pathname === applicationsURL,
    refreshDeps: [query, filter, pageNumber, pageSize],
    debounceInterval: 200,
    onSuccess: (data) => {
      const {items, total: t} = data!
      setTotal(t)
      setApplications(items);
    }
  });
  // search all applications
  useRequest(() => {
    return searchApplications({
        filter,
        pageSize,
        pageNumber
      }
    )
  }, {
    ready: pathname === allApplicationsURL,
    refreshDeps: [query, filter, pageNumber, pageSize],
    debounceInterval: 200,
    onSuccess: (data) => {
      const {items, total: t} = data!
      setTotal(t)
      setApplications(items);
    }
  });

  // search your clusters
  useRequest(() => {
    return searchClusters({
        filter,
        pageSize,
        pageNumber
      }
    )
  }, {
    ready: pathname === clustersURL,
    refreshDeps: [query, filter, pageNumber, pageSize],
    debounceInterval: 200,
    onSuccess: (data) => {
      const {items, total: t} = data!
      setClusters(items);
      setTotal(t)
    }
  });
  // search all clusters
  useRequest(() => {
    return searchClusters({
        filter,
        pageSize,
        pageNumber
      }
    )
  }, {
    ready: pathname === allClustersURL,
    refreshDeps: [query, filter, pageNumber, pageSize],
    debounceInterval: 200,
    onSuccess: (data) => {
      const {items, total: t} = data!
      setClusters(items);
      setTotal(t)
    }
  });

  const clusterTitleRender = (node: any): React.ReactNode => {
    const {updatedAt, scope, template, name, fullPath, git} = node;
    const index = name.indexOf(filter);
    const beforeStr = name.substr(0, index);
    const afterStr = name.substr(index + filter.length);
    const tmp =
      filter && index > -1 ? (
        <a className="group-title" href={`/clusters${fullPath}/-/pods`}>
          {beforeStr}
          <span className="site-tree-search-value">{filter}</span>
          {afterStr}
        </a>
      ) : (
        <a href={`/clusters${fullPath}/-/pods`} className="group-title">{name}</a>
      );
    const firstLetter = name.substring(0, 1).toUpperCase()

    return <div style={{padding: '20px 0', display: 'flex', lineHeight: '32px', fontSize: 16}}>
      <div style={{flex: '1 1 100%'}}>
        <span className={`avatar-32 identicon bg${Utils.getAvatarColorIndex(name)}`}>
          {firstLetter}
        </span>
        <span style={{marginLeft: 48}}>{tmp}</span>
        <span className={'user-access-role'}>{env2DisplayName?.get(scope.environment)}</span>
        <span className={'user-access-role'}>{scope.regionDisplayName}</span>
        <span className={'user-access-role'}>{template.name}-{template.release}</span>
      </div>
      <div style={{display: 'flex', flex: '1 1 40%', justifyContent: 'space-between', flexDirection: 'row'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <a style={{color: 'black'}}><GitlabOutlined/></a>
          <a href={`/clusters${fullPath}/-/monitoring`}><FundOutlined style={{marginLeft: '1rem'}}/></a>
        </div>
        <div style={{display: 'flex'}}>
          <Tooltip title={Utils.timeToLocal(updatedAt)}>
            Updated {Utils.timeFromNowEnUS(updatedAt)}
          </Tooltip>
        </div>
      </div>
    </div>
  };

  const titleRender = (node: any): React.ReactNode => {
    const {title} = node;
    const index = title.indexOf(filter);
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + filter.length);
    const tmp =
      filter && index > -1 ? (
        <span className="group-title">
          {beforeStr}
          <span className="site-tree-search-value">{filter}</span>
          {afterStr}
        </span>
      ) : (
        <span className="group-title">{title}</span>
      );
    const firstLetter = title.substring(0, 1).toUpperCase()
    const {fullPath, updatedAt} = node;

    return <span style={{padding: '10px 0'}} onClick={(nativeEvent) => {
      // group点击名字进入主页 点击其他部位是展开
      if (groupsDashboard) {
        handleHref(nativeEvent, fullPath)
      }
    }}>
      <span className={`avatar-32 identicon bg${Utils.getAvatarColorIndex(title)}`}>
        {firstLetter}
      </span>
      <span style={{marginLeft: 48}}>{tmp}</span>
      <span style={{float: 'right'}}>
        <Tooltip title={Utils.timeToLocal(updatedAt)}>
          Updated {Utils.timeFromNowEnUS(updatedAt)}
        </Tooltip>
      </span>
    </span>;
  };

  const onChange = (e: any) => {
    const {value} = e.target;
    setFilter(value);
  };

  const onPressEnter = () => {
    setQuery(prev => prev + 1)
    setPageNumber(1)
  }

  const onSearch = () => {
    setQuery(prev => prev + 1)
    setPageNumber(1)
  }

  const updateChildren = (items: API.GroupChild[], id: number, children: API.GroupChild[]): API.GroupChild[] => {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.id === id) {
        item.children = children
      }
      if (item.children) {
        updateChildren(item.children, id, children)
      }
    }

    return items
  }

  // select group
  const onSelectGroup = (
    selectedKeys: Key[],
    info: {
      node: any;
      nativeEvent: any
    },
  ) => {
    const {node, nativeEvent} = info;
    const {key, expanded, fullPath, childrenCount} = node;
    // 如果存在子节点，则展开/折叠该group，不然直接跳转
    if (!childrenCount) {
      // title变为了element对象，需要注意下
      handleHref(nativeEvent, fullPath)
    } else if (!expanded) {
      setExpandedKeys([...expandedKeys, key]);
    } else {
      setExpandedKeys(expandedKeys.filter((item) => item !== key));
    }
  };

  // select application
  const onSelectApplication = (
    selectedKeys: Key[],
    info: {
      node: any;
      nativeEvent: any
    },
  ) => {
    const {node, nativeEvent} = info;
    const {fullPath} = node;

    handleHref(nativeEvent, `/applications${fullPath}/-/clusters`)
  };

  // @ts-ignore
  const queryInput = (groupsDashboard && isAdmin) ? <div><Search placeholder="Search" onPressEnter={onPressEnter} onSearch={onSearch} value={filter}
                 style={{width: '65%', marginRight: '10px'}} onChange={onChange}/>
      <Button
        type="primary"
        onClick={() =>
          history.push({
            pathname: newGroup,
          })
        }
        style={{backgroundColor: '#1f75cb'}}
      >
        {intl.formatMessage({id: 'pages.groups.New group'})}
      </Button>
    </div> : // @ts-ignore
    <Search placeholder="Search" onPressEnter={onPressEnter} onSearch={onSearch} onChange={onChange} value={filter}/>;

  const formatTreeData = (items: API.GroupChild[]): DataNode[] => {
    return items.map(({id, name, type, childrenCount, children, ...item}) => {
      return {
        ...item,
        id,
        name,
        type,
        key: id,
        title: name,
        childrenCount,
        icon: type === ResourceType.GROUP ? <FolderOutlined/> : <BookOutlined/>,
        isLeaf: childrenCount === 0,
        children: children && formatTreeData(children),
      }
    });
  }

  const onExpand = (expandedKey: any, info: {
    node: EventDataNode;
    expanded: boolean;
    nativeEvent: MouseEvent;
  }) => {
    // 如果是展开并且node下的children为空，则进行查询
    if (info.expanded && !info.node.children) {
      const pid = info.node.key as number;
      querySubGroups(pid, 1, pageSize).then(({data}) => {
        const {items} = data;
        setGroups(updateChildren(groups, pid, items))
        setExpandedKeys(expandedKey);
      })
    } else {
      setExpandedKeys(expandedKey);
    }
  };

  const onTabChange = (key: string) => {
    history.push(key, {total})
  }

  const formatTabTitle = (tab: string, totalItems: number) => {
    return <div>
      {tab}<span className={styles.tabNumber}>{totalItems}</span>
    </div>
  }

  return (
    <Row>
      <Col span={4}/>
      <Col span={16}>
        <Tabs activeKey={pathname} size={'large'} tabBarExtraContent={queryInput} onChange={onTabChange}
              animated={false} style={{marginTop: '15px'}}
        >
          {
            pathname.indexOf('clusters') > -1 &&
            <TabPane tab={formatTabTitle('Your clusters', total)} key="/dashboard/clusters">
              {clusters.map((item: CLUSTER.Cluster) => {
                const treeData = {
                  title: item.fullName?.split("/").join("  /  "),
                  ...item
                };
                return (
                  <div key={item.id}>
                    {clusterTitleRender(treeData)}
                    <Divider style={{margin: '5px 0 5px 0'}}/>
                  </div>
                );
              })}
            </TabPane>
          }
          {
            pathname.indexOf('clusters') > -1 &&
            <TabPane tab={formatTabTitle('All clusters', total)} key="/explore/clusters">
              {clusters.map((item: CLUSTER.Cluster) => {
                const treeData = {
                  title: item.fullName?.split("/").join("  /  "),
                  ...item
                };
                return (
                  <div key={item.id}>
                    {clusterTitleRender(treeData)}
                    <Divider style={{margin: '5px 0 5px 0'}}/>
                  </div>
                );
              })}
            </TabPane>
          }

          {
            pathname.indexOf('applications') > -1 &&
            <TabPane tab={formatTabTitle('Your applications', total)} key="/dashboard/applications">
              {applications.map((item: API.Application) => {
                const treeData: DataNode[] = [{
                  key: item.id,
                  title: item.fullName?.split("/").join("  /  "),
                  isLeaf: true,
                  icon: <BookOutlined/>,
                  ...item
                }];
                return (
                  <div key={item.id}>
                    <DirectoryTree
                      treeData={treeData}
                      titleRender={titleRender}
                      onSelect={onSelectApplication}
                    />
                    <Divider style={{margin: '5px 0 5px 0'}}/>
                  </div>
                );
              })}
            </TabPane>
          }
          {
            pathname.indexOf('applications') > -1 &&
            <TabPane tab={formatTabTitle('All applications', total)} key="/explore/applications">
              {applications.map((item: API.Application) => {
                const treeData: DataNode[] = [{
                  key: item.id,
                  title: item.fullName?.split("/").join("  /  "),
                  isLeaf: true,
                  icon: <BookOutlined/>,
                  ...item
                }];
                return (
                  <div key={item.id}>
                    <DirectoryTree
                      treeData={treeData}
                      titleRender={titleRender}
                      onSelect={onSelectApplication}
                    />
                    <Divider style={{margin: '5px 0 5px 0'}}/>
                  </div>
                );
              })}
            </TabPane>
          }

          {
            pathname.indexOf('groups') > -1 &&
            <TabPane tab={formatTabTitle('All groups', total)} key="/dashboard/groups">
              {groups.map((item: API.GroupChild) => {
                const treeData = formatTreeData([item]);
                const hasChildren = item.childrenCount > 0;
                return (
                  <div key={item.id}>
                    <DirectoryTree
                      onExpand={onExpand}
                      showLine={hasChildren ? {showLeafIcon: false} : false}
                      switcherIcon={<DownOutlined/>}
                      treeData={treeData}
                      titleRender={titleRender}
                      onSelect={onSelectGroup}
                      expandedKeys={expandedKeys}
                    />
                    <Divider style={{margin: '5px 0 5px 0'}}/>
                  </div>
                );
              })}
            </TabPane>
          }
        </Tabs>
        <br/>
        <div style={{textAlign: 'center'}}>
          <Pagination current={pageNumber} hideOnSinglePage pageSize={pageSize} total={total}
                      onChange={(page, pSize) => {
                        setPageSize(pSize!)
                        setPageNumber(page)
                      }}/>
        </div>
      </Col>
    </Row>
  );
};
