import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
  } from "firebase/auth";
import {
    doc,
    collection,
    getDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";


import {FIREBASE_AUTH,FIREBASE_DB} from '@/firebaseConfig';
import uuid from "uuid-random";
import { saveMediaToStorage } from "./utils/saveMediaToStorage";



export const login = async (email,password) => {
    try {   
        const isAuthenticate = await signInWithEmailAndPassword(FIREBASE_AUTH,email,password);
        const user = FIREBASE_AUTH.currentUser
        const docRef = doc(collection(FIREBASE_DB, 'user'), user.uid);
        const getUserDetails = await getDoc(docRef);
        if(getUserDetails.exists()){
            const userData = getUserDetails.data();
            if(userData.admin){
                return true
            }else{
                await signOut(FIREBASE_AUTH);
                return false;
            }
        }
    } catch (error) {
        return false
    }
}


export const loadme = async () => {
    
    try {
        FIREBASE_AUTH.onAuthStateChanged((exists) => {
            if(exists){
                const user = FIREBASE_AUTH.currentUser
                return user;
            }else{
               return null
            }
        })
       
    } catch (error) {
        return null
    }
}


export const getSinglePosts = async (uid) => {
    try {
        const docRef = doc(collection(FIREBASE_DB,'post'),uid)
        const post = await getDoc(docRef);
        if(post.exists){
            return post.data();
        }
        return null
    } catch (error) {
        return null
    }
}

export const getUserById = async (id) => {
    try {
      const docSnapshot = await getDoc(doc(FIREBASE_DB, "user", id));
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(String(error));
    }
};

export const approvePost = async (uid) => {
    try {
        const docRef = doc(collection(FIREBASE_DB,'post'),uid)
        const post = await getDoc(docRef);
        if(post.exists()){
            const data = post.data();
            await updateDoc(docRef,{
                approved: !data.approved
            })
            return true
        }
        return false
    } catch (error) {
        return false
    }
}
export const deletePost = async (uid) => {
    try {
        const docRef = doc(collection(FIREBASE_DB,'post'),uid)
        const post = await getDoc(docRef);
        if(post.exists()){
            const data = post.data();
            await deleteDoc(docRef);
            return true
        }
        return false
    } catch (error) {
        return false
    }
}


export const isExist = async (uid) => {
    try {
        const docRef = doc(collection(FIREBASE_DB,'post'),uid)
        const post = await getDoc(docRef);
        return post.exists();
    } catch (error) {
        return false
    }
}

export const fieldUpdate = async (uid,object) => {
    try {
        const docRef = doc(collection(FIREBASE_DB,'post'),uid)
        const post = await getDoc(docRef);
        if(post.exists()){
            const data = post.data();
            await updateDoc(docRef,object)
            return true
        }
        return false
    } catch (error) {
        return false
    }
}


export const createPost = async (description, video, thumbnail, newstitle,newsdescription,newslink, hashtags) => {
    try {
        console.log("saveing....")
        
        let storagePostId = uuid()
        let media = await Promise.all([
            saveMediaToStorage(video, `post/${FIREBASE_AUTH.currentUser.uid}/${storagePostId}/video`),
            saveMediaToStorage(thumbnail, `post/${FIREBASE_AUTH.currentUser.uid}/${storagePostId}/thumbnail`)
        ])

        console.log(storagePostId)

        
        const ref = doc(collection(FIREBASE_DB,'post'),storagePostId)
        await setDoc(ref,{
            creator: FIREBASE_AUTH.currentUser.uid,
            media,
            description,
            likesCount: 0,
            commentsCount: 0,
            creation: serverTimestamp(),
            uid: storagePostId,
            newstitle,
            newsdescription,
            newslink,
            hashtags,
            approved: false
        })
       console.log("done...")
        return true;
    } catch (error) {
        console.log(error.message,"error")
        return false
    }
}