import { Breadcrumb } from 'antd'

import IconFont from '../IconFont'

import _ from 'lodash'

import { useImperativeHandle } from 'react'

function breadcrumbItemClick(i, x, msg, pro) {
  const { initTabPane } = msg
  const { initTabPaneChange } = pro
  let _initTabPane = _.clone(initTabPane)
  const breadList = _initTabPane[i].breadList
  if (x >= breadList.length) {
    return
  }
  for (let z = breadList.length - 1; z >= 0; z--) {
    if (z >= x) {
      const redirectBack = breadList[z].redirectBack
      redirectBack && redirectBack()
    }
  }

  breadList.splice(x)
  initTabPaneChange(_initTabPane)
}

const TabRightBread = ({ msg, func, cRef }) => {
  const { pane, initTabPane, breadListIndex } = msg

  const { initTabPaneChange } = func

  useImperativeHandle(cRef, () => ({
    breadcrumbItemClick: (breadKey, x) => {
      let breadIndex
      for (let i = 0; i < initTabPane.length; i++) {
        if (initTabPane[i].value === breadKey) {
          breadIndex = i
          break
        }
      }
      if (breadIndex !== undefined && breadIndex !== null) {
        breadcrumbItemClick(
          breadIndex,
          x,
          {
            initTabPane
          },
          {
            initTabPaneChange
          }
        )
      }
    }
  }))
  return (
    <>
      {pane.breadList && pane.breadList.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <IconFont type="home" style={null} />
              <span>{pane.title}</span>
            </Breadcrumb.Item>
            {pane.breadList.map((bread, index) => (
              <Breadcrumb.Item key={'breadcrumb' + index}>
                <IconFont type={bread.type} style={null} />
                <span>{bread.title}</span>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
      )}
    </>
  )
}
export default TabRightBread
