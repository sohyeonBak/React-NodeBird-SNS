/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

import useinput from '../hooks/useinput';
import { loginRequestAction } from '../reducers/user';

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useinput('');
  const [password, onChangePassword] = useinput('');

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);
  
  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          value={password}
          type="Password"
          onChange={onChangePassword}
          required
        />
      </div>
      <div>
          <Button type="primary" htmlType="submit" >로그인</Button>
          <Link href="/signup"><a><Button htmlType="button">회원가입</Button></a></Link>
      </div>
    </FormWrapper>
  );
};

export default LoginForm;
