import { Menu } from 'antd'

const { SubMenu } = Menu;

import IconFont from '../IconFont'

const seletedChange = (e, initSunMenu, tabPaneInit) => {
  const { key } = e
  for (let i = 0; i < initSunMenu.length; i++) {
    const _initSunMenu = initSunMenu[i]
    const _value = _initSunMenu.value
    if (key === _value) {
      tabPaneInit(_initSunMenu.page || _initSunMenu.child[0].page)
      break
    }
  }
}
const getMenuDom = (subMenuJSon, numberList) => {
  if (!subMenuJSon || subMenuJSon.length === 0) {
    return ''
  }
  return (
    subMenuJSon &&
    subMenuJSon.map((item, index) => {
      const li = [...(numberList || [])]
      const _child = item.child
      li.push(index)
      if (_child && _child.length > 0) {
        const _childrenDom = getMenuDom(_child, li)
        if (item.type) {
          return (
            <SubMenu
              key={item.value}
              icon={<IconFont type={item.type} style={null} />}
              title={item.name}>
              {_childrenDom}
            </SubMenu>
          )
        } else {
          return (
            <SubMenu key={item.value} title={item.name}>
              {_childrenDom}
            </SubMenu>
          )
        }
      } else {
        return (
          <Menu.Item
            icon={<IconFont type={item.type} style={null} />}
            key={item.value}>
            {item.name}
          </Menu.Item>
        )
      }
    })
  )
}
const IndexTabLeft = ({ msg, tabPaneInit }) => {
  const { defaultOpenKeysList, initSunMenu } = msg
  return (
    <div>
      {initSunMenu && initSunMenu.length > 0 && (
        <div className="lineLeftStyle">
          <Menu
            theme="light"
            style={{ width: '100%', borderRight: 'none', height: 30 }}
            defaultOpenKeys={defaultOpenKeysList}
            selectedKeys={defaultOpenKeysList}
            onClick={(e) => seletedChange(e, initSunMenu, tabPaneInit)}
            mode="inline">
            {getMenuDom(initSunMenu, [])}
          </Menu>
        </div>
      )}
      <style>
        {`
          .lineLeftStyle {
            position: fixed;
            top: 50px;
            width: 11%;
            bottom: 0;
            left: 0;
            height: auto;
            overflow-y: auto;
            overflow-x: hidden;
            border-right: 1px solid #f0f0f0;
            box-sizing: border-box;
          }
          .lineLeftStyle::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  )
}
export default IndexTabLeft
