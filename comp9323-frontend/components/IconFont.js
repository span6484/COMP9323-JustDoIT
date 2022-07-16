import {
  FileTextOutlined,
  EditOutlined,
  TableOutlined,
  UserOutlined,
  UserSwitchOutlined,
  HomeOutlined,
  FileSearchOutlined,
  UserAddOutlined,
  KeyOutlined,
  SettingOutlined,
  ReadOutlined,
  MinusCircleOutlined,
  SnippetsOutlined,
  PlusCircleOutlined,
  ExperimentOutlined,
  HighlightOutlined,
  FlagOutlined,
  ProjectOutlined,
  MessageOutlined
} from '@ant-design/icons'
const getIconFont = ({ type, style }) => {
  const dom = (type, style) => {
    switch (type) {
      case 'contents':
        return <FileTextOutlined style={style} />
      case 'write':
        return <EditOutlined style={style} />
      case 'list':
        return <TableOutlined style={style} />
      case 'loginIn':
      case 'user':
        return <UserOutlined style={style} />
      case 'loginOut':
        return <UserSwitchOutlined style={style} />
      case 'home':
        return <HomeOutlined style={style} />
      case 'detail':
        return <FileSearchOutlined />
      case 'addUser':
        return <UserAddOutlined />
      case 'key':
        return <KeyOutlined />
      case 'setting':
        return <SettingOutlined />
      case 'page':
        return <ReadOutlined />
      case 'delete':
        return <MinusCircleOutlined style={style} />
      case 'userTask':
        return <SnippetsOutlined />
      case 'add':
        return <PlusCircleOutlined style={style} />
      case 'knowledge':
        return <ExperimentOutlined style={style} />
      case 'outlined':
        return <HighlightOutlined style={style} />
      case 'award':
        return <FlagOutlined style={style} />
      case 'project':
        return <ProjectOutlined style={style} />
      case 'message':
        return <MessageOutlined style={style}/>
      default:
        return <div />
    }
  }

  return dom(type, style)
}
export default getIconFont
