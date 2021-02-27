
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { Button, Input } from 'antd';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const PostCardContent = ({ postData, editMode, onCancelUpdate, onChangePost }) =>{ 
  const [editText,setEditText] = useState(postData);
  const {updatePostDone} = useSelector((state) => state.post);
  
  useEffect(()=>{
    if(updatePostDone) {
      onCancelUpdate();
    }
  },[updatePostDone])
  
  const onChangeText = useCallback((e)=>{
    setEditText(e.target.value)
  },[])

  
  return(
  <div>
    {editMode
      ? (
        <>
          <TextArea value={editText} conChange={onChangeText}/>
          <Button.Group >
            <Button type="primary" onClick={onChangePost(editText)}>수정</Button>
            <Button type="danger" onClick={onCancelUpdate}>취소</Button>
          </Button.Group>
        </>
        )
      : postData.split(/(#[^\s#]+)/g).map((value, index) => {
      if (value.match(/(#[^\s#]+)/g)) {
        // eslint-disable-next-line react/no-array-index-key
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        return <Link href={`/hashtag/${value.slice(1)}`} prefetch={false} key={index}><a>{value}</a></Link>;
      }
      return value;
    })
    }
  </div>
)
}

PostCardContent.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  postCard: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
}

export default PostCardContent;
