//tab删选项目
export const fatherSubMenu = (type) => {
  const json = [
    {
      value: 'ctrip_page_tag',
      name: '选课界面',
      type: 'contents', //配置icon
      child: [
        {
          value: 'ctrip_page_page_type',
          page: '/courseSelection/list',
          name: '选课列表',
          type: 'page'
        },
        {
          value: 'ctrip_page_page_detail',
          page: '/courseSelection/detail',
          name: '选课详情',
          type: 'page'
        }
      ]
    },{
      value: 'ctrip_ccc_tag2',
      name: '选课界面2',
      type: 'contents', //配置icon
      child: [
        {
          value: 'ctrip_ccc_tag2_type2',
          page: '/lllll/list',
          name: '选课列表2',
          type: 'page'
        },
        {
          value: 'ctrip_ccc_tag2_detail2',
          page: '/lllll/detail',
          name: '选课详情2',
          type: 'page'
        }
      ]
    }
  ]
  return json
}
