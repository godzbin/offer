import { Drawer } from 'antd';
import React from 'react';
import SiderMenu from './SiderMenu';
import { getFlatMenuKeys } from './SiderMenuUtils';

const SiderMenuWrapper = React.memo(props => {
  const { menuData } = props;
  const flatMenuKeys = getFlatMenuKeys(menuData);
  return (
    <SiderMenu {...props} flatMenuKeys={flatMenuKeys} />
  )
  // isMobile ? (
  //   <Drawer
  //     visible={!collapsed}
  //     placement="left"
  //     onClose={() => onCollapse(true)}
  //     style={{
  //       padding: 0,
  //       height: '100vh',
  //     }}
  //   >
  //     <SiderMenu {...props} flatMenuKeys={flatMenuKeys} collapsed={isMobile ? false : collapsed} />
  //   </Drawer>
  // ) : (
    
  // );
});

export default SiderMenuWrapper;
