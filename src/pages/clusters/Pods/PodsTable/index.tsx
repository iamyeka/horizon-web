import {Button, Input, Space, Table} from "antd";
import {useIntl} from "@@/plugin-locale/localeExports";
import {useState} from "react";
import {useModel} from "@@/plugin-model/useModel";
import './index.less'
import FullscreenModal from "@/components/FullscreenModal";

const {Search} = Input;

export default (props: { data: CLUSTER.PodInTable[], theCluster: CLUSTER.Cluster }) => {
  const {data, theCluster} = props;
  data.push({podName: 'logstash-logstash-0', status: '2', ip: '3', onlineStatus: 'online', namespace: 'logstash', containerName: "111"})
  const intl = useIntl();
  const [pageNumber, setPageNumber] = useState(1);
  const [filter, setFilter] = useState('');
  const {initialState} = useModel('@@initialState');
  const {fullPath} = initialState!.resource;
  const [fullscreen, setFullscreen] = useState(false)
  const [selectedPods, setSelectedPods] = useState<CLUSTER.PodInTable[]>([])

  const formatMessage = (suffix: string, defaultMsg: string) => {
    return intl.formatMessage({id: `pages.cluster.podsTable.${suffix}`, defaultMessage: defaultMsg})
  }

  const formatConsoleURL = (pod: CLUSTER.PodInTable) => {
    // const {environment} = theCluster.scope
    return `/clusters${fullPath}/-/webconsole?namespace=${pod.namespace}&podName=${pod.podName}&
    containerName=${pod.containerName}&environment=123`
  }

  const onClickStdout = (pod: CLUSTER.PodInTable) => {
    setFullscreen(true)
  }

  const formatMonitorURL = (pod: CLUSTER.PodInTable) => {
    return `/clusters${fullPath}/-/monitoring?namespace=${pod.namespace}&podName=${pod.podName}&environment=123`
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
      title: 'createTime',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: formatMessage('action', '操作'),
      key: 'action',
      render: (text: any, record: CLUSTER.PodInTable) => (
        <Space size="middle">
          <a href={formatConsoleURL(record)} target="_blank">登录Terminal</a>
          <a onClick={() => onClickStdout(record)}>查看容器日志</a>
          <a href={formatMonitorURL(record)}>Monitor</a>
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
    return !filter || item.podName.contains(filter)
  })

  const onPodSelected = (selectedRowKeys: React.Key[], selectedRows: CLUSTER.PodInTable[]) => {
    setSelectedPods(selectedRows)
  };

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
      onClose={() => setFullscreen(false)}
      fullscreen={false}
      allowToggle={true}
    >
      <div>
        kkk
      </div>
    </FullscreenModal>
  </div>
}
