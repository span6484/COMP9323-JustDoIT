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
              schema: /^(\/Dashboard\/CourseDetail\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `${name}`
              }
            },
            {
              schema: /^(\/Dashboard\/NewRequirement\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `${name}`
              }
            },
            {
              schema: /^(\/Dashboard\/RequirementDetail\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `${name}`
              }
            },
            {
              schema: /^(\/Dashboard\/NewRequirement\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `${name}`
              }
            },
            {
              schema: /^(\/Dashboard\/NewProposal\?id=)([0-9a-zA-Z]+)+/,
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
          type: 'project',
          hasPage: [
                  {
                    schema: /^(\/project\/detail\?id=)([0-9a-zA-Z]+)+/,
                    title: (name) => {
                      return `${name}`
                    }
                  },
                  {
                    schema: /^(\/project\/edit\?id=)([0-9a-zA-Z]+)+/,
                    title: (name) => {
                      return `${name}`
                    }
                  },
                  {
                    schema: /^(\/project\/work\?id=)([0-9a-zA-Z]+)+/,
                    title: (name) => {
                      return `${name}`
                    }
                  }
                ]
        },
        {
          value: 'dash_board_award_projects',
          page: '/Dashboard/AwardProjects',
          name: 'Award',
          type: 'award',
          hasPage: [
            {
              schema: /^(\/project\/showcase\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `${name}`
              }
            }
          ]
        }
      ]
    },
    {
      value: 'user_message',
      name: 'MESSAGE',
      type: 'message',
      child: [
        {
          value: 'user_message_all_message',
          page: '/Message/AllMessage',
          name: 'All',
          type: 'message',
        },
        {
          value: 'user_message_read_message',
          page: '/Message/UnReadMessage',
          name: 'Unread',
          type: 'message',
        },
        {
          value: 'user_message_un_read_message',
          page: '/Message/ReadMessage',
          name: 'Read',
          type: 'message'
        }
      ]
    }
  ]
  return json
}
