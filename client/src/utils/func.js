export const boardUsers = (users) => {
    if(!users)
        {
            return [];
        }
     
    const userArr = [];
    const map = {};
    users.forEach(user => {
      for(let i = 0; i <= user.displayName.length-1; i++)
        {
           if(!user.displayName)
            {
                continue;
            }
            if(map[user.displayName.slice(0,i+1).toUpperCase() + user.colorIndex])
                {
                    if(i === user.displayName.length - 1)
                        {
                           userArr.push(user);
                           return; 
                        }
                    continue;
                }
              
                map[user.displayName.slice(0,i+1).toUpperCase() + user.colorIndex] = true;
                user.shortName = user.displayName.slice(0,i+1);
                userArr.push(user);
                return;
        }
        
    });
    console.log(map);
    return userArr;
}


 