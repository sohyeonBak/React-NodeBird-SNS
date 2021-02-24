/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => (
  // eslint-disable-next-line react/jsx-filename-extension
  // eslint-disable-next-line react/jsx-no-comment-textnodes
  <div>
    {postData.split(/(#[^\s#]+)/g).map((value, index) => {
      if (value.match(/(#[^\s#]+)/g)) {
        // eslint-disable-next-line react/no-array-index-key
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        return <Link href={`/hashtag/${value.slice(1)}`} key={index}><a>{value}</a></Link>;
      }
      return value;
    })}
  </div>
);

PostCardContent.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  postCard: PropTypes.string.isRequired,
};

export default PostCardContent;
