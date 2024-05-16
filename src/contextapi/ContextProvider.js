"use client"
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { loadme } from '@/http';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

export const Context = createContext();

export function Provider({children}) {
    const [user, setUser] = useState(null);
    const [isAuth, setisAuth] = useState(undefined);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);


    useEffect(() => {
      (async function (){
        FIREBASE_AUTH.onAuthStateChanged((exists) => {
          if(exists){
              const user = FIREBASE_AUTH.currentUser
              setUser(user);
              setisAuth(true)
          }else{
             setUser(null);
             setisAuth(false)
          }
        })


        try {
          const q = query(
              collection(FIREBASE_DB, 'post')
          )
          const unsubscribe = onSnapshot(q, (snapshot) => {
              const postData = [];
              snapshot.forEach((doc) => {
                postData.push({ id: doc.id, ...doc.data() });
              });
              setPosts(postData);
            });
          
        } catch (error) {
            console.log(error.message,"error");
        }



        try {
          const q = query(
            collection(FIREBASE_DB, 'user')
          )
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const userdata = [];
            snapshot.forEach((doc) => {
              userdata.push({ id: doc.id, ...doc.data() });
            });
            setUsers(userdata);
            
          });
        } catch (error) {
          
        }
      })()
    },[])
  return (
    <Context.Provider value={{user,setUser,isAuth,setisAuth,posts,users}}>
      {children}
    </Context.Provider>
  );
}
