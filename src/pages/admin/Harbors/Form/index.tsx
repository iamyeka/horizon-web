import {Button, Form, Input} from "antd";
import common from "@/pages/admin/common";

export default () => {
  return <div>
    <Form.Item label={"名称"} name={'name'} rules={[{required: true}]} extra={'Harbor唯一名称标识'}>
      <Input/>
    </Form.Item>
    <Form.Item label={"域名"} name={'server'} rules={common.formRules.domain} extra={'Harbor域名地址'}>
      <Input/>
    </Form.Item>
    <Form.Item label={"token"} name={'token'} rules={[{required: true}]} extra={'通过API访问Harbor所需的token'}>
      <Input/>
    </Form.Item>
    <Form.Item label={"镜像预热ID"} name={'preheatPolicyID'} rules={[{required: true}]} extra={'配置在Harbor中的P2P镜像加速提供商ID'}>
      <Input type={"number"}/>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </div>
}
