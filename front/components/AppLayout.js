/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled from 'styled-components';
import Router from 'next/router'

import UserProfile from './userprofile';
import LoginForm from './loginform';
import useinput from '../hooks/useinput';

const InputSearch = styled(Input.Search)`
vertical-align : middle
`;

const AppLayout = ({ children }) => {
const [searchInput, onCahngeSearchInput] = useinput()
  const { me } = useSelector((state) => state.user);

const onSearch = useCallback(() =>{
  Router.push(`/hashtag/${searchInput}`);

},[searchInput])

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item>
          <InputSearch 
          enterButton="Search" 
          value={searchInput}
          onChange={onCahngeSearchInput}
          onSearch={onSearch}
          />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://github.com/sohyeonBak" target="_blank" rel="noreferrer noopener">Sohyeon Bak's Github</a>
        </Col>
      </Row>

    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
