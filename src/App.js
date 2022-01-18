import { useState, useReducer } from 'react';
import './App.css';

import Dashboard from './components/Dashboard';
import Menu from './components/Menu';

import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import {Flex} from './Flex';
import update from 'immutability-helper';


const pubnub = new PubNub({
    publishKey : "pub-c-8fbea598-c1c7-407c-8810-3e1ffd745e44",
    subscribeKey : "sub-c-e53297aa-789e-11ec-add2-a260b15b99c5",
    secretKey: "sec-c-NjYwMmYzMWQtNGQyYy00ZWRmLTkwZDctMDQ2ZGZhODMzMTk0",
    uuid : "serverUUID-01920392"
});

const colorMap = new Map();

const reducer = (state, action) => {
    switch (action.type) {
        case 'clear':
            return [];
        case 'retrieveLocal':
            return action.data;
        case 'add':
            const data = action.data;

            if (!colorMap.has(data.character)) 
            {
                const rnd = "#" + Math.floor( Math.random() * 16777215)
                    .toString(16).padStart(6, '0').toUpperCase();
                colorMap.set(data.character, rnd);
            }

            data.color = colorMap.get(data.character);
            const dilemmaIndex = state.findIndex(dilemma => dilemma.name === data.dilemma);

            if (dilemmaIndex < 0)
            {
                return update(state, {$push : [{ 
                                                name : data.dilemma,
                                                content : [data]
                                                }]
                                            });
            }
            else
            {   
                return update(state, {[dilemmaIndex] : { content : {$push : [data]}}})
            }
        default:
            throw new Error();
    }
}

export default function App() {

    const [userCount, setUserCount] = useState(0);
    const [channel, setChannel] = useState("");
    const [strandedData, dataDispatch] = useReducer(reducer, []);


    return (
        <Flex container flexDirection="column" alignItems="stretch" height="100%">
        <PubNubProvider client={pubnub}>
            <Flex flex="0">
                <Menu 
                    channel={channel}
                    setChannel={setChannel} 
                    userCount={userCount}
                    strandedData={strandedData}
                    dataDispatch={dataDispatch}
                />
                </Flex>
            <Flex flex="1" className="main-dashboard">
                <Dashboard 
                    strandedData={strandedData}
                    dataDispatch={dataDispatch}
                    channel={channel}
                    setUserCount={setUserCount}
                />
                </Flex>
        </PubNubProvider>
        </Flex>
    );
}