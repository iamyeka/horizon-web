export default {
  'pages.common.next': 'Next',
  'pages.common.back': 'Back',
  'pages.common.submit': 'Submit',

  'pages.groups.New subgroup': 'New subgroup',
  'pages.groups.New application': 'New application',
  'pages.groups.New group': 'New group',
  'pages.groups.New cluster': 'New cluster',

  'pages.applicationNew.config.application': 'deploy config',
  'pages.applicationNew.config.pipeline': 'build config',
  'pages.applicationNew.header': 'Creating application for [ {group} ], please fill in the information step by step',
  'pages.applicationNew.success': 'create application succeed',
  'pages.applicationNew.step.one': 'Template',
  'pages.applicationNew.step.two': 'Basic',
  'pages.applicationNew.step.three': 'Config',
  'pages.applicationNew.step.four': 'Audit',
  'pages.applicationNew.step.message': 'Step {index}',
  'pages.applicationNew.basic.title': 'Service Basic',
  'pages.applicationNew.basic.name.ruleMessage': '应用名是必填项，支持字母、数字和中划线的组合，且必须以字母开头',
  'pages.applicationNew.basic.name': 'name',
  'pages.applicationNew.basic.description': 'description',
  'pages.applicationNew.basic.description.ruleMessage': 'max length: 255',
  'pages.applicationNew.basic.release': 'release',
  'pages.applicationNew.basic.priority': 'priority',
  'pages.applicationNew.basic.repo': 'Repo',
  'pages.applicationNew.basic.url': 'url',
  'pages.applicationNew.basic.subfolder': 'subfolder',
  'pages.applicationNew.basic.branch': 'branch',
  'pages.applicationEdit.success': 'update application succeed',
  'pages.applicationEdit.header': 'Editing [ {application} ], please fill in the information step by step',

  'pages.applicationDetail.basic.createTime': 'create time',
  'pages.applicationDetail.basic.updateTime': 'update time',
  'pages.applicationDetail.basic.release': 'release',
  'pages.applicationDetail.basic.recommendedRelease': 'recommended release',
  'pages.applicationDetail.basic.edit': 'Edit',
  'pages.applicationDetail.basic.operate': 'Operations',
  'pages.applicationDetail.basic.createCluster': 'Create Cluster',
  'pages.applicationDetail.basic.delete': 'Delete Application',
  'pages.applicationDetail.basic.detail': 'Application Detail',
  'pages.applicationDetail.basic.config': 'Application Config',
  'pages.applicationDelete.success': 'Delete application success',
  'pages.applicationDelete.confirm.title': 'Are you sure to delete this application：{application}?',
  'pages.applicationDelete.confirm.content': `Warning：the application could not be resumed after deleted`,
  'pages.applicationDelete.confirm.ok': 'OK',
  'pages.applicationDelete.confirm.cancel': 'Cancel',

  'pages.clusterNew.config.application': 'deploy config',
  'pages.clusterNew.config.pipeline': 'build config',
  'pages.clusterNew.success': 'create cluster succeed',
  'pages.clusterNew.header': 'Creating cluster for [ {application} ], please fill in the information step by step',
  'pages.clusterNew.step.one': 'Basic',
  'pages.clusterNew.step.two': 'Config',
  'pages.clusterNew.step.three': 'Audit',
  'pages.clusterNew.step.message': 'Step {index}',
  'pages.clusterNew.basic.title': 'Service Basic',
  'pages.clusterNew.basic.name.ruleMessage': '集群名是必填项，支持字母、数字和中划线的组合，且必须以字母开头',
  'pages.clusterNew.basic.name': 'name',
  'pages.clusterNew.basic.description': 'description',
  'pages.clusterNew.basic.description.ruleMessage': 'max length: 255',
  'pages.clusterNew.basic.repo': 'Repo',
  'pages.clusterNew.basic.url': 'url',
  'pages.clusterNew.basic.subfolder': 'subfolder',
  'pages.clusterNew.basic.branch': 'branch',
  'pages.clusterNew.basic.env': 'env',
  'pages.clusterNew.basic.region': 'region',
  'pages.clusterEdit.success': 'update cluster succeed',
  'pages.clusterEdit.header': 'Editing [ {cluster} ], please fill in the information step by step',

  'pages.clusterDetail.basic.detail': 'Application Cluster Detail',
  'pages.clusterDetail.basic.config': 'Application Cluster Config',
  'pages.clusterDetail.basic.name': 'name',
  'pages.clusterDetail.basic.description': 'description',
  'pages.clusterDetail.basic.release': 'release ',
  'pages.clusterDetail.basic.priority': 'priority',
  'pages.clusterDetail.basic.repo': 'Repo',
  'pages.clusterDetail.basic.url': 'url',
  'pages.clusterDetail.basic.subfolder': 'subfolder',
  'pages.clusterDetail.basic.branch': 'branch',
  'pages.clusterDetail.basic.createTime': 'create time',
  'pages.clusterDetail.basic.updateTime': 'update time',
  'pages.clusterDelete.success': 'delete cluster succeed',
  'pages.clusterDelete.confirm.title': 'Are you sure to delete this cluster：{cluster}?',
  'pages.clusterDelete.confirm.content': `Warning：the cluster could not be resumed after deleted`,
  'pages.clusterDelete.confirm.ok': 'OK',
  'pages.clusterDelete.confirm.cancel': 'Cancel',
  'pages.clusterDetail.basic.edit': 'Edit',
  'pages.clusterDetail.basic.operate': 'Operate',
  'pages.clusterDetail.basic.delete': 'Delete',

  'pages.application.members.title': 'Application Members',
  'pages.groups.members.title': 'Group Members',
  'pages.cluster.members.title': 'Application Cluster members',
  'pages.members.user.title': 'Invite user',
  'pages.members.user.email.label': 'User name or Email address',
  'pages.members.user.email.threshold': 'Search for users to invite',
  'pages.members.user.email.message': ' Please select a user',
  'pages.members.user.role.label': 'Choose a role permission',
  'pages.members.user.role.message': 'Please select a role',
  'pages.members.user.invite': 'invite',
  'pages.members.list.title': 'Members with access to ',
  'pages.members.list.leave': 'Leave',
  'pages.members.list.label': 'Existing shares',
  'pages.members.add.success': 'Add member success',
  'pages.members.remove.confirm.title': 'Are you sure to remove this member:{member}?',
  'pages.members.leave.confirm.title': 'Are you sure to leave?',
  'pages.members.update.success': 'Update member success',
  'pages.members.remove.success': 'Remove member success',
  'pages.members.leave.success': 'Leave success',
  'pages.members.remove.givenAccess': 'Given access by {grantorName} {grantedTime}',
  'pages.members.role.tip': `1.Permission from high to low：Owner、Maintainer、Developer、Reporter、Guest
  2.All members could manage other members whose permission is equal to or lower then self`,
  'pages.members.user.notExist.alert': `Please ask for other members to invite you first`,
};
