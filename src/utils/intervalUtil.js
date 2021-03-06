import {useEffect,useRef} from 'react';

export function useInterval(callback,delay){
    const savedCallback=useRef();
    //updating latest callback
    useEffect(()=>{
        savedCallback.current=callback;
    },[callback]);
    
    //setup the interval
    useEffect(()=>{
        function tick(){
            savedCallback.current();
        }
        if(delay!==null){
            let id=setInterval(tick,delay);
            return ()=>clearInterval(id);
        }
    },[delay]);
}
