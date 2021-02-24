import React, { useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr'
import wrapper from '../store/configurestore'

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/nickname_edit_form';
import FollowList from '../components/followlist';

import { LOAD_MY_INFO_REQUEST } from '../reducers/user';


const fetcher = (url) => axios.get(url, {withCredentials:true}).then((result)=>result.data )

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data : followersData, error : followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher)
  const { data : followingsData, error : followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher)


  useEffect(()=>{
    if(!(me && me.id)) {
      Router.push('/')
    }
  },[me && me.id])

  const loadMoreFollowers = useCallback(()=>{
    setFollowersLimit((prev)=> prev +3)
  },[])

  const loadMoreFollowings = useCallback(()=>{
    setFollowingsLimit((prev)=> prev +3)
  },[])


  if(!me){
    return '내 정보 로딩중 ...'
  }


  if(followerError || followingError) {
    console.error(followerError || followingError)
    return <div>팔로잉, 팔로워 로딩 중 에러가 발생합니다.</div>
  }
  
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <>
      <Head>
        <title>Profile | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Profile;
