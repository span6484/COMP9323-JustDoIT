import { Tabs } from 'antd'

const { TabPane } = Tabs
import { getQueryString } from '../../util/common'
import { useEffect } from 'react'

const IndexTabRight = ({ msg, dom, setInitTabPane, changeIframeUrl }) => {
  const { initSubMenuJSon, activeTabPaneKey, initTabPane, isSchema } = msg
  function keyOnChange(key) {
    setInitTabPane('', '', key, 'add')
  }
  function isIframe(path) {
    return path.indexOf('ugc/Iframe') !== -1
  }
  function keyOnEdit(targetKey, action) {
    if (action === 'remove') {
      setInitTabPane('', '', targetKey, 'remove')
    }
  }
  function getActibeTab(href) {
    if (!href) {
      return href
    }
    const isIframePath = isIframe(href)
    return !isIframePath && !isSchema ? href.split('?')[0] : href
  }
  useEffect(() => {
    changeIframeUrl && changeIframeUrl(getQueryString('url', activeTabPaneKey))
  }, [])
  return (
    <div
      style={{
        left:
          initSubMenuJSon && initSubMenuJSon.length > 0
            ? 'calc(11% + 20px)'
            : !!initTabPane && initTabPane.length > 0
            ? '20px'
            : '0'
      }}
      className="lineRightStyle">
      {!!initTabPane && initTabPane.length > 0 ? (
        <Tabs
          hideAdd
          type="editable-card"
          onChange={(activeKey) => keyOnChange(activeKey)}
          onEdit={(targetKey, action) => keyOnEdit(targetKey, action)}
          activeKey={getActibeTab(activeTabPaneKey)}>
          {initTabPane.map((pane, breadListIndex) => (
            <TabPane
              tab={pane.title}
              key={pane.href}
              closable={initTabPane.length > 1}>
              {dom && dom()}
            </TabPane>
          ))}
        </Tabs>
      ) : (
        <>{dom && dom()}</>
      )}
      <style>
        {`
          .lineRightStyle {
            position: fixed;
            top: 60px;
            bottom: 5px;
            left: calc(10% + 20px);
            right: 20px;
            height: auto;
            width: auto;
            overflow: auto;
          }
          .lineRightStyle::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  )
}
export default IndexTabRight
