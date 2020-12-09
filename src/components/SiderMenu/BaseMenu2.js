import React, { PureComponent } from 'react';

import { Icon } from 'antd';
import Link from 'umi/link';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import menuIcon from '@/assets/menuIcon'
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';

const getIcon = (icon, className = 'icon') => {
  // const admin_icon = require('@/assets/menuIcon/icon_admin.png')
  const admin_icon = require('@/assets/menuIcon/icon_admin.png')
  return <img src={admin_icon} alt="icon" className={styles[className]} />;
  // if (typeof icon === 'string' && isUrl(icon)) {
  // }
  // if (typeof icon === 'string') {
  //   return <Icon type={icon} className={styles[className]} />;
  // }
  // return icon;
};

export default class BaseMenu extends PureComponent {

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  getNavMenuByChildrenItem = (menuItem, openKeys) => {
    const style = {
      padding: '20px 0px 20px 30px',
      textAlign: 'left', borderBottom: '1px solid #bbb'
    }
    let className = styles.menuChildrenItem
    if (openKeys.some(key => key === menuItem.path)) {
      className = styles.menuChildrenItemActive
    }
    const itemPath = this.conversionPath(menuItem.path);
    const { location } = this.props;
    return (

      <div style={style} className={className}>
        <Link
          to={itemPath}
          target={menuItem.target}
          replace={itemPath === location.pathname}
        >
          {getIcon(menuItem.icon, 'childrenIcon')}
          {menuItem.name}
        </Link>
      </div>
    )
  }

  getNavMenuByChildren = (menuData, openKeys) => {
    const { children = [] } = menuData.find(item => openKeys.includes(item.path)) || {}
    return children.map(item => this.getNavMenuByChildrenItem(item, openKeys))
  }

  getNavMenuByParentItem = (menuItem, openKeys) => {
    const style = { backgroundColor: '#3a3f44', padding: '40px 5px', textAlign: 'center', borderBottom: '1px solid #555' }
    let className = ''
    if (openKeys.some(key => key === menuItem.path)) {
      className = styles.menuParentActive
    }
    return (
      <div style={style} key={menuItem.name} className={className}>
        {getIcon(menuItem.icon)}
        <p>{menuItem.name}</p>
      </div>
    )
  };

  getNavMenuByParent = (menuData, openKeys) => menuData.map((item) => this.getNavMenuByParentItem(item, openKeys))

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  render () {
    const { menuData, openKeys, location: { pathname } } = this.props;
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    const leftStyle = { color: '#a4bcd6', float: 'left', width: '85px' }
    const rightStyle = { float: 'right', width: '200px', height: '100vh', borderLeft: '2px solid #bbb' }
    return (
      // 左边主菜单
      <div>
        <div style={leftStyle}>
          {this.getNavMenuByParent(menuData, selectedKeys)}
        </div>
        <div style={rightStyle} className={styles.menuChildrenItem}>
          {this.getNavMenuByChildren(menuData, selectedKeys)}
        </div>
      </div>
    );
  }
}