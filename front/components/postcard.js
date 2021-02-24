/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar, List, Comment } from 'antd';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import moment from 'moment';

import PostImages from './postimages';
import FollowButton from './followbutton';
import CommentForm from './commentform';
import PostCardContent from './postcardcontent';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';


moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [commentOpen, setCommentOpen] = useState(false);
  const id = useSelector((state) => state.user.me?.id);
  
  const onLike = useCallback(()=>{
    if(!id) {
      return alert('로그인이 필요합니다')
    }
    return dispatch({
      type : LIKE_POST_REQUEST,
      data: post.id
    })
  },[id])
  
  const onUnLike = useCallback(()=>{
    if(!id) {
      return alert('로그인이 필요합니다')
    }
    return dispatch({
      type : UNLIKE_POST_REQUEST,
      data: post.id
    })
  },[id])
  

  const onToggleComment = useCallback(() => {
    setCommentOpen((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(()=>{
    if(!id) {
      return alert('로그인이 필요합니다')
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data : post.id,
    })
  },[id])

  const onRetweet = useCallback(()=>{
    if(!id) {
      return alert('로그인이 필요합니다')
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id
    })
  },[id])

  const liked = post.Likers.find((v) => v.id === id);
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover key="more" 
            content={(
              <Button.Group >
                {id && post.User.id === id 
                ? (<>
                    <Button >수정</Button>
                    <Button type="danger" onClick={onRemovePost} >삭제</Button>
                  </>) 
                : <Button >신고</Button>}
              </Button.Group>)}> 
            <EllipsisOutlined />
          </Popover>,]} 
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다`: null}      
        extra={id && <FollowButton post={post} />} 
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
              <div style={{ float: 'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta 
                avatar={(
                  <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                )} 
                title={post.Retweet.User.nickname} 
                description ={<PostCardContent postData={post.content} />} />
            </Card>
          )
          : (
            <>
            <div style={{ float: 'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta 
                avatar={(
                  <Link href={`/user/${post.User.id}`} prefetch={false}>
                    <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                  </Link>
                )} 
                title={post.User.nickname} 
                description={<PostCardContent postData={post.content} />} />
            </>
            )
        }
      </Card>
      {commentOpen && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={`/user/${item.User.id}`} prefetch={false}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
