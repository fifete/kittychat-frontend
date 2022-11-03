import React, { useState, useEffect, useRef }from 'react';
import axios from 'axios';

export const ChatAside = ({socket, avatarChange}) => {
  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState([]);
  const [userAdded, setUserAdded] = useState('');
 
  useEffect(()=> {
    socket.on("user registered", isUserAdded => setUserAdded(isUserAdded))
    socket.on("newUserResponse", fetchDataUser);
    socket.on("usersInRoom", usersInRoom => setUsers1(usersInRoom));
  }, [socket])

  const fetchDataUser = async () => {
    try {
      const response = await axios.get('https://chatappservice.onrender.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error.message);
    }
  }    

  useEffect(() => {
    fetchDataUser();
  }, [userAdded, avatarChange, users1]);

  return (
    <>
    <div className='users-title'>
      <i className="fa-solid fa-users"></i>
      <h3>Usuarios 
      ({users1.current ? (users1.current === 1? users.length: users1[users1.current].length): users.length})</h3>
    </div>
    <div className='users-cards'>
      { users1.current ? ( users1.current === 1 &&
        users.map(user =>
        <div className='user' key={user.uid}>
          <img src={user.avatar} alt='userImage'/>     
          <div className='user-info flex'>
            <p>{user.user_name}</p>
            <p>{user.status? 'En línea': 'Desconectado'}</p>
          </div>
        </div>)
        ) : (
          users.map(user =>
          <div className='user' key={user.uid}>
            <img src={user.avatar} alt='userImage'/>   
            <div className='user-info flex'>  
              <p>{user.user_name}</p>
              <p>{user.status? 'En línea': 'Desconectado'}</p>
            </div>
          </div>
        )
      )}
      {users1[users1.current] && users1.current !== 1 &&
        users1[users1.current].map((user) =>
        <div className='user' key={user.uid}> 
          <img src={user.image} alt='userImage'/> 
          <p>{user.user_name}</p>
        </div>
      )}
    </div>
  </>
  )
}
