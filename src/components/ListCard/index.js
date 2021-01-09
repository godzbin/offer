import React, { PureComponent } from 'react';

import Styles from './index.less'

export default class ListCard extends PureComponent {
  /**
   * props: {style, title, list}
   * 
   * style: Object
   * 
   * title: String or dom
   * 
   * list: Array
   * --list.item: Object  {name: string or dom , value: string or dom, render: dom function}
   * 
   * */
  renderList = () => {
    const { list = [] } = this.props
    return list.map((listItem, index) => {
      if (listItem.render) {
        return (
          <div className={Styles.listUl} key={index + '1'}>
            {listItem.render()}
          </div>
        )
      }
      return (
        <div className={Styles.listUl} key={index + '1'}>

          <div className={Styles.listName}>{listItem.name}</div>
          <div className={Styles.listValue}>{listItem.value}</div>
        </div>)
    })
  }

  render () {
    const { title } = this.props
    return (
      <div {...this.props}>
        <div className={Styles.title}>
          {title}
        </div>
        <div className={Styles.content}>
          {this.renderList()}
        </div>
      </div>
    )
  }
}