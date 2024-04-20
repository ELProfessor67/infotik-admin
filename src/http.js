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
} from "firebase/firestore";


import {FIREBASE_AUTH,FIREBASE_DB} from '@/firebaseConfig';



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