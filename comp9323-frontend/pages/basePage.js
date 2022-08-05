import 'antd/dist/antd.css'

import IndexTabTop from '../components/IndexComponents/TabTop'
import IndexTabLeft from '../components/IndexComponents/TabLeft'
import IndexTabRight from '../components/IndexComponents/TabRight'
import { withRouter } from 'next/router'
import { fatherSubMenu } from '../util/subMenu'
import { useState, useImperativeHandle, useEffect, useRef } from 'react'
import React from 'react'
import _ from 'lodash'
import {
  cookieUserMessageDo,
  delCookie,
  getToken,
} from '../util/common'
import {getUserProfile} from "./MockData"
const Page = ({ router, children, cRef, USERMESSAGE }) => {
  useImperativeHandle(cRef, () => ({
    setTabPane: (title, key, href, type) => {
      setInitTabPane(title, key, href, !type ? null : type)
    },
    getMessage: () => {
      getMeesage()
    },
    getIframe: () => {
      return getIframe()
    },
    getTabPane: (href, title) => {
      getTabPane(href, title)
    },
    setNewTabPane: (href, option) => {
      setNewTabPane(href, option)
    },
    getTabPaneOption: () => {
      return activeTabPaneKeyOption
    },
    socketPushMessage: (toUser, msg, type) => {
      socketPushMessage(toUser, msg, type)
    },
    rewardAddRemove: (rewardType, number) => {
      rewardAddRemove(rewardType, number)
    },
    setUserMsg : () => {
      setUserMsg();
    }
  }))
  const topRef = useRef();
  const [initTabPane, changeInitTabPane] = useState([])
  const [activeTabPaneKey, changeActiveTabPaneKey] = useState('')
  const [activeTabPaneKeyOption, changeActiveTabPaneKeyyOption] = useState(null)
  const [menuBoth, changeMenuBoth] = useState({})
  const [userMessage, changeUserMessage] = useState({
    name: '',
    nameText : '',
    loginType: 'loginOut',
    token: ''
  })
  const [body, changeBody] = useState(children)
  const [iframeHref, changeIframeHref] = useState('')
  const [__fatherSubMenu, change__fatherSubMenu] = useState(fatherSubMenu(null))
  const [pageLoad, changePageLoad] = useState(false)
  const [authorId,changeAuthorId] = useState("")
  const [userProfile,changeUserProfile] = useState({})
  if (body !== children) {
    changeBody(children)
  }
  function setUserMsg () {
    cookieUserMessageDo(
      null,
      (name, token, type) => {
        const json = getToken(token);
        changeAuthorId(json);
        changeUserMessage({
          name,
          nameText : json.nameText,
          loginType: 'loginIn',
          token
        })
        topRef?.current.changeUserMsg({
          name,
          nameText : json.nameText,
          loginType: 'loginIn',
          token
        });
      },
      null
    )

  }
  function getIframe() {
    return iframeHref
  }
  function getMeesage() {
    return _.clone(userMessage)
  }
  function getTabPane(href, title) {
    const _initTabPane = _.clone(initTabPane)
    for (let i = 0; i < _initTabPane.length; i++) {
      if (_initTabPane[i].href === href) {
        _initTabPane[i].title = title
        break
      }
    }
    sessionStorage.setItem('TAB_PANE', JSON.stringify(_initTabPane))
    changeInitTabPane(_initTabPane)
  }
  function getDetail(userId) {

  }
  function setNewTabPane(href, option) {
    const _initTabPane = _.clone(initTabPane)
    for (let i = 0; i < _initTabPane.length; i++) {
      if (_initTabPane[i].href === href) {
        _initTabPane[i].option = option
        break
      }
    }
    sessionStorage.setItem('TAB_PANE', JSON.stringify(_initTabPane))
    changeInitTabPane(_initTabPane)
  }
  function getActibeTab(href) {
    if (!href) {
      return href
    }
    return href.split('?')[0]
  }
  function rewardAddRemove(rewardType, number) {
    const filterIndex =
      reward &&
      reward.findIndex((item) => {
        return item.type === rewardType
      })
    if (filterIndex === -1) {
      reward.push({
        type: rewardType,
        count: number
      })
    } else {
      reward[filterIndex].count = number
    }
    console.log('reward', reward)
    changeReward(reward)
  }
  function isIframe(path) {
    return path.indexOf('ugc/Iframe') !== -1
  }
  function init(_asPath, thisFatherSubMenu) {
    let TAB_PANE = sessionStorage.getItem('TAB_PANE')
    const { pathname, asPath } = router
    let menu = '',
      fMenu = '',
      initSunMenu = '',
      title = '',
      href = '',
      choose = false,
      isSchema = false
    thisFatherSubMenu = thisFatherSubMenu || __fatherSubMenu
    const isIframeUrl = isIframe(asPath)
    for (let i = 0; i < thisFatherSubMenu.length; i++) {
      const _fatherSubMenu = thisFatherSubMenu[i]
      const _href = _fatherSubMenu.page
      if (!_href && _fatherSubMenu.child && _fatherSubMenu.child.length > 0) {
        for (let x = 0; x < _fatherSubMenu.child.length; x++) {
          const _child = _fatherSubMenu.child[x]
          if (_child.hasPage) {
            for (let z = 0; z < _child.hasPage.length; z++) {
              const _hasPage = _child.hasPage[z]
              if (_hasPage.schema.test(_asPath || asPath) && !choose) {
                menu = null
                href = _asPath || asPath
                title = _hasPage.title('')
                fMenu = _fatherSubMenu.value
                initSunMenu = _fatherSubMenu.child
                choose = true
                isSchema = true
                break
              } else if (choose) {
                break
              }
            }
          }
          if (
             pathname === getActibeTab(_child.page) &&
            (!isIframeUrl || (isIframeUrl && asPath === _child.page)) &&
            !choose
          ) {
            menu = _child.value
            href = _child.page
            title = _child.name
            fMenu = _fatherSubMenu.value
            initSunMenu = _fatherSubMenu.child
            choose = true
            break
          } else if (choose) {
            break
          }
        }
      } else {
        if (
          pathname === getActibeTab(_href) &&
          (!isIframeUrl || (isIframeUrl && asPath === _href)) &&
          !choose
        ) {
          menu = _fatherSubMenu.value
          href = _fatherSubMenu.page
          title = _fatherSubMenu.name
          fMenu = _fatherSubMenu.value
          choose = true
          break
        } else if (choose) {
          break
        }
      }
    }
    changeMenuBoth({
      menu,
      isSchema,
      fMenu,
      initSunMenu
    })
    if (!!TAB_PANE) {
      TAB_PANE = JSON.parse(TAB_PANE)
      let in_tab_pane = false
      for (let i = 0; i < TAB_PANE.length; i++) {
        if (TAB_PANE[i].href === (_asPath || asPath)) {
          in_tab_pane = true
          changeInitTabPane(TAB_PANE)
          changeActiveTabPaneKeyyOption(TAB_PANE[i].option)
          break
        }
      }
      if (!in_tab_pane) {
        if (!!href) {
          changeInitTabPane([
            {
              title: title,
              href: href
            }
          ])
        }
      }
    } else {
      if (!!href) {
        changeInitTabPane([
          {
            title: title,
            href: href
          }
        ])
      }
    }
    changeActiveTabPaneKey(_asPath || asPath)
    changePageLoad(true)
  }
  useEffect(() => {
    cookieUserMessageDo(
      USERMESSAGE,
      (name, token, type) => {
        const json = getToken(token);
        getDetail(json.id);
        changeAuthorId(json);
        changeUserMessage({
          name,
          nameText : json.nameText,
          loginType: 'loginIn',
          token
        })
        getUserProfile({
          uid :  USERMESSAGE && USERMESSAGE.uid
        }).then(res => {
          if(res.code === 200){
             changeUserProfile(res.result)
          }else{
            changeUserProfile({})
          }
        })
        const _json = fatherSubMenu(type)
        change__fatherSubMenu(_json)
        init(null, _json)
      },
      () => {
        const _json = fatherSubMenu(null)
        change__fatherSubMenu(_json)
        init(null, _json)
        loginOut()
      }
    )
  }, [])
  function socketPushMessage(toUser, message, type) {}
  function setInitTabPane(title, key, href, type) {
    type = type || 'add'
    const _initTabPane = _.clone(initTabPane)
    let choose = false
    for (let i = 0; i < _initTabPane.length; i++) {
      if (_initTabPane[i].href === href) {
        if (type === 'remove') {
          _initTabPane.splice(i, 1)
          href =
            _initTabPane[i >= _initTabPane.length ? _initTabPane.length - 1 : i]
              .href
        }
        choose = true
      }
    }
    if (!choose || type === 'remove') {
      if (type === 'add') {
        _initTabPane.push({
          title: title,
          href: href
        })
      }
      sessionStorage.setItem('TAB_PANE', JSON.stringify(_initTabPane))
      changeInitTabPane(_initTabPane)
    }
    if (href.split('?')[0] === router.pathname) {
      init(href, null)
    }
    window.location.href = href;
  }
  const [reward, changeReward] = useState([])
  function getReward(userId) {

  }
  function tabPaneInit(href) {
    sessionStorage.removeItem('TAB_PANE');
    window.location.href = href
  }
  function loginOut() {
    delCookie('USER_MESSAGE', null);
    window.location.href =    '/login?from=' +
      encodeURIComponent(window.location.href) +
      '&pageValue=' +
      menuBoth.menu;
  }
  return (
    <div>
      {!!__fatherSubMenu && pageLoad && (
        <IndexTabTop
          msg={{
            defaultOpenKeysList: [menuBoth.fMenu],
            userMessage,
            authorId,
            fatherSubMenu: __fatherSubMenu,
            reward,
            role : USERMESSAGE && USERMESSAGE.type,
            userProfile
          }}
          USERMESSAGE={USERMESSAGE}
          tabPaneInit={(href) => {
            tabPaneInit(href)
          }}
          loginOut={() => {
            loginOut()
          }}
          topRef={topRef}
        />
      )}
      {pageLoad && (
        <IndexTabLeft
          msg={{
            defaultOpenKeysList: [menuBoth.menu],
            initSunMenu: menuBoth.initSunMenu
          }}
          tabPaneInit={(href) => {
            tabPaneInit(href)
          }}
        />
      )}
      {pageLoad && (
        <IndexTabRight
          msg={{
            initSubMenuJSon: menuBoth.initSunMenu,
            activeTabPaneKey,
            isSchema: menuBoth.isSchema,
            initTabPane
          }}
          setInitTabPane={(title, key, href, type) => {
            setInitTabPane(title, key, href, type)
          }}
          changeIframeUrl={(iframeHref) => {
            changeIframeHref(iframeHref)
          }}
          dom={() => {
            return body
          }}
        />
      )}
    </div>
  )
}
export default withRouter(Page)
