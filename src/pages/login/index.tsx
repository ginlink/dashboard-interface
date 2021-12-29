import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import styled from 'styled-components/macro'
import { Form, Input, Button, message } from 'antd'
import bg from '../../assets/img/login-bg.svg'
import { useHistory } from 'react-router-dom'
import { loginApi } from '@/services/api'
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: auto;
  background: url(${bg}) no-repeat center 110px;
  background-size: 100%;
  overflow: hidden;
  min-width: 380px;
  .login-form {
    width: 368px;
    margin: 0 auto;
    z-index: 2;
  }

  .login-form-button {
    width: 100%;
  }

  .logo-box {
    margin: 200px auto 40px;
  }

  .logo {
    height: 55px;
    margin-right: 8px;
  }

  .logo-name {
    position: relative;
    top: 8px;
    color: #999;
    font-weight: 600;
    font-size: 26px;
  }
`

export default function LoginForm() {
  const history = useHistory()
  // 触发登录方法
  const onFinish = (values: any): void => {
    const { userName: username, password } = values
    //请求接口，验证登录
    loginApi({ username, password })
      .then((res) => {
        console.log('res:', res)
        // localStorage.setItem('auth', res.token)
      })
      .catch(() => {
        message.error('网络错误')
      })
    // history.push('/home')
  }
  return (
    <Wrapper>
      <h2>后台系统</h2>
      <Form className="login-form" name="login-form" onFinish={onFinish}>
        <Form.Item name="userName" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="用户名" prefix={<UserOutlined />} size="large" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="密码" prefix={<LockOutlined />} size="large" />
        </Form.Item>
        <Form.Item>
          <Button className="login-form-button" htmlType="submit" size="large" type="primary">
            登录
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  )
}
