import React, {useEffect, useRef} from 'react';
import './Menu.css';
import {Flex} from './../Flex';

import { usePubNub } from 'pubnub-react';


const LOCAL_STORAGE_ROOM_KEY = "stranded.gameRoom";


export default function Menu({channel, setChannel, userCount, strandedData, dataDispatch}) {

    const pubnub = usePubNub();
    const room_prefix = "game.";

    const generateCode = () => {
        return Math.floor(1000 + Math.random() * 9000);
    };

    const createRoom = () => {
        dataDispatch({type : 'clear'});
        const game_code = generateCode();
        const channel_name = room_prefix + game_code.toString();
        
        deleteHistory(channel_name);
        setChannel(room_prefix + game_code.toString());

        pubnub.publish({
            channel : channel_name,
            message : {'code' : game_code, 'flag' : "INIT_CHANNEL"}
          },
          function(status, response) {
            if (status.error) {
              console.log(status)
            }
        });

    };

    const deleteHistory = (channel) => {
        pubnub.deleteMessages(
            {
                channel: channel,
                count:10
            },
            (result) => {
                pubnub.fetchMessages(
                    {
                        channels: [channel],
                        count: 100
                    },
                    (status, response) => {
                        if (response ) {
                            if (response.channels.length > 0) {
                                deleteHistory(channel);
                            }
                        }
                    }
                );
            }
        );
    }

    const startGame = event => {
        console.log("Start game");
        pubnub.publish(
            {
                channel : channel,
                message : {'flag' : "START_GAME"}
            }, (status, response) => {
                if (status.error) {
                    console.log(status);
                }
            }
        );
    };

    const clearData = event => {
        dataDispatch({type : "clear"});
    };

    useEffect(() => {
        const storedGameRoom = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_ROOM_KEY));
        if (storedGameRoom) setChannel(storedGameRoom);
    }, [setChannel])

    useEffect(() => {
        if (channel !== "") {
            sessionStorage.setItem(LOCAL_STORAGE_ROOM_KEY, JSON.stringify(channel))
            pubnub.unsubscribeAll();
            pubnub.subscribe({ channels : [channel], withPresence : true });
        }
    }, [pubnub, channel])

    return (
        <Flex 
            container 
            flexDirection="row" 
            margin="5px" 
            padding="5px" 
            className="panel"
        >
            <Flex container flexDirection="row" flex="1">
                <button className="menu-button" onClick={createRoom}>Create Room</button>
                <button className="menu-button" disabled={!channel} onClick={startGame}>Start Game</button> 
                <button className="menu-button" onClick={clearData} disabled={strandedData.length === 0}>Clear Data</button>            
            </Flex>
            <Flex container flex="1" justifyContent="center">
                <h2>Stranded {channel.substring(channel.length - 4)}</h2>
            </Flex>
            <Flex container flex="1" justifyContent="center">
                <h3>Players: {userCount}</h3>
            </Flex>
        </Flex>
    )
}
