/* eslint-disable react/jsx-filename-extension */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router'
import { END } from 'redux-saga';
import axios from 'axios';
import wrapper from '../store/configurestore'

import { Form, Input, Checkbox, Button } from 'antd';
import AppLayout from '../components/AppLayout';
import useinput from '../hooks/useinput';

import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_POSTS_REQUEST } from '../reducers/post';


const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  useEffect(()=>{
    if(me && me.id){
      Router.replace('/')
    }
  },[me && me.id]);

  useEffect(()=>{
    if(signUpDone){
      Router.replace('/')
    }
  },[signUpDone]);

  useEffect(()=>{
    if(signUpError) {
      alert(signUpError)
    }
  },[signUpError])

  const [email, onChangeEmail] = useinput('');
  const [nickname, onChangeNickname] = useinput('');
  const [password, onChangePassword] = useinput('');

  const [check, setCheck] = useState('');
  const [error, setCheckError] = useState('');
  const onChangeCheck = useCallback((e) => {
    setCheck(e.target.value);
    setCheckError(e.target.value !== password);
  }, [password]);

  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const style = useMemo(() => ({
    color: 'red',
  }), []);

  // eslint-disable-next-line consistent-return
  const onSubmit = useCallback(() => {
    if (password !== check) {
      return setCheckError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email, password, check, term]);

  return (
    <AppLayout>
      <Head>
        <title>Sign up | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-check">비밀번호 체크</label>
          <br />
          <Input name="user-check" type="password" value={check} required onChange={onChangeCheck} />
          {error && <div style={style}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>확인했습니다.</Checkbox>
          {termError && <div style={style}>확인되지 않았습니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
      </Form>
    </AppLayout>
  );
};


export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if(context.req && cookie){
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;
