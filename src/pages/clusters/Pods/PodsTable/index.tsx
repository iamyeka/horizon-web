import {Button, Input, Space, Table} from "antd";
import {useIntl} from "@@/plugin-locale/localeExports";
import {useState} from "react";
import {useModel} from "@@/plugin-model/useModel";
import './index.less'
import FullscreenModal from "@/components/FullscreenModal";
import {useRequest} from "@@/plugin-request/request";
import {queryPodStdout} from "@/services/clusters/pods";
import CodeEditor from '@/components/CodeEditor'

const {Search} = Input;

export default (props: { data: CLUSTER.PodInTable[], cluster?: CLUSTER.Cluster }) => {
  const {data, cluster} = props;
  const intl = useIntl();
  const [pageNumber, setPageNumber] = useState(1);
  const [filter, setFilter] = useState('');
  const {initialState} = useModel('@@initialState');
  const {fullPath} = initialState!.resource;
  const [fullscreen, setFullscreen] = useState(false)
  const [pod, setPod] = useState<CLUSTER.PodInTable>()
  const [selectedPods, setSelectedPods] = useState<CLUSTER.PodInTable[]>([])

  const {
    data: podLog,
    run: refreshPodLog,
    cancel: cancelPodLog,
  } = useRequest((podName, containerName) => queryPodStdout(cluster.id, {
    podName: podName,
    containerName: containerName
  }), {
    manual: true,
    formatResult: (res) => {
      return res
    },
    pollingInterval: 5000,
  })

  const formatMessage = (suffix: string, defaultMsg: string) => {
    return intl.formatMessage({id: `pages.cluster.podsTable.${suffix}`, defaultMessage: defaultMsg})
  }

  const formatConsoleURL = (pod: CLUSTER.PodInTable) => {
    const {environment} = cluster?.scope || {}
    return `/clusters${fullPath}/-/webconsole?namespace=${pod.namespace}&podName=${pod.podName}&
    containerName=${pod.containerName}&environment=${environment}`
  }

  const onClickStdout = (pod: CLUSTER.PodInTable) => {
    setFullscreen(true);
    setPod(pod)
    refreshPodLog(pod.podName, pod.containerName).then();
  }

  const formatMonitorURL = (pod: CLUSTER.PodInTable) => {
    return `/clusters${fullPath}/-/monitoring?podName=${pod.podName}`
  }

  const columns = [
    {
      title: formatMessage('podName', '副本'),
      dataIndex: 'podName',
      key: 'podName',
    },
    {
      title: formatMessage('status', '状态'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: formatMessage('onlineStatus', '上线状态'),
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
    },
    {
      title: formatMessage('restartCount', '重启次数'),
      dataIndex: 'restartCount',
      key: 'restartCount',
    },
    {
      title: '启动时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: formatMessage('action', '操作'),
      key: 'action',
      render: (text: any, record: CLUSTER.PodInTable) => (
        <Space size="middle">
          <a href={formatConsoleURL(record)} target="_blank">Terminal</a>
          <a onClick={() => onClickStdout(record)}>查看日志</a>
          <a onClick={() => history.push(formatMonitorURL(record))}>Monitor</a>
        </Space>
      ),
    },
  ]

  const onChange = (e: any) => {
    const {value} = e.target;
    setFilter(value);
  };

  const renderTile = () => {
    return <div>
      <Search placeholder="Search" onChange={onChange} style={{width: '300px'}}/>

      <div style={{float: 'right'}}>
        <Button
          type="primary"
          onClick={() => {

          }}
          disabled={!selectedPods.length}
        >
          {formatMessage('online', '上线')}
        </Button>
        <Button
          style={{marginLeft: '10px'}}
          onClick={() => {

          }}
          disabled={!selectedPods.length}
        >
          {formatMessage('offline', '下线')}
        </Button>
        <Button
          style={{marginLeft: '10px'}}
          onClick={() => {

          }}
          disabled={!selectedPods.length}
        >
          {formatMessage('restartPod', '重启Pod')}
        </Button>
      </div>
    </div>
  }
  const filteredData = data.filter((item: any) => {
    return !filter || item.podName.indexOf(filter) > -1
  })

  const onPodSelected = (selectedRowKeys: React.Key[], selectedRows: CLUSTER.PodInTable[]) => {
    setSelectedPods(selectedRows)
  };

  const onRefreshButtonToggle = (checked: boolean) => {
    if (checked) {
      refreshPodLog(pod?.podName, pod?.containerName).then();
    } else {
      cancelPodLog();
    }
  }

  return <div>
    <Table
      rowSelection={{
        type: 'checkbox',
        onChange: onPodSelected
      }}
      columns={columns}
      dataSource={filteredData}
      pagination={{
        position: ['bottomCenter'],
        current: pageNumber,
        hideOnSinglePage: true,
        total: data.length,
        onChange: (page) => setPageNumber(page)
      }}
      title={renderTile}
    />
    <FullscreenModal
      title={'Stdout信息'}
      visible={fullscreen}
      onClose={
        () => {
          setFullscreen(false);
          cancelPodLog();
        }
      }
      fullscreen={false}
      supportFullscreenToggle={true}
      supportRefresh={true}
      onRefreshButtonToggle={onRefreshButtonToggle}
    >
      <CodeEditor
        content={podLog}
      />
    </FullscreenModal>
  </div>
}
