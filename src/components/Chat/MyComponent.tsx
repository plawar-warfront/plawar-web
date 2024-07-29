import React from 'react';
import { Scrollbars, positionValues } from 'react-custom-scrollbars-2';

const MyComponent = () => {
  const handleScrollFrame = (values: positionValues) => {
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = values;
    console.log('Scroll Top:', scrollTop);
    console.log('Scroll Left:', scrollLeft);
    // 여기서 추가적인 로직을 작성할 수 있습니다.
  };

  return (
    <Scrollbars onScrollFrame={handleScrollFrame}>
      {/* 스크롤이 가능한 콘텐츠 */}
      <div>sd </div>
      <div>sd </div>
      <div>sd </div>
      <div>sd </div>
      <div>sd </div>
      <div>sd </div>

    </Scrollbars>
  );
};

export default MyComponent;