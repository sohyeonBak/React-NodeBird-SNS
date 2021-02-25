import React, { useCallback, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './imageszoom.js';

const PostImages = ({ images }) => {
  const [showImage, setShowImage] = useState(false);
  const onZoom = useCallback(() => {
    setShowImage(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImage(false);
  }, []);

  if (images.length === 1) {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <>
        <img role="presentation" src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} />
        {showImage && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  if (images.length === 2) {
    return (
      <>
        <img role="presentation" style={{ width: '50%', display: 'inline-block' }} src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} />
        <img role="presentation" style={{ width: '50%', display: 'inline-block' }} src={`${images[1].src}`} alt={images[1].src} onClick={onZoom} />
        {showImage && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    <>
      <div>
        <img role="presentation" style={{ width: '50%', display: 'inline-block' }} src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} />
        <div role="presentation" style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }} onClick={onZoom}>
          <PlusOutlined />
          <br />
          {images.length - 1}
          개의 사진 더보기
        </div>
      </div>
      {showImage && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  // eslint-disable-next-line react/require-default-props
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
