export const useLocalStorage = (key) =>{
    const setItem = (value) => {
        try{
            window.localStorage.setItem(key, JSON.stringify(value));
            
        }
        catch(e){
            console.log(e);
        }
    };

    const getItem = (value) =>{
        try{
            return window.localStorage.getItem(key);
        }
        catch(e){
            console.log(e);
        }
    }
    
    return {setItem, getItem};
}

