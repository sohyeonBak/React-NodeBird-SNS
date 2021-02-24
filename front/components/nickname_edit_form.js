import React, { useMemo, useCallback } from 'react';
import { Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';
import useinput from '../hooks/useinput';


const NicknameEditForm = () => {
  const {me} = useSelector((state)=> state.user);
  const [nickname, onChangeNickname] = useinput(me?.nickname || '');
  const dispatch = useDispatch();
  
  const onSubmit = useCallback(()=>{
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname
    })
  },[nickname])

  const style = useMemo(() => ({
    marginButtom: '40px',
    border: '1px solid #d9d9d9',
    padding: '20px',
  }), []);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Form style={style}>
      <Input.Search 
      value={nickname}
      onChange={onChangeNickname}
      addonBefore="닉네임"
      enterButton="수정"
      onSearch={onSubmit}
      />
    </Form>
  );
};

export default NicknameEditForm;
