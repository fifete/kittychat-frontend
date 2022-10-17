import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ModalCreateChannel } from './ModalCreateChannel';
import { ModalJoinChannel } from './ModalJoinChannel';

export const ProfileAside = (props) => {
  //modals
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenJoinChannel, setIsOpenJoinChannel] = useState(false);
  const [joinChannelData, setJoinChannelData] = useState(false);

  //channels
  const [newChannel, setNewChannel] = useState('');
  const [channels, setChannels] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('userName'))

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const response = await axios.get('http://localhost:3100/channels');
        setChannels(response.data);
      } catch (error) {
        console.error(error.message);
      }
    }    
    fetchDataUser();
  }, [newChannel]);

  const getChannelInfo = async(channel) => {
    setIsOpenJoinChannel(prev => !prev)
    setJoinChannelData(channel)
    try {
      const response = await axios.post('http://localhost:3100/channelByName', {
        channelName: channel.name_channel
      });
      console.log(response.data.message);
      props.setChannelInfo(response.data.message);
    } catch (error) {
      console.error(error.message);
    }
  }      

  const joinChannel = () => {
    props.socket.emit("joinChannel", joinChannelData)
    console.log('funcion?', joinChannelData);
  }

  return (
    <>
      <div className="profile-logo">
        <img src="../image/logo-home.png" alt="logo home" />
      </div>
      <div className="profile">
        <div>
          <img src="../image/user-img.png" alt="profile-img" />
        </div>
        <p>ARREGLAR</p>
      </div>

      <button onClick={() => setIsOpen(true)}>Crear canal</button>
      {isOpen && 
      <ModalCreateChannel 
        setIsOpen={setIsOpen} 
        setNewChannel={setNewChannel} 
      />}

      <div className="channels-info">
        <div className="channels-title">
          <i className="fa-solid fa-cat"></i>
          <h2>Channels</h2>
        </div>

        {isOpenJoinChannel && 
        <ModalJoinChannel 
          setIsOpenJoinChannel={ setIsOpenJoinChannel }
          channelInfo = { joinChannelData }
          user = { user }
          socket = { props.socket }
        />}
        <ul className="channels">
          { channels.map((channel) => 
            <div>
              <li key={channel.cid} onClick = {joinChannel}>{channel.name_channel}</li>
              <span onClick={() => getChannelInfo(channel)}>+</span>
            </div>
          )}
        </ul>
      </div>
    </>
  );
};
