import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {
  const dispetch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => {
    dispetch(logoutRequestAction());
  }, []);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Card
      actions={[
        <div key="twit"><Link href={`/user/${me.id}`}><a>hi<br />{me.Posts.length}</a></Link></div>,
        <div key="followings"><Link href="/profile"><a>팔로잉<br />{me.Followings.length}</a></Link></div>,
        <div key="followings"><Link href="/profile"><a>팔로워<br />{me.Followers.length}</a></Link></div>,
      ]}
    >
      <Card.Meta avatar={(
        <Link href={`/user/${me.id}`} prefetch={false}>
          <a><Avatar>{me.nickname[0]}</Avatar></a>
        </Link>
      )} title={me.nickname} />
      <Button onClick={onLogOut} loading={logOutLoading}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
