export const constants = {
    /* When a user creates his/her account for the first time, this is the first default checklist 
        --> Use this as a foundation for structuring checklists
        --> See asyncHandler.registerHandler
    */
    newChecklist : 
    {
      name: 'Unknown',
      owner: 'Unknown',
      created_time: new Date().toLocaleString(),
      tasks : 
        [
          // first task
          {
            isOldItem : false,
            assigned_to : 'Unknown',
            complete : false,
            description : 'Unknown',
            due_date : '0000-00-00',
            key : Math.floor(Math.random() * 1000) + 100
          }
        ]
    }
}