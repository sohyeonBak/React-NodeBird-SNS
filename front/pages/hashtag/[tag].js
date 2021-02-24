import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import Head from 'next/head';
import wrapper from '../../store/configurestore';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/postcard';

import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query; 
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);


  useEffect(()=>{
    function onScroll() {
      if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
        if(hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length -1].id,
            data: tag,
          }) 
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () =>{
      window.removeEventListener('scroll', onScroll)
    }
  },[hasMorePosts, mainPosts.length, tag, loadPostsLoading])

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppLayout>
      {mainPosts.map((c)=>(
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
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: context.params.tag
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Hashtag;
