import React, { PureComponent } from 'react';

// import { Icon } from 'antd';
import Link from 'umi/link';
import { getMenuMatches } from './SiderMenuUtils';
import iconConfig from './config'
// import { isUrl } from '@/utils/utils';
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';

const getIcon = (icon, className = 'icon', isActive = false) => {
  return <img src={iconConfig[`${icon}${isActive ? 'Selected' : ''}`]} alt="icon" className={styles[className]} />;
};

export default class BaseMenu extends PureComponent {
  state = {
    selectParentMenu: ''
  };

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
    const isActive = openKeys.some(key => key === menuItem.path)
    if (isActive) {
      className = styles.menuChildrenItemActive
    }
    const itemPath = this.conversionPath(menuItem.path);
    const { location } = this.props;
    return (

      <div style={style} className={className} key={menuItem.path}>
        <Link
          to={itemPath}
          target={menuItem.target}
          replace={itemPath === location.pathname}
        >
          {getIcon(menuItem.icon, 'childrenIcon', isActive)}
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
    const isActive = openKeys.some(key => key === menuItem.path)
    return (
      <div key={menuItem.name} className={[styles.menuParent, isActive ? styles.menuParentActive : ''].join(' ')} onClick={() => this.handleSelectMenu(menuItem.path)}>
        {getIcon(menuItem.icon, 'icon', isActive)}
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

  handleSelectMenu (path) {
    this.setState(() => ({
      selectParentMenu: path
    }));
  };

  render () {
    const { menuData, openKeys, location: { pathname } } = this.props;
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    const { selectParentMenu } = this.state;
    if (selectParentMenu) {
      selectedKeys[0] = selectParentMenu
    }
    const leftStyle = { color: '#a4bcd6', float: 'left', width: '85px' }
    const rightStyle = { float: 'right', width: '200px', height: 'calc(100vh - 86px)', borderLeft: '2px solid #bbb' }
    return (
      // 左边主菜单
      <div>
        <div style={leftStyle}>
          {this.getNavMenuByParent(menuData, selectedKeys)}
        </div>
        <div style={rightStyle} className={styles.menuChildren}>
          {this.getNavMenuByChildren(menuData, selectedKeys)}
        </div>
      </div>
    );
  }
}