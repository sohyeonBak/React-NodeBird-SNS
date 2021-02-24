import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import Head from 'next/head';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/postcard';


import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../reducers/user';
import wrapper from '../../store/configurestore';
import { useRouter } from 'next/router';
import { Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; 
  const { userInfo, me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);



  useEffect(()=>{
    function onScroll() {
      if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
        if(hasMorePosts && !loadPostsLoading) {
        
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length -1].id,
            data: id,
          }) 
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () =>{
      window.removeEventListener('scroll', onScroll)
    }
  },[hasMorePosts, mainPosts.length, id, loadPostsLoading])

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppLayout>
    {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}
            님의 글
          </title>
          <meta name="description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:title" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:url" content={`http://api.nodebird.com/user/${id}`} />
        </Head>
      )}
      {userInfo && (userInfo.id !== me?.id)
            ? (
                <Card 
                actions={[
                    <div key="twit">hi<br />{userInfo.Posts}</div>,
                    <div key="following">팔로잉<br />{userInfo.Following}</div>,
                    <div key="follower">팔로워<br />{userInfo.Follower}</div>,
                ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                    />
                </Card>
            ) : null }
        {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
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
    type: LOAD_USER_POSTS_REQUEST,
    data: context.params.id
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: context.params.id
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default User;
