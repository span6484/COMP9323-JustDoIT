//tab删选项目
export const fatherSubMenu = (type) => {
  const json = [
    {
      value: 'dash_board',
      name: 'DASHBOARD',
      type: 'contents',
      child: [
        {
          value: 'dash_board_course_overview',
          page: '/Dashboard/CourseOverview',
          name: 'Courses',
          type: 'page',
          hasPage: [
            {
              schema: /^(\/courseSelection\/courseDetail\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `${name}`
              }
            }
          ]
        },
        {
          value: 'dash_board_all_project',
          page: '/Dashboard/AllProject',
          name: 'My Projects',
          type: 'project'
        },
        {
          value: 'dash_board_award_projects',
          page: '/Dashboard/AwardProjects',
          name: 'Award',
          type: 'award'
        }
      ]
    }
  ]
  return json
}
